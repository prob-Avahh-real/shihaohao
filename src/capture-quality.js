/**
 * 拍摄质量评估 — 识别脏镜头、模糊、过暗/过曝等导致误判的场景
 */

const SAMPLE = 96;

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function saturation(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  if (max === min) return 0;
  const l = (max + min) / 2;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}

function samplePixels(imageData) {
  const { data, width, height } = imageData;
  const stepX = Math.max(1, Math.floor(width / SAMPLE));
  const stepY = Math.max(1, Math.floor(height / SAMPLE));
  const pixels = [];
  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const i = (y * width + x) * 4;
      pixels.push({
        x: x / width,
        y: y / height,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        l: luminance(data[i], data[i + 1], data[i + 2]),
        s: saturation(data[i], data[i + 1], data[i + 2]),
      });
    }
  }
  return { pixels, width, height, stepX, stepY };
}

function laplacianVariance(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      gray[y * width + x] = luminance(data[i], data[i + 1], data[i + 2]);
    }
  }
  const vals = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / SAMPLE));
  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const c = gray[y * width + x];
      const lap = 4 * c
        - gray[(y - step) * width + x]
        - gray[(y + step) * width + x]
        - gray[y * width + (x - step)]
        - gray[y * width + (x + step)];
      vals.push(lap);
    }
  }
  if (!vals.length) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
}

function regionMean(pixels, inRegion) {
  const subset = pixels.filter(inRegion);
  if (!subset.length) return 0;
  return subset.reduce((s, p) => s + p.l, 0) / subset.length;
}

const CAPTURE_FLAGS = {
  blur: { label: '画面模糊', tip: '请擦净镜头、稳住手机后重拍' },
  low_light: { label: '光线不足', tip: '移至明亮处或打开补光' },
  overexposure: { label: '过曝/反光', tip: '避开直射光，调整角度后重拍' },
  low_contrast: { label: '对比度偏低', tip: '镜头可能有污渍或雾气，请擦拭后重拍' },
  vignette: { label: '边缘暗角', tip: '检查镜头是否被遮挡或弄脏' },
  haze: { label: '画面发灰', tip: '镜头可能脏污或对焦失败，请清洁后重拍' },
  dirty_lens: { label: '疑似脏镜头', tip: '用软布擦拭摄像头，确保画面清晰' },
};

/**
 * @returns {{ reliable: boolean, score: number, flags: string[], warnings: string[], tips: string[], metrics: object }}
 */
export function assessCaptureQuality(imageData) {
  if (!imageData?.data?.length) {
    return {
      reliable: false,
      score: 0,
      flags: ['unreadable'],
      warnings: ['无法读取图像'],
      tips: ['请重新拍照'],
      metrics: {},
    };
  }

  const { pixels } = samplePixels(imageData);
  const ls = pixels.map((p) => p.l);
  const ss = pixels.map((p) => p.s);
  const avgL = ls.reduce((a, b) => a + b, 0) / ls.length;
  const avgS = ss.reduce((a, b) => a + b, 0) / ss.length;
  const lMin = Math.min(...ls);
  const lMax = Math.max(...ls);
  const lSpread = lMax - lMin;
  const lMean = avgL;
  const lVar = ls.reduce((s, v) => s + (v - lMean) ** 2, 0) / ls.length;
  const lStd = Math.sqrt(lVar);

  const brightClip = ls.filter((l) => l > 0.95).length / ls.length;
  const darkClip = ls.filter((l) => l < 0.06).length / ls.length;
  const hazeRatio = pixels.filter((p) => p.s < 0.1 && p.l > 0.2 && p.l < 0.8).length / pixels.length;

  const centerL = regionMean(pixels, (p) => p.x > 0.3 && p.x < 0.7 && p.y > 0.3 && p.y < 0.7);
  const cornerL = regionMean(pixels, (p) =>
    (p.x < 0.2 || p.x > 0.8) && (p.y < 0.2 || p.y > 0.8));
  const vignetteRatio = centerL > 0.05 ? cornerL / centerL : 1;

  const lapVar = laplacianVariance(imageData);
  const likelyBlur = lapVar < 0.0012 && lStd > 0.035 && lSpread < 0.22;
  const severeBlur = lapVar < 0.00025 && lStd > 0.02;

  const flags = [];
  const warnings = [];
  const tips = [];

  if (likelyBlur || severeBlur) {
    flags.push('blur');
    warnings.push(CAPTURE_FLAGS.blur.label);
    tips.push(CAPTURE_FLAGS.blur.tip);
  }
  if (avgL < 0.14 && darkClip > 0.35) {
    flags.push('low_light');
    warnings.push(CAPTURE_FLAGS.low_light.label);
    tips.push(CAPTURE_FLAGS.low_light.tip);
  }
  if (brightClip > 0.12) {
    flags.push('overexposure');
    warnings.push(CAPTURE_FLAGS.overexposure.label);
    tips.push(CAPTURE_FLAGS.overexposure.tip);
  }
  if (lStd < 0.07 && lSpread < 0.35) {
    flags.push('low_contrast');
    warnings.push(CAPTURE_FLAGS.low_contrast.label);
    tips.push(CAPTURE_FLAGS.low_contrast.tip);
  }
  if (vignetteRatio < 0.62 && centerL > 0.18) {
    flags.push('vignette');
    warnings.push(CAPTURE_FLAGS.vignette.label);
    tips.push(CAPTURE_FLAGS.vignette.tip);
  }
  if (hazeRatio > 0.38 && avgS < 0.18) {
    flags.push('haze');
    warnings.push(CAPTURE_FLAGS.haze.label);
    tips.push(CAPTURE_FLAGS.haze.tip);
  }

  const dirtySignals = [
    flags.includes('low_contrast'),
    flags.includes('haze'),
    flags.includes('vignette'),
    flags.includes('blur') && flags.includes('low_contrast'),
  ].filter(Boolean).length;

  if (dirtySignals >= 2 || (flags.includes('haze') && flags.includes('vignette'))) {
    flags.push('dirty_lens');
    if (!warnings.includes(CAPTURE_FLAGS.dirty_lens.label)) {
      warnings.push(CAPTURE_FLAGS.dirty_lens.label);
      tips.push(CAPTURE_FLAGS.dirty_lens.tip);
    }
  }

  let score = 100;
  score -= flags.includes('blur') ? 28 : 0;
  score -= flags.includes('low_light') ? 22 : 0;
  score -= flags.includes('overexposure') ? 18 : 0;
  score -= flags.includes('low_contrast') ? 20 : 0;
  score -= flags.includes('vignette') ? 15 : 0;
  score -= flags.includes('haze') ? 18 : 0;
  score -= flags.includes('dirty_lens') ? 12 : 0;
  score = Math.max(0, Math.min(100, score));

  const criticalFlags = ['dirty_lens', 'blur', 'low_light'];
  const reliable = score >= 55 && !criticalFlags.some((f) => flags.includes(f));

  return {
    reliable,
    score,
    flags: [...new Set(flags)],
    warnings: [...new Set(warnings)],
    tips: [...new Set(tips)],
    metrics: {
      avgLightness: Number(avgL.toFixed(3)),
      avgSaturation: Number(avgS.toFixed(3)),
      lightnessStd: Number(lStd.toFixed(3)),
      lightnessSpread: Number(lSpread.toFixed(3)),
      brightClipRatio: Number(brightClip.toFixed(3)),
      darkClipRatio: Number(darkClip.toFixed(3)),
      hazeRatio: Number(hazeRatio.toFixed(3)),
      vignetteRatio: Number(vignetteRatio.toFixed(3)),
      laplacianVariance: Number(lapVar.toFixed(6)),
    },
  };
}

export { CAPTURE_FLAGS, luminance, saturation, laplacianVariance };

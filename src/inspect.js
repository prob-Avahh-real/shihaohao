/**
 * 图像视觉快检 + 综合评分（含拍摄质量容错）
 */

import { getCategory, scoreToGrade, isPassingGrade } from './standards.js';
import { assessCaptureQuality } from './capture-quality.js';

const SAMPLE = 64;
const GRID = 8;

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s, l };
}

function hueInRange(h, min, max) {
  if (min <= max) return h >= min && h <= max;
  return h >= min || h <= max;
}

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * 局部暗斑检测 — 区分均匀暗化（镜头/光线问题）与局部腐坏斑
 */
function detectLocalizedSpots(imageData, captureMetrics) {
  const { data, width, height } = imageData;
  const cellW = Math.max(1, Math.floor(width / GRID));
  const cellH = Math.max(1, Math.floor(height / GRID));
  const cells = [];

  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      let sumL = 0;
      let sumS = 0;
      let n = 0;
      const x0 = gx * cellW;
      const y0 = gy * cellH;
      const x1 = Math.min(width, x0 + cellW);
      const y1 = Math.min(height, y0 + cellH);
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const i = (y * width + x) * 4;
          const { s } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
          sumL += luminance(data[i], data[i + 1], data[i + 2]);
          sumS += s;
          n++;
        }
      }
      if (n) cells.push({ gx, gy, l: sumL / n, s: sumS / n });
    }
  }

  const allL = cells.map((c) => c.l).sort((a, b) => a - b);
  const medianL = allL[Math.floor(allL.length / 2)] || 0.5;
  const darkCells = cells.filter((c) => c.l < medianL - 0.12);

  const uniformDark = darkCells.length / cells.length > 0.72;
  const lowContrastCapture = (captureMetrics?.lightnessStd ?? 1) < 0.08;

  if (uniformDark || lowContrastCapture) {
    return {
      spotRatio: 0,
      localizedSpots: 0,
      uniformDark,
      skippedDueToCapture: lowContrastCapture || uniformDark,
    };
  }

  let localizedSpots = 0;
  for (const cell of darkCells) {
    const neighbors = cells.filter(
      (c) => Math.abs(c.gx - cell.gx) <= 1 && Math.abs(c.gy - cell.gy) <= 1 && c !== cell,
    );
    if (!neighbors.length) continue;
    const neighL = neighbors.reduce((s, c) => s + c.l, 0) / neighbors.length;
    if (cell.l < neighL - 0.1) localizedSpots++;
  }

  return {
    spotRatio: localizedSpots / cells.length,
    localizedSpots,
    uniformDark: false,
    skippedDueToCapture: false,
  };
}

/**
 * @param {ImageData} imageData
 * @param {string} categoryId
 */
export function analyzeImageData(imageData, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat || !imageData?.data?.length) {
    return {
      visualScore: null,
      visualReliability: 'none',
      captureQuality: null,
      metrics: {},
      issues: [],
      captureWarnings: ['无法读取图像'],
      autoHints: {},
    };
  }

  const captureQuality = assessCaptureQuality(imageData);
  const reliable = captureQuality.reliable;

  const { data, width, height } = imageData;
  const stepX = Math.max(1, Math.floor(width / SAMPLE));
  const stepY = Math.max(1, Math.floor(height / SAMPLE));

  let count = 0;
  let sumH = 0;
  let sumS = 0;
  let sumL = 0;
  let hueOk = 0;

  const v = cat.visual;

  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { h, s, l } = rgbToHsl(r, g, b);
      count++;
      sumH += h;
      sumS += s;
      sumL += l;
      if (hueInRange(h, v.hueMin, v.hueMax)) hueOk++;
    }
  }

  const avgH = sumH / count;
  const avgS = sumS / count;
  const avgL = sumL / count;
  const hueRatio = hueOk / count;

  const spotInfo = detectLocalizedSpots(imageData, captureQuality.metrics);
  const grayRatio = captureQuality.metrics.hazeRatio ?? 0;

  const foodIssues = [];
  const captureWarnings = [...captureQuality.warnings];
  let visualScore = null;
  let visualReliability = 'low';

  if (!reliable) {
    visualReliability = 'low';
    return {
      visualScore: null,
      visualReliability,
      captureQuality,
      metrics: {
        avgHue: Math.round(avgH),
        avgSaturation: Number(avgS.toFixed(3)),
        avgLightness: Number(avgL.toFixed(3)),
        hueMatchRatio: Number(hueRatio.toFixed(3)),
        localizedSpotRatio: Number(spotInfo.spotRatio.toFixed(3)),
        localizedSpots: spotInfo.localizedSpots,
        captureScore: captureQuality.score,
        ...captureQuality.metrics,
      },
      issues: [],
      captureWarnings,
      captureTips: captureQuality.tips,
      autoHints: {},
      spotSkipped: true,
    };
  }

  visualReliability = captureQuality.score >= 75 ? 'high' : 'medium';
  visualScore = 100;

  const spotFail = spotInfo.localizedSpots >= 2 && spotInfo.spotRatio > 0.04;

  if (avgS < v.minSaturation) {
    visualScore -= 22;
    foodIssues.push('色泽偏淡或萎蔫，饱和度低于标准');
  }
  if (spotFail && !spotInfo.skippedDueToCapture) {
    visualScore -= 28;
    foodIssues.push(`局部暗斑/腐坏约 ${(spotInfo.spotRatio * 100).toFixed(1)}%，超出限值`);
  }
  if (grayRatio > v.maxGrayRatio && avgS < v.minSaturation * 1.2) {
    visualScore -= 15;
    foodIssues.push('灰败区域偏多，可能存在霉变或氧化');
  }
  if (avgL < v.minBrightness && captureQuality.metrics.darkClipRatio < 0.5) {
    visualScore -= 12;
    foodIssues.push('整体亮度偏低，新鲜度存疑');
  }
  if (hueRatio < 0.35 && cat.id !== 'packaged') {
    visualScore -= 12;
    foodIssues.push('主色调与品类典型色泽偏差较大');
  }

  visualScore = Math.max(0, Math.min(100, Math.round(visualScore)));

  const autoHints = {
    colorFresh: visualScore >= 70 && avgS >= v.minSaturation * 0.85,
    noSpots: !spotFail && !spotInfo.uniformDark,
  };

  return {
    visualScore,
    visualReliability,
    captureQuality,
    metrics: {
      avgHue: Math.round(avgH),
      avgSaturation: Number(avgS.toFixed(3)),
      avgLightness: Number(avgL.toFixed(3)),
      localizedSpotRatio: Number(spotInfo.spotRatio.toFixed(3)),
      localizedSpots: spotInfo.localizedSpots,
      grayRatio: Number(grayRatio.toFixed(3)),
      hueMatchRatio: Number(hueRatio.toFixed(3)),
      captureScore: captureQuality.score,
      ...captureQuality.metrics,
    },
    issues: foodIssues,
    captureWarnings,
    captureTips: captureQuality.tips,
    autoHints,
    spotSkipped: spotInfo.skippedDueToCapture,
  };
}

/**
 * @param {string} categoryId
 * @param {object} imageAnalysis
 * @param {Record<string, boolean>} checklistAnswers
 */
export function evaluateInspection(categoryId, imageAnalysis, checklistAnswers = {}) {
  const cat = getCategory(categoryId);
  if (!cat) {
    return { passed: false, score: 0, grade: 'F', failures: ['未知品类'], summary: '' };
  }

  const reliability = imageAnalysis?.visualReliability ?? 'none';
  const useAutoHints = reliability === 'high' || reliability === 'medium';

  const failures = [];
  const warnings = [];
  let checklistScore = 0;
  let requiredTotal = 0;
  let requiredPass = 0;

  for (const item of cat.checklist) {
    let ok = Boolean(checklistAnswers[item.id]);
    if (useAutoHints && item.autoKey && imageAnalysis?.autoHints?.[item.autoKey] !== undefined) {
      if (checklistAnswers[item.id] === undefined) {
        ok = imageAnalysis.autoHints[item.autoKey];
      }
    }
    if (item.required) {
      requiredTotal++;
      if (ok) requiredPass++;
      else failures.push(item.label);
    } else if (!ok) {
      warnings.push(item.label);
    }
    if (ok) checklistScore += item.required ? 10 : 4;
  }

  const maxChecklist = cat.checklist.reduce((s, i) => s + (i.required ? 10 : 4), 0);
  const checklistPct = maxChecklist ? (checklistScore / maxChecklist) * 100 : 0;
  const visual = imageAnalysis?.visualScore;

  let score;
  if (reliability === 'high') {
    score = Math.round((visual ?? 0) * 0.45 + checklistPct * 0.55);
  } else if (reliability === 'medium') {
    score = Math.round((visual ?? 0) * 0.3 + checklistPct * 0.7);
  } else {
    score = Math.round(checklistPct);
  }

  const grade = scoreToGrade(score);
  const passed = isPassingGrade(grade) && requiredPass === requiredTotal;

  let summary;
  if (reliability === 'low' || reliability === 'none') {
    summary = passed
      ? `拍摄质量不足，已按感官清单为主判定为合格（${score} 分）`
      : `拍摄质量不足，视觉结果未采信；${failures.slice(0, 2).join('；')}${failures.length > 2 ? '…' : ''}`;
  } else if (passed) {
    summary = `符合 ${cat.gbRefs[0]} 等标准的外观感官快检要求，综合 ${score} 分`;
  } else {
    summary = `未达质检标准：${failures.slice(0, 2).join('；')}${failures.length > 2 ? '…' : ''}`;
  }

  return {
    passed,
    score,
    grade,
    failures,
    warnings,
    requiredPass,
    requiredTotal,
    visualScore: visual,
    visualReliability: reliability,
    checklistPct: Math.round(checklistPct),
    captureWarnings: imageAnalysis?.captureWarnings ?? [],
    summary,
    gbRefs: cat.gbRefs,
  };
}

export function loadImageToCanvas(fileOrBlob, canvas) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      const max = 512;
      let w = img.width;
      let h = img.height;
      if (w > max || h > max) {
        const scale = max / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(ctx.getImageData(0, 0, w, h));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };
    img.src = url;
  });
}

export { rgbToHsl, hueInRange, assessCaptureQuality, detectLocalizedSpots };

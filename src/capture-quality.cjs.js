var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/capture-quality.js
var capture_quality_exports = {};
__export(capture_quality_exports, {
  CAPTURE_FLAGS: () => CAPTURE_FLAGS,
  assessCaptureQuality: () => assessCaptureQuality,
  laplacianVariance: () => laplacianVariance,
  luminance: () => luminance,
  saturation: () => saturation
});
module.exports = __toCommonJS(capture_quality_exports);
var SAMPLE = 96;
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
        s: saturation(data[i], data[i + 1], data[i + 2])
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
      const lap = 4 * c - gray[(y - step) * width + x] - gray[(y + step) * width + x] - gray[y * width + (x - step)] - gray[y * width + (x + step)];
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
var CAPTURE_FLAGS = {
  blur: { label: "\u753B\u9762\u6A21\u7CCA", tip: "\u8BF7\u64E6\u51C0\u955C\u5934\u3001\u7A33\u4F4F\u624B\u673A\u540E\u91CD\u62CD" },
  low_light: { label: "\u5149\u7EBF\u4E0D\u8DB3", tip: "\u79FB\u81F3\u660E\u4EAE\u5904\u6216\u6253\u5F00\u8865\u5149" },
  overexposure: { label: "\u8FC7\u66DD/\u53CD\u5149", tip: "\u907F\u5F00\u76F4\u5C04\u5149\uFF0C\u8C03\u6574\u89D2\u5EA6\u540E\u91CD\u62CD" },
  low_contrast: { label: "\u5BF9\u6BD4\u5EA6\u504F\u4F4E", tip: "\u955C\u5934\u53EF\u80FD\u6709\u6C61\u6E0D\u6216\u96FE\u6C14\uFF0C\u8BF7\u64E6\u62ED\u540E\u91CD\u62CD" },
  vignette: { label: "\u8FB9\u7F18\u6697\u89D2", tip: "\u68C0\u67E5\u955C\u5934\u662F\u5426\u88AB\u906E\u6321\u6216\u5F04\u810F" },
  haze: { label: "\u753B\u9762\u53D1\u7070", tip: "\u955C\u5934\u53EF\u80FD\u810F\u6C61\u6216\u5BF9\u7126\u5931\u8D25\uFF0C\u8BF7\u6E05\u6D01\u540E\u91CD\u62CD" },
  dirty_lens: { label: "\u7591\u4F3C\u810F\u955C\u5934", tip: "\u7528\u8F6F\u5E03\u64E6\u62ED\u6444\u50CF\u5934\uFF0C\u786E\u4FDD\u753B\u9762\u6E05\u6670" }
};
function assessCaptureQuality(imageData) {
  if (!imageData?.data?.length) {
    return {
      reliable: false,
      score: 0,
      flags: ["unreadable"],
      warnings: ["\u65E0\u6CD5\u8BFB\u53D6\u56FE\u50CF"],
      tips: ["\u8BF7\u91CD\u65B0\u62CD\u7167"],
      metrics: {}
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
  const cornerL = regionMean(pixels, (p) => (p.x < 0.2 || p.x > 0.8) && (p.y < 0.2 || p.y > 0.8));
  const vignetteRatio = centerL > 0.05 ? cornerL / centerL : 1;
  const lapVar = laplacianVariance(imageData);
  const likelyBlur = lapVar < 12e-4 && lStd > 0.035 && lSpread < 0.22;
  const severeBlur = lapVar < 25e-5 && lStd > 0.02;
  const flags = [];
  const warnings = [];
  const tips = [];
  if (likelyBlur || severeBlur) {
    flags.push("blur");
    warnings.push(CAPTURE_FLAGS.blur.label);
    tips.push(CAPTURE_FLAGS.blur.tip);
  }
  if (avgL < 0.14 && darkClip > 0.35) {
    flags.push("low_light");
    warnings.push(CAPTURE_FLAGS.low_light.label);
    tips.push(CAPTURE_FLAGS.low_light.tip);
  }
  if (brightClip > 0.12) {
    flags.push("overexposure");
    warnings.push(CAPTURE_FLAGS.overexposure.label);
    tips.push(CAPTURE_FLAGS.overexposure.tip);
  }
  if (lStd < 0.07 && lSpread < 0.35) {
    flags.push("low_contrast");
    warnings.push(CAPTURE_FLAGS.low_contrast.label);
    tips.push(CAPTURE_FLAGS.low_contrast.tip);
  }
  if (vignetteRatio < 0.62 && centerL > 0.18) {
    flags.push("vignette");
    warnings.push(CAPTURE_FLAGS.vignette.label);
    tips.push(CAPTURE_FLAGS.vignette.tip);
  }
  if (hazeRatio > 0.38 && avgS < 0.18) {
    flags.push("haze");
    warnings.push(CAPTURE_FLAGS.haze.label);
    tips.push(CAPTURE_FLAGS.haze.tip);
  }
  const dirtySignals = [
    flags.includes("low_contrast"),
    flags.includes("haze"),
    flags.includes("vignette"),
    flags.includes("blur") && flags.includes("low_contrast")
  ].filter(Boolean).length;
  if (dirtySignals >= 2 || flags.includes("haze") && flags.includes("vignette")) {
    flags.push("dirty_lens");
    if (!warnings.includes(CAPTURE_FLAGS.dirty_lens.label)) {
      warnings.push(CAPTURE_FLAGS.dirty_lens.label);
      tips.push(CAPTURE_FLAGS.dirty_lens.tip);
    }
  }
  let score = 100;
  score -= flags.includes("blur") ? 28 : 0;
  score -= flags.includes("low_light") ? 22 : 0;
  score -= flags.includes("overexposure") ? 18 : 0;
  score -= flags.includes("low_contrast") ? 20 : 0;
  score -= flags.includes("vignette") ? 15 : 0;
  score -= flags.includes("haze") ? 18 : 0;
  score -= flags.includes("dirty_lens") ? 12 : 0;
  score = Math.max(0, Math.min(100, score));
  const criticalFlags = ["dirty_lens", "blur", "low_light"];
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
      laplacianVariance: Number(lapVar.toFixed(6))
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CAPTURE_FLAGS,
  assessCaptureQuality,
  laplacianVariance,
  luminance,
  saturation
});

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

// src/inspect.js
var inspect_exports = {};
__export(inspect_exports, {
  analyzeImageData: () => analyzeImageData,
  assessCaptureQuality: () => assessCaptureQuality,
  detectLocalizedSpots: () => detectLocalizedSpots,
  evaluateInspection: () => evaluateInspection,
  hueInRange: () => hueInRange,
  loadImageToCanvas: () => loadImageToCanvas,
  rgbToHsl: () => rgbToHsl
});
module.exports = __toCommonJS(inspect_exports);

// src/standards.js
var GRADES = {
  A: { label: "\u4F18\u7B49", minScore: 90, color: "#1a7f4b" },
  B: { label: "\u5408\u683C", minScore: 75, color: "#2d8f5e" },
  C: { label: "\u4E34\u754C", minScore: 60, color: "#c47a00" },
  F: { label: "\u4E0D\u5408\u683C", minScore: 0, color: "#c0392b" }
};
var CATEGORIES = [
  {
    id: "vegetable",
    name: "\u65B0\u9C9C\u852C\u83DC",
    icon: "\u{1F96C}",
    gbRefs: ["GB 2762-2022", "GB 2763-2021", "GB/T 13621-2006"],
    visual: {
      hueMin: 70,
      hueMax: 150,
      minSaturation: 0.22,
      maxDarkSpotRatio: 0.12,
      minBrightness: 0.28,
      maxGrayRatio: 0.18
    },
    checklist: [
      { id: "appearance", label: "\u8272\u6CFD\u6B63\u5E38\u3001\u65E0\u4E25\u91CD\u840E\u852B", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u6591\u3001\u866B\u86C0\u5B54\u6D1E", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u5F02\u5473\u3001\u65E0\u53D1\u9175\u9178\u8D25\u6C14", required: true },
      { id: "foreign", label: "\u65E0\u6CE5\u6C99\u3001\u5F02\u7269\u3001\u519C\u836F\u6B8B\u7559\u53EF\u89C1\u75D5\u8FF9", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5B8C\u6574\u3001\u6807\u7B7E\u4FE1\u606F\u9F50\u5168\uFF08\u5982\u6709\uFF09", required: false }
    ]
  },
  {
    id: "fruit",
    name: "\u9C9C\u6C34\u679C",
    icon: "\u{1F34E}",
    gbRefs: ["GB/T 8559-2008", "GB 2762-2022", "GB 2763-2021"],
    visual: {
      hueMin: 0,
      hueMax: 60,
      minSaturation: 0.25,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.25,
      maxGrayRatio: 0.15
    },
    checklist: [
      { id: "appearance", label: "\u679C\u5F62\u5B8C\u6574\u3001\u8868\u76AE\u65E0\u660E\u663E bruise", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u53D8\u3001\u866B\u773C", required: true, autoKey: "noSpots" },
      { id: "firmness", label: "\u786C\u5EA6\u9002\u4E2D\u3001\u65E0\u8FC7\u5EA6\u8F6F\u70C2", required: true },
      { id: "odor", label: "\u65E0\u9152\u5473\u3001\u65E0\u5F02\u5E38\u53D1\u9175\u5473", required: true },
      { id: "residue", label: "\u8868\u9762\u65E0\u53EF\u89C1\u8721\u5C42\u5F02\u5E38\u6216\u6B8B\u7559", required: false }
    ]
  },
  {
    id: "meat",
    name: "\u9C9C\uFF08\u51BB\uFF09\u755C\u79BD\u8089",
    icon: "\u{1F969}",
    gbRefs: ["GB 2707-2016", "GB 2762-2022", "GB 31616-2015"],
    visual: {
      hueMin: 340,
      hueMax: 30,
      minSaturation: 0.12,
      maxDarkSpotRatio: 0.08,
      minBrightness: 0.2,
      maxGrayRatio: 0.25
    },
    checklist: [
      { id: "color", label: "\u8089\u8272\u6B63\u5E38\uFF08\u9C9C\u7EA2/\u6DE1\u7EA2\uFF09\uFF0C\u65E0\u53D1\u7EFF\u53D1\u7070", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u6DE4\u8840\u5757\u3001\u8113\u5305\u3001\u5BC4\u751F\u866B", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u8165\u81ED\u3001\u6C28\u5473\u3001\u9178\u8D25\u5473", required: true },
      { id: "elastic", label: "\u6307\u538B\u540E\u5F39\u6027\u6062\u590D\u826F\u597D", required: true },
      { id: "cert", label: "\u68C0\u75AB\u5408\u683C\u6807\u5FD7/\u8FFD\u6EAF\u7801\u53EF\u67E5", required: true }
    ]
  },
  {
    id: "seafood",
    name: "\u9C9C\u51BB\u6C34\u4EA7\u54C1",
    icon: "\u{1F41F}",
    gbRefs: ["GB 2733-2015", "GB 2762-2022", "GB 10136-2016"],
    visual: {
      hueMin: 170,
      hueMax: 220,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.18,
      maxGrayRatio: 0.3
    },
    checklist: [
      { id: "appearance", label: "\u9C7C\u773C\u6E05\u4EAE\u3001\u9CDE\u7247/\u867E\u58F3\u5B8C\u6574", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8F6F\u70C2\u3001\u8131\u9AA8\u3001\u9ED1\u9CC3", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u6C28\u5473\u3001\u8150\u81ED\u5473", required: true },
      { id: "gill", label: "\u9CC3\u90E8\u9C9C\u7EA2\u6216\u6DE1\u7EA2\uFF08\u9C9C\u54C1\uFF09", required: true },
      { id: "temp", label: "\u51B7\u94FE\u6E29\u5EA6\u7B26\u5408\u8981\u6C42\uFF08\u22644\u2103 \u6216\u51BB\u7ED3\u6001\uFF09", required: true }
    ]
  },
  {
    id: "dairy",
    name: "\u4E73\u5236\u54C1",
    icon: "\u{1F95B}",
    gbRefs: ["GB 19301-2010", "GB 25190-2010", "GB 2762-2022"],
    visual: {
      hueMin: 30,
      hueMax: 55,
      minSaturation: 0.05,
      maxDarkSpotRatio: 0.05,
      minBrightness: 0.55,
      maxGrayRatio: 0.12
    },
    checklist: [
      { id: "packaging", label: "\u5305\u88C5\u5BC6\u5C01\u5B8C\u597D\u3001\u65E0\u80C0\u5305\u6F0F\u5305", required: true },
      { id: "label", label: "\u751F\u4EA7\u65E5\u671F\u3001\u4FDD\u8D28\u671F\u3001\u5382\u540D\u5382\u5740\u6E05\u6670", required: true },
      { id: "appearance", label: "\u8272\u6CFD\u5747\u5300\u3001\u65E0\u7D6E\u72B6\u7269\uFF08\u6DB2\u6001\u5976\uFF09", required: true, autoKey: "colorFresh" },
      { id: "odor", label: "\u65E0\u9178\u8D25\u3001\u998A\u5473", required: true },
      { id: "cold", label: "\u51B7\u85CF\u94FE\u672A\u4E2D\u65AD\uFF08\u9700\u51B7\u85CF\u54C1\u7C7B\uFF09", required: true }
    ]
  },
  {
    id: "grain",
    name: "\u7CAE\u6CB9\u53CA\u5236\u54C1",
    icon: "\u{1F33E}",
    gbRefs: ["GB 1354-2018", "GB 1355-2021", "GB 2716-2018"],
    visual: {
      hueMin: 35,
      hueMax: 50,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.06,
      minBrightness: 0.35,
      maxGrayRatio: 0.1
    },
    checklist: [
      { id: "appearance", label: "\u9897\u7C92\u9971\u6EE1\u3001\u65E0\u5927\u91CF\u788E\u7C73/\u6742\u8D28", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u866B\u86C0\u3001\u65E0\u9709\u7C92\u3001\u65E0\u7ED3\u5757", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u54C8\u5587\u5473\u3001\u9709\u5473", required: true },
      { id: "label", label: "\u7B49\u7EA7\u6807\u8BC6\u3001\u6267\u884C\u6807\u51C6\u53F7\u6B63\u786E", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5E72\u71E5\u3001\u65E0\u7834\u635F\u53D7\u6F6E", required: true }
    ]
  },
  {
    id: "packaged",
    name: "\u9884\u5305\u88C5\u98DF\u54C1",
    icon: "\u{1F4E6}",
    gbRefs: ["GB 7718-2011", "GB 28050-2011", "GB 14881-2013"],
    visual: {
      hueMin: 0,
      hueMax: 360,
      minSaturation: 0,
      maxDarkSpotRatio: 0.15,
      minBrightness: 0.15,
      maxGrayRatio: 0.35
    },
    checklist: [
      { id: "label_name", label: "\u98DF\u54C1\u540D\u79F0\u3001\u914D\u6599\u8868\u5B8C\u6574", required: true },
      { id: "label_date", label: "\u751F\u4EA7\u65E5\u671F\u4E0E\u4FDD\u8D28\u671F\u5728\u6709\u6548\u671F\u5185", required: true },
      { id: "label_std", label: "\u4EA7\u54C1\u6807\u51C6\u4EE3\u53F7\u3001\u751F\u4EA7\u8BB8\u53EF\u8BC1\u53F7", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5B8C\u597D\u3001\u65E0\u80C0\u888B\u7834\u635F", required: true },
      { id: "appearance", label: "\u5185\u5BB9\u7269\u8272\u6CFD\u5F62\u6001\u6B63\u5E38", required: true, autoKey: "colorFresh" }
    ]
  }
];
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}
function scoreToGrade(score) {
  const s = Number(score) || 0;
  if (s >= GRADES.A.minScore) return "A";
  if (s >= GRADES.B.minScore) return "B";
  if (s >= GRADES.C.minScore) return "C";
  return "F";
}
function isPassingGrade(grade) {
  return grade === "A" || grade === "B";
}

// src/capture-quality.js
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

// src/inspect.js
var SAMPLE2 = 64;
var GRID = 8;
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
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s, l };
}
function hueInRange(h, min, max) {
  if (min <= max) return h >= min && h <= max;
  return h >= min || h <= max;
}
function luminance2(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
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
          sumL += luminance2(data[i], data[i + 1], data[i + 2]);
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
      skippedDueToCapture: lowContrastCapture || uniformDark
    };
  }
  let localizedSpots = 0;
  for (const cell of darkCells) {
    const neighbors = cells.filter(
      (c) => Math.abs(c.gx - cell.gx) <= 1 && Math.abs(c.gy - cell.gy) <= 1 && c !== cell
    );
    if (!neighbors.length) continue;
    const neighL = neighbors.reduce((s, c) => s + c.l, 0) / neighbors.length;
    if (cell.l < neighL - 0.1) localizedSpots++;
  }
  return {
    spotRatio: localizedSpots / cells.length,
    localizedSpots,
    uniformDark: false,
    skippedDueToCapture: false
  };
}
function analyzeImageData(imageData, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat || !imageData?.data?.length) {
    return {
      visualScore: null,
      visualReliability: "none",
      captureQuality: null,
      metrics: {},
      issues: [],
      captureWarnings: ["\u65E0\u6CD5\u8BFB\u53D6\u56FE\u50CF"],
      autoHints: {}
    };
  }
  const captureQuality = assessCaptureQuality(imageData);
  const reliable = captureQuality.reliable;
  const { data, width, height } = imageData;
  const stepX = Math.max(1, Math.floor(width / SAMPLE2));
  const stepY = Math.max(1, Math.floor(height / SAMPLE2));
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
  let visualReliability = "low";
  if (!reliable) {
    visualReliability = "low";
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
        ...captureQuality.metrics
      },
      issues: [],
      captureWarnings,
      captureTips: captureQuality.tips,
      autoHints: {},
      spotSkipped: true
    };
  }
  visualReliability = captureQuality.score >= 75 ? "high" : "medium";
  visualScore = 100;
  const spotFail = spotInfo.localizedSpots >= 2 && spotInfo.spotRatio > 0.04;
  if (avgS < v.minSaturation) {
    visualScore -= 22;
    foodIssues.push("\u8272\u6CFD\u504F\u6DE1\u6216\u840E\u852B\uFF0C\u9971\u548C\u5EA6\u4F4E\u4E8E\u6807\u51C6");
  }
  if (spotFail && !spotInfo.skippedDueToCapture) {
    visualScore -= 28;
    foodIssues.push(`\u5C40\u90E8\u6697\u6591/\u8150\u574F\u7EA6 ${(spotInfo.spotRatio * 100).toFixed(1)}%\uFF0C\u8D85\u51FA\u9650\u503C`);
  }
  if (grayRatio > v.maxGrayRatio && avgS < v.minSaturation * 1.2) {
    visualScore -= 15;
    foodIssues.push("\u7070\u8D25\u533A\u57DF\u504F\u591A\uFF0C\u53EF\u80FD\u5B58\u5728\u9709\u53D8\u6216\u6C27\u5316");
  }
  if (avgL < v.minBrightness && captureQuality.metrics.darkClipRatio < 0.5) {
    visualScore -= 12;
    foodIssues.push("\u6574\u4F53\u4EAE\u5EA6\u504F\u4F4E\uFF0C\u65B0\u9C9C\u5EA6\u5B58\u7591");
  }
  if (hueRatio < 0.35 && cat.id !== "packaged") {
    visualScore -= 12;
    foodIssues.push("\u4E3B\u8272\u8C03\u4E0E\u54C1\u7C7B\u5178\u578B\u8272\u6CFD\u504F\u5DEE\u8F83\u5927");
  }
  visualScore = Math.max(0, Math.min(100, Math.round(visualScore)));
  const autoHints = {
    colorFresh: visualScore >= 70 && avgS >= v.minSaturation * 0.85,
    noSpots: !spotFail && !spotInfo.uniformDark
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
      ...captureQuality.metrics
    },
    issues: foodIssues,
    captureWarnings,
    captureTips: captureQuality.tips,
    autoHints,
    spotSkipped: spotInfo.skippedDueToCapture
  };
}
function evaluateInspection(categoryId, imageAnalysis, checklistAnswers = {}) {
  const cat = getCategory(categoryId);
  if (!cat) {
    return { passed: false, score: 0, grade: "F", failures: ["\u672A\u77E5\u54C1\u7C7B"], summary: "" };
  }
  const reliability = imageAnalysis?.visualReliability ?? "none";
  const useAutoHints = reliability === "high" || reliability === "medium";
  const failures = [];
  const warnings = [];
  let checklistScore = 0;
  let requiredTotal = 0;
  let requiredPass = 0;
  for (const item of cat.checklist) {
    let ok = Boolean(checklistAnswers[item.id]);
    if (useAutoHints && item.autoKey && imageAnalysis?.autoHints?.[item.autoKey] !== void 0) {
      if (checklistAnswers[item.id] === void 0) {
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
  const checklistPct = maxChecklist ? checklistScore / maxChecklist * 100 : 0;
  const visual = imageAnalysis?.visualScore;
  let score;
  if (reliability === "high") {
    score = Math.round((visual ?? 0) * 0.45 + checklistPct * 0.55);
  } else if (reliability === "medium") {
    score = Math.round((visual ?? 0) * 0.3 + checklistPct * 0.7);
  } else {
    score = Math.round(checklistPct);
  }
  const grade = scoreToGrade(score);
  const passed = isPassingGrade(grade) && requiredPass === requiredTotal;
  let summary;
  if (reliability === "low" || reliability === "none") {
    summary = passed ? `\u62CD\u6444\u8D28\u91CF\u4E0D\u8DB3\uFF0C\u5DF2\u6309\u611F\u5B98\u6E05\u5355\u4E3A\u4E3B\u5224\u5B9A\u4E3A\u5408\u683C\uFF08${score} \u5206\uFF09` : `\u62CD\u6444\u8D28\u91CF\u4E0D\u8DB3\uFF0C\u89C6\u89C9\u7ED3\u679C\u672A\u91C7\u4FE1\uFF1B${failures.slice(0, 2).join("\uFF1B")}${failures.length > 2 ? "\u2026" : ""}`;
  } else if (passed) {
    summary = `\u7B26\u5408 ${cat.gbRefs[0]} \u7B49\u6807\u51C6\u7684\u5916\u89C2\u611F\u5B98\u5FEB\u68C0\u8981\u6C42\uFF0C\u7EFC\u5408 ${score} \u5206`;
  } else {
    summary = `\u672A\u8FBE\u8D28\u68C0\u6807\u51C6\uFF1A${failures.slice(0, 2).join("\uFF1B")}${failures.length > 2 ? "\u2026" : ""}`;
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
    gbRefs: cat.gbRefs
  };
}
function loadImageToCanvas(fileOrBlob, canvas) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
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
      reject(new Error("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25"));
    };
    img.src = url;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  analyzeImageData,
  assessCaptureQuality,
  detectLocalizedSpots,
  evaluateInspection,
  hueInRange,
  loadImageToCanvas,
  rgbToHsl
});

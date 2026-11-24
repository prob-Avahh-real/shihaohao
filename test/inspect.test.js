const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  analyzeImageData,
  evaluateInspection,
  rgbToHsl,
  assessCaptureQuality,
} = require('../src/inspect.cjs.js');

function solidImageData(w, h, r, g, b) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const j = i * 4;
    data[j] = r;
    data[j + 1] = g;
    data[j + 2] = b;
    data[j + 3] = 255;
  }
  return { width: w, height: h, data };
}

function fillRegion(data, w, h, x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const j = (y * w + x) * 4;
      data[j] = r;
      data[j + 1] = g;
      data[j + 2] = b;
    }
  }
}

function gradientVignetteImage(w, h, centerRgb, cornerRgb) {
  const data = new Uint8ClampedArray(w * h * 4);
  const cx = w / 2;
  const cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      const t = Math.min(1, dist);
      const j = (y * w + x) * 4;
      data[j] = Math.round(centerRgb[0] * (1 - t) + cornerRgb[0] * t);
      data[j + 1] = Math.round(centerRgb[1] * (1 - t) + cornerRgb[1] * t);
      data[j + 2] = Math.round(centerRgb[2] * (1 - t) + cornerRgb[2] * t);
      data[j + 3] = 255;
    }
  }
  return { width: w, height: h, data };
}

describe('inspect', () => {
  it('converts rgb to hsl', () => {
    const { h, s, l } = rgbToHsl(0, 255, 0);
    assert.ok(h > 100 && h < 140);
    assert.ok(s > 0.9);
    assert.ok(l > 0.4);
  });

  it('scores fresh green vegetables highly', () => {
    const img = solidImageData(128, 128, 60, 180, 80);
    const result = analyzeImageData(img, 'vegetable');
    assert.ok(result.visualScore >= 70, `expected >=70 got ${result.visualScore}`);
    assert.equal(result.autoHints.colorFresh, true);
    assert.equal(result.visualReliability, 'high');
  });

  it('flags localized dark spoiled regions on good capture', () => {
    const data = solidImageData(128, 128, 60, 180, 80);
    fillRegion(data.data, 128, 128, 40, 40, 88, 88, 20, 15, 10);
    const result = analyzeImageData(data, 'vegetable');
    assert.equal(result.visualReliability, 'high');
    assert.ok(result.visualScore < 90, `score ${result.visualScore}`);
    assert.equal(result.autoHints.noSpots, false);
  });

  it('does not misflag dirty lens vignette as food spoilage', () => {
    const img = gradientVignetteImage(128, 128, [70, 190, 85], [25, 35, 20]);
    const capture = assessCaptureQuality(img);
    assert.ok(capture.flags.includes('vignette') || capture.flags.includes('dirty_lens'));
    const result = analyzeImageData(img, 'vegetable');
    assert.equal(result.visualReliability, 'low');
    assert.equal(result.visualScore, null);
    assert.deepEqual(result.autoHints, {});
    assert.equal(result.spotSkipped, true);
  });

  it('does not auto-fail hazy low-contrast images as moldy', () => {
    const img = solidImageData(128, 128, 140, 145, 138);
    const result = analyzeImageData(img, 'vegetable');
    assert.equal(result.visualReliability, 'low');
    assert.ok(result.captureWarnings.length > 0);
    assert.equal(result.issues.length, 0);
  });

  it('evaluates pass when checklist and visual ok', () => {
    const analysis = {
      visualScore: 88,
      visualReliability: 'high',
      autoHints: { colorFresh: true, noSpots: true },
    };
    const answers = {
      appearance: true,
      spot: true,
      odor: true,
      foreign: true,
    };
    const result = evaluateInspection('vegetable', analysis, answers);
    assert.equal(result.passed, true);
    assert.ok(result.score >= 75);
    assert.equal(result.grade, 'A');
  });

  it('weights checklist when capture unreliable', () => {
    const analysis = {
      visualScore: null,
      visualReliability: 'low',
      autoHints: {},
      captureWarnings: ['疑似脏镜头'],
    };
    const result = evaluateInspection('vegetable', analysis, {
      appearance: true,
      spot: true,
      odor: true,
      foreign: true,
    });
    assert.equal(result.passed, true);
    assert.ok(result.score >= 90);
  });

  it('fails when required checklist item missing', () => {
    const analysis = {
      visualScore: 90,
      visualReliability: 'high',
      autoHints: { colorFresh: true, noSpots: true },
    };
    const result = evaluateInspection('vegetable', analysis, {
      appearance: true,
      spot: true,
      odor: false,
      foreign: true,
    });
    assert.equal(result.passed, false);
    assert.ok(result.failures.some((f) => f.includes('异味')));
  });
});

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { assessCaptureQuality } = require('../src/capture-quality.cjs.js');

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

describe('capture-quality', () => {
  it('accepts sharp well-lit images', () => {
    const img = solidImageData(128, 128, 60, 180, 80);
    const q = assessCaptureQuality(img);
    assert.ok(q.score >= 70, `score ${q.score}`);
    assert.equal(q.reliable, true);
  });

  it('detects low light', () => {
    const img = solidImageData(128, 128, 12, 14, 10);
    const q = assessCaptureQuality(img);
    assert.ok(q.flags.includes('low_light'));
    assert.equal(q.reliable, false);
  });

  it('detects haze and low contrast (dirty lens proxy)', () => {
    const img = solidImageData(128, 128, 150, 152, 148);
    const q = assessCaptureQuality(img);
    assert.ok(q.flags.includes('haze') || q.flags.includes('low_contrast'));
    assert.equal(q.reliable, false);
  });
});

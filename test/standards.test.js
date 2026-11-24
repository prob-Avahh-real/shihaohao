const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  getCategory,
  listCategories,
  scoreToGrade,
  isPassingGrade,
  gradeInfo,
} = require('../src/standards.cjs.js');

describe('standards', () => {
  it('lists food categories', () => {
    const cats = listCategories();
    assert.ok(cats.length >= 6);
    assert.ok(cats.some((c) => c.id === 'vegetable'));
  });

  it('resolves category by id', () => {
    const veg = getCategory('vegetable');
    assert.equal(veg.name, '新鲜蔬菜');
    assert.ok(veg.gbRefs.length > 0);
    assert.equal(getCategory('unknown'), null);
  });

  it('maps score to grade', () => {
    assert.equal(scoreToGrade(95), 'A');
    assert.equal(scoreToGrade(80), 'B');
    assert.equal(scoreToGrade(65), 'C');
    assert.equal(scoreToGrade(40), 'F');
  });

  it('passing grades are A and B only', () => {
    assert.equal(isPassingGrade('A'), true);
    assert.equal(isPassingGrade('B'), true);
    assert.equal(isPassingGrade('C'), false);
    assert.equal(gradeInfo('A').label, '优等');
  });
});

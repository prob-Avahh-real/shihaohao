const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  createReport,
  addReport,
  removeReport,
  saveReports,
  loadReports,
  sortReports,
} = require('../src/store.cjs.js');

describe('store', () => {
  it('creates and persists reports', () => {
    const mem = new Map();
    const storage = {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
    };
    let reports = [];
    reports = addReport(reports, {
      categoryId: 'fruit',
      categoryName: '鲜水果',
      passed: true,
      score: 85,
      grade: 'B',
      summary: '合格',
      failures: [],
      gbRefs: ['GB/T 8559-2008'],
      visualScore: 80,
      checklistPct: 90,
    });
    saveReports(reports, storage);
    const loaded = loadReports(storage);
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].categoryName, '鲜水果');
  });

  it('removes report by id', () => {
    const r = createReport({ categoryId: 'meat', passed: false, score: 50, grade: 'F' });
    let reports = [r];
    reports = removeReport(reports, r.id);
    assert.equal(reports.length, 0);
  });

  it('sorts by createdAt desc', () => {
    const a = { ...createReport({ categoryId: 'a' }), createdAt: 1 };
    const b = { ...createReport({ categoryId: 'b' }), createdAt: 2 };
    const sorted = sortReports([a, b]);
    assert.equal(sorted[0].categoryId, 'b');
  });
});

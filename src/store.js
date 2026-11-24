const STORAGE_KEY = 'shihaohao.reports.v1';

function uid() {
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeReport(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const categoryId = String(raw.categoryId || '').trim();
  if (!categoryId) return null;
  return {
    id: String(raw.id || uid()),
    categoryId,
    categoryName: String(raw.categoryName || ''),
    passed: Boolean(raw.passed),
    score: Number(raw.score) || 0,
    grade: String(raw.grade || 'F'),
    summary: String(raw.summary || ''),
    failures: Array.isArray(raw.failures) ? raw.failures.map(String) : [],
    gbRefs: Array.isArray(raw.gbRefs) ? raw.gbRefs.map(String) : [],
    visualScore: Number(raw.visualScore) || 0,
    checklistPct: Number(raw.checklistPct) || 0,
    imageThumb: raw.imageThumb || null,
    createdAt: Number(raw.createdAt) || Date.now(),
  };
}

export function loadReports(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem?.(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeReport).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveReports(reports, storage = globalThis.localStorage) {
  const cleaned = (reports || []).map(normalizeReport).filter(Boolean);
  storage?.setItem?.(STORAGE_KEY, JSON.stringify(cleaned));
  return cleaned;
}

export function createReport(payload) {
  return normalizeReport({ ...payload, id: uid(), createdAt: Date.now() });
}

export function addReport(reports, payload) {
  const report = createReport(payload);
  if (!report) return reports.slice();
  return [report, ...reports];
}

export function removeReport(reports, id) {
  return reports.filter((r) => r.id !== id);
}

export function sortReports(reports) {
  return reports.slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function makeThumbDataUrl(canvas, maxSize = 120) {
  if (!canvas?.width) return null;
  const c = document.createElement('canvas');
  const scale = maxSize / Math.max(canvas.width, canvas.height);
  c.width = Math.max(1, Math.round(canvas.width * scale));
  c.height = Math.max(1, Math.round(canvas.height * scale));
  c.getContext('2d').drawImage(canvas, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.72);
}

export { STORAGE_KEY, uid, normalizeReport };

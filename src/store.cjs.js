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

// src/store.js
var store_exports = {};
__export(store_exports, {
  STORAGE_KEY: () => STORAGE_KEY,
  addReport: () => addReport,
  createReport: () => createReport,
  loadReports: () => loadReports,
  makeThumbDataUrl: () => makeThumbDataUrl,
  normalizeReport: () => normalizeReport,
  removeReport: () => removeReport,
  saveReports: () => saveReports,
  sortReports: () => sortReports,
  uid: () => uid
});
module.exports = __toCommonJS(store_exports);
var STORAGE_KEY = "shihaohao.reports.v1";
function uid() {
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function normalizeReport(raw) {
  if (!raw || typeof raw !== "object") return null;
  const categoryId = String(raw.categoryId || "").trim();
  if (!categoryId) return null;
  return {
    id: String(raw.id || uid()),
    categoryId,
    categoryName: String(raw.categoryName || ""),
    passed: Boolean(raw.passed),
    score: Number(raw.score) || 0,
    grade: String(raw.grade || "F"),
    summary: String(raw.summary || ""),
    failures: Array.isArray(raw.failures) ? raw.failures.map(String) : [],
    gbRefs: Array.isArray(raw.gbRefs) ? raw.gbRefs.map(String) : [],
    visualScore: Number(raw.visualScore) || 0,
    checklistPct: Number(raw.checklistPct) || 0,
    imageThumb: raw.imageThumb || null,
    createdAt: Number(raw.createdAt) || Date.now()
  };
}
function loadReports(storage = globalThis.localStorage) {
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
function saveReports(reports, storage = globalThis.localStorage) {
  const cleaned = (reports || []).map(normalizeReport).filter(Boolean);
  storage?.setItem?.(STORAGE_KEY, JSON.stringify(cleaned));
  return cleaned;
}
function createReport(payload) {
  return normalizeReport({ ...payload, id: uid(), createdAt: Date.now() });
}
function addReport(reports, payload) {
  const report = createReport(payload);
  if (!report) return reports.slice();
  return [report, ...reports];
}
function removeReport(reports, id) {
  return reports.filter((r) => r.id !== id);
}
function sortReports(reports) {
  return reports.slice().sort((a, b) => b.createdAt - a.createdAt);
}
function makeThumbDataUrl(canvas, maxSize = 120) {
  if (!canvas?.width) return null;
  const c = document.createElement("canvas");
  const scale = maxSize / Math.max(canvas.width, canvas.height);
  c.width = Math.max(1, Math.round(canvas.width * scale));
  c.height = Math.max(1, Math.round(canvas.height * scale));
  c.getContext("2d").drawImage(canvas, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.72);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  STORAGE_KEY,
  addReport,
  createReport,
  loadReports,
  makeThumbDataUrl,
  normalizeReport,
  removeReport,
  saveReports,
  sortReports,
  uid
});

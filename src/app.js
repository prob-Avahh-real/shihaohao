import { listCategories, getCategory, gradeInfo } from './standards.js';
import { analyzeImageData, evaluateInspection, loadImageToCanvas } from './inspect.js';
import {
  loadReports,
  saveReports,
  addReport,
  sortReports,
  makeThumbDataUrl,
} from './store.js';
import { createWearableInput } from './wearable-input.js';

const $ = (sel, root = document) => root.querySelector(sel);

const state = {
  screen: 'home',
  categoryId: null,
  imageData: null,
  imageAnalysis: null,
  checklist: {},
  focusCheckIdx: 0,
  reports: [],
  lastResult: null,
};

const els = {};

async function haptic(style = 'Light') {
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle[style] || ImpactStyle.Light });
  } catch { /* browser */ }
}

function toast(msg) {
  const t = els.toast;
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove('show'), 2000);
}

function showScreen(name) {
  state.screen = name;
  ['Home', 'Inspect', 'Result'].forEach((s) => {
    const el = $(`#screen${s}`);
    el?.classList.toggle('active', s.toLowerCase() === name);
  });
}

function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderCategories() {
  const grid = els.catGrid;
  if (!grid) return;
  grid.innerHTML = listCategories().map((c) => `
    <button type="button" class="cat-card" data-id="${c.id}">
      <span class="icon">${c.icon}</span>
      <span class="name">${c.name}</span>
      <span class="gb">${c.gbRefs[0]}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.cat-card').forEach((btn) => {
    btn.addEventListener('click', () => startInspect(btn.dataset.id));
  });
}

function renderReports() {
  const list = els.reportList;
  const empty = els.emptyReports;
  const sorted = sortReports(state.reports);
  empty.hidden = sorted.length > 0;
  list.innerHTML = sorted.slice(0, 8).map((r) => {
    const g = gradeInfo(r.grade);
    const thumb = r.imageThumb
      ? `<img src="${r.imageThumb}" alt="" />`
      : '<div class="thumb-ph"></div>';
    return `
      <div class="report-card" data-id="${r.id}">
        ${thumb}
        <div class="meta">
          <h4>${r.categoryName || r.categoryId}</h4>
          <p>${formatDate(r.createdAt)} · ${r.score} 分 · ${g.label}</p>
        </div>
        <span class="badge ${r.passed ? 'pass' : 'fail'}">${r.passed ? '合格' : '不合格'}</span>
      </div>
    `;
  }).join('');
  list.querySelectorAll('.report-card').forEach((card) => {
    card.addEventListener('click', () => showReportDetail(card.dataset.id));
  });
}

function showReportDetail(id) {
  const r = state.reports.find((x) => x.id === id);
  if (!r) return;
  state.lastResult = r;
  renderResult({
    passed: r.passed,
    score: r.score,
    grade: r.grade,
    summary: r.summary,
    failures: r.failures,
    gbRefs: r.gbRefs,
    visualScore: r.visualScore,
    checklistPct: r.checklistPct,
    categoryName: r.categoryName,
  });
  showScreen('result');
}

function startInspect(categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) return;
  state.categoryId = categoryId;
  state.imageData = null;
  state.imageAnalysis = null;
  state.checklist = {};
  state.focusCheckIdx = 0;

  els.inspectCatName.textContent = `${cat.icon} ${cat.name}`;
  els.inspectGb.textContent = cat.gbRefs.join(' · ');
  els.previewCanvas.hidden = true;
  els.previewImg.hidden = true;
  els.cameraPlaceholder.hidden = false;
  els.analyzeBtn.disabled = true;
  els.submitInspectBtn.disabled = true;
  renderQualityBanner(null);

  renderChecklist(cat);
  showScreen('inspect');
  haptic('Light');
}

function renderQualityBanner(analysis) {
  const banner = els.qualityBanner;
  if (!banner) return;
  if (!analysis) {
    banner.className = 'quality-banner';
    banner.innerHTML = '';
    return;
  }

  const warnings = analysis.captureWarnings || [];
  const tips = analysis.captureTips || [];
  const reliable = analysis.visualReliability === 'high' || analysis.visualReliability === 'medium';

  if (!warnings.length && reliable) {
    banner.className = 'quality-banner show ok';
    banner.innerHTML = `<strong>拍摄质量良好</strong>视觉分析可信，已启用自动预检辅助`;
    return;
  }

  if (warnings.length) {
    banner.className = 'quality-banner show warn';
    const tipHtml = tips.length ? `<ul>${tips.slice(0, 2).map((t) => `<li>${t}</li>`).join('')}</ul>` : '';
    const suffix = reliable ? '部分指标仍可用于辅助判定' : '视觉结果未采信，请人工核对清单';
    banner.innerHTML = `<strong>拍摄异常：${warnings.slice(0, 2).join('、')}</strong>${suffix}${tipHtml}`;
    return;
  }

  banner.className = 'quality-banner';
  banner.innerHTML = '';
}

function renderChecklist(cat, analysis = null) {
  const box = els.checklist;
  const useAuto = analysis?.visualReliability === 'high' || analysis?.visualReliability === 'medium';
  box.innerHTML = cat.checklist.map((item, idx) => {
    const auto = useAuto && item.autoKey && analysis?.autoHints?.[item.autoKey] !== undefined;
    const checked = state.checklist[item.id] ?? (auto ? analysis.autoHints[item.autoKey] : false);
    if (state.checklist[item.id] === undefined) state.checklist[item.id] = checked;
    return `
      <div class="check-item ${auto ? 'auto' : ''}" data-id="${item.id}" data-idx="${idx}">
        <input type="checkbox" id="chk_${item.id}" ${checked ? 'checked' : ''} />
        <label for="chk_${item.id}">
          ${item.label}${item.required ? '' : '（建议）'}
          ${auto ? '<span class="auto-tag">视觉预检</span>' : ''}
        </label>
      </div>
    `;
  }).join('');

  box.querySelectorAll('.check-item').forEach((row) => {
    const id = row.dataset.id;
    const input = row.querySelector('input');
    const toggle = () => {
      state.checklist[id] = input.checked;
      haptic('Light');
    };
    input.addEventListener('change', toggle);
    row.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      input.checked = !input.checked;
      toggle();
    });
  });
}

async function handlePhoto(file) {
  if (!file || !state.categoryId) return;
  try {
    const canvas = els.analysisCanvas;
    const imageData = await loadImageToCanvas(file, canvas);
    state.imageData = imageData;

    els.previewImg.src = canvas.toDataURL('image/jpeg', 0.85);
    els.previewImg.hidden = false;
    els.previewCanvas.hidden = true;
    els.cameraPlaceholder.hidden = true;

    state.imageAnalysis = null;
    els.analyzeBtn.disabled = false;
    renderQualityBanner(null);
    toast('照片已载入，可开始分析');
    haptic('Medium');
  } catch {
    toast('无法读取照片');
  }
}

function runAnalysis() {
  if (!state.imageData || !state.categoryId) return;
  const analysis = analyzeImageData(state.imageData, state.categoryId);
  state.imageAnalysis = analysis;
  const cat = getCategory(state.categoryId);
  renderQualityBanner(analysis);
  renderChecklist(cat, analysis);
  els.submitInspectBtn.disabled = false;

  if (analysis.visualReliability === 'low') {
    toast(`拍摄质量 ${analysis.captureQuality?.score ?? 0} 分 · 请擦拭镜头或重拍`);
  } else if (analysis.issues.length) {
    toast(`视觉 ${analysis.visualScore} 分 · ${analysis.issues[0]}`);
  } else {
    toast(`视觉检测 ${analysis.visualScore} 分，色泽正常`);
  }
  haptic('Medium');
}

function submitInspection() {
  if (!state.categoryId) return;
  const cat = getCategory(state.categoryId);
  const result = evaluateInspection(
    state.categoryId,
    state.imageAnalysis || { visualScore: 0, autoHints: {} },
    state.checklist,
  );
  result.categoryName = cat.name;

  const thumb = makeThumbDataUrl(els.analysisCanvas);
  const report = {
    categoryId: state.categoryId,
    categoryName: cat.name,
    passed: result.passed,
    score: result.score,
    grade: result.grade,
    summary: result.summary,
    failures: result.failures,
    gbRefs: result.gbRefs,
    visualScore: result.visualScore,
    visualReliability: result.visualReliability,
    checklistPct: result.checklistPct,
    captureWarnings: result.captureWarnings,
    imageThumb: thumb,
  };

  state.reports = addReport(state.reports, report);
  saveReports(state.reports);
  state.lastResult = { ...result, imageThumb: thumb };
  renderReports();
  renderResult(result);
  showScreen('result');
  haptic(result.passed ? 'Medium' : 'Heavy');
}

function renderResult(result) {
  const g = gradeInfo(result.grade);
  const card = els.resultCard;
  card.innerHTML = `
    <div style="font-size:0.9rem;color:var(--ink-soft)">${result.categoryName || ''}</div>
    <div class="result-score" style="color:${g.color}">${result.score}</div>
    <span class="result-grade" style="background:${g.color}">${result.passed ? '✓ 合格' : '✗ 不合格'} · ${g.label}</span>
    <p class="result-summary">${result.summary}</p>
    <div class="metrics">
      <div class="metric">视觉快检<strong>${result.visualScore ?? '—'}</strong></div>
      <div class="metric">感官清单<strong>${result.checklistPct ?? 0}%</strong></div>
    </div>
    ${result.visualReliability === 'low' || result.visualReliability === 'none' ? `
      <p class="result-summary" style="margin-top:10px;font-size:0.82rem">
        拍摄质量不足，本次以人工感官清单为主判定
      </p>
    ` : ''}
    ${result.captureWarnings?.length ? `
      <div class="fail-list" style="background:rgba(196,122,0,0.1);color:#8a5a00">
        <strong>拍摄提醒</strong>
        <ul>${result.captureWarnings.map((w) => `<li>${w}</li>`).join('')}</ul>
      </div>
    ` : ''}
    ${result.failures?.length ? `
      <div class="fail-list">
        <strong>未达标项</strong>
        <ul>${result.failures.map((f) => `<li>${f}</li>`).join('')}</ul>
      </div>
    ` : ''}
    <div class="gb-tags">
      ${(result.gbRefs || []).map((ref) => `<span class="gb-tag">${ref}</span>`).join('')}
    </div>
  `;
}

function focusChecklist(delta) {
  const cat = getCategory(state.categoryId);
  if (!cat || state.screen !== 'inspect') return;
  const items = cat.checklist;
  state.focusCheckIdx = Math.max(0, Math.min(items.length - 1, state.focusCheckIdx + delta));
  const rows = els.checklist.querySelectorAll('.check-item');
  rows.forEach((r, i) => {
    r.style.outline = i === state.focusCheckIdx ? '2px solid var(--leaf)' : '';
  });
  rows[state.focusCheckIdx]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function toggleFocusedCheck() {
  const cat = getCategory(state.categoryId);
  if (!cat || state.screen !== 'inspect') return;
  const item = cat.checklist[state.focusCheckIdx];
  if (!item) return;
  const input = $(`#chk_${item.id}`);
  if (input) {
    input.checked = !input.checked;
    state.checklist[item.id] = input.checked;
    haptic('Light');
  }
}

function bindEvents() {
  els.pickPhotoBtn.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', () => {
    const f = els.fileInput.files?.[0];
    if (f) handlePhoto(f);
    els.fileInput.value = '';
  });
  els.analyzeBtn.addEventListener('click', runAnalysis);
  els.submitInspectBtn.addEventListener('click', submitInspection);
  els.backFromInspect.addEventListener('click', () => showScreen('home'));
  els.backFromResult.addEventListener('click', () => showScreen('home'));
  els.doneBtn.addEventListener('click', () => showScreen('home'));
}

function bindWearable() {
  const wear = createWearableInput({
    onRingShake: () => {
      if (state.screen === 'inspect' && !state.imageData) {
        els.fileInput.click();
        toast('戒指摇动 · 打开相机');
      } else if (state.screen === 'inspect' && state.imageData && !state.imageAnalysis) {
        runAnalysis();
        toast('戒指摇动 · 开始分析');
      }
    },
    onRingTiltUp: () => focusChecklist(-1),
    onRingTiltDown: () => focusChecklist(1),
    onCaneTap: () => {
      if (state.screen === 'inspect') toggleFocusedCheck();
      else if (state.screen === 'result') showScreen('home');
    },
    onCaneSwingRight: () => focusChecklist(1),
    onCaneSwingLeft: () => focusChecklist(-1),
  });

  els.wearBtn.addEventListener('click', async () => {
    if (wear.listening) {
      wear.stop();
      els.wearBtn.classList.remove('on');
      toast('穿戴传感已关闭');
      return;
    }
    const ok = await wear.requestPermission();
    if (!ok) {
      toast('未获得传感器权限');
      return;
    }
    wear.start();
    els.wearBtn.classList.add('on');
    toast('穿戴已启用：摇戒拍照/分析，手杖点选');
  });
}

function init() {
  els.toast = $('#toast');
  els.catGrid = $('#catGrid');
  els.reportList = $('#reportList');
  els.emptyReports = $('#emptyReports');
  els.inspectCatName = $('#inspectCatName');
  els.inspectGb = $('#inspectGb');
  els.cameraZone = $('#cameraZone');
  els.previewCanvas = $('#previewCanvas');
  els.previewImg = $('#previewImg');
  els.cameraPlaceholder = $('#cameraPlaceholder');
  els.fileInput = $('#fileInput');
  els.pickPhotoBtn = $('#pickPhotoBtn');
  els.analyzeBtn = $('#analyzeBtn');
  els.checklist = $('#checklist');
  els.submitInspectBtn = $('#submitInspectBtn');
  els.resultCard = $('#resultCard');
  els.backFromInspect = $('#backFromInspect');
  els.backFromResult = $('#backFromResult');
  els.doneBtn = $('#doneBtn');
  els.analysisCanvas = $('#analysisCanvas');
  els.qualityBanner = $('#qualityBanner');
  els.wearBtn = $('#wearBtn');

  state.reports = loadReports();
  renderCategories();
  renderReports();
  bindEvents();
  bindWearable();
  document.body.classList.add('ready');
}

init();

// app.js — main controller

let graph   = {};
let source  = 'A';
let steps   = [];
let stepIdx = 0;
let autoTimer  = null;
let autoDelay  = 800;

// ── Apply current step to all panels ──
function applyStep(idx) {
  if (!steps.length) return;
  idx = Math.max(0, Math.min(idx, steps.length - 1));
  const s = steps[idx];

  highlightCodeLines(s.lines, s.changedLines);
  renderStatus(s.msg);
  renderDistTable(s.dist, s.activeNode, s.changedDist);
  renderPredTable(s.pred, s.activeNode, s.changedPred);
  renderHeap(s.heap);
  drawGraph(graph, source, s.activeNode, s.activeNeighbor, s.dist);
  renderVars(s.vars, s.changedKeys);

  document.getElementById('btn-prev').disabled = idx <= 0;
  document.getElementById('btn-next').disabled = idx >= steps.length - 1;

  const autoBtn = document.getElementById('btn-auto');
  if (idx >= steps.length - 1) {
    stopAuto();
  }
}

// ── Step controls ──
function stepDir(dir) {
  stepIdx = Math.max(0, Math.min(stepIdx + dir, steps.length - 1));
  applyStep(stepIdx);
}

function resetViz() {
  stopAuto();
  stepIdx = 0;
  steps   = generateSteps(graph, source);
  applyStep(0);
}

function toggleAuto() {
  if (autoTimer) { stopAuto(); return; }
  const btn = document.getElementById('btn-auto');
  btn.innerHTML  = '&#9646;&#9646;';
  btn.classList.add('btn--auto-active');
  autoTimer = setInterval(() => {
    if (stepIdx >= steps.length - 1) { stopAuto(); return; }
    stepIdx++;
    applyStep(stepIdx);
  }, autoDelay);
}

function stopAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  const btn = document.getElementById('btn-auto');
  btn.innerHTML = '&#9654;';
  btn.classList.remove('btn--auto-active');
}

// ── Graph editor ──
function applyGraph() {
  const raw = document.getElementById('graph-input').value.trim();
  const errEl = document.getElementById('graph-err');
  errEl.textContent = '';
  try {
    let parsed;

    // Try JSON first
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      // Try Python dict format: {'A': [('B', 10)], ...}
      const pythonified = raw
        .replace(/'/g, '"')                        // single → double quotes
        .replace(/\(\s*("[\w\d]+?")\s*,\s*(\d+)\s*\)/g, '[$1,$2]')  // ('B',10) → ["B",10]
        .replace(/,\s*([\}\]])/g, '$1');           // trailing commas
      parsed = JSON.parse(pythonified);
    }

    graph = {};
    for (const k in parsed) {
      graph[k] = (parsed[k] || []).map(e => [String(e[0]), Number(e[1])]);
    }
    if (!Object.keys(graph).length) throw new Error('Graph must have at least one node');
    if (!graph[source]) source = Object.keys(graph)[0];
    populateSourceSelect(graph, source);
    resetViz();
  } catch (e) {
    errEl.textContent = 'Error: ' + e.message;
  }
}

// ── Wire up event listeners ──
document.addEventListener('DOMContentLoaded', () => {
  buildCodePanel();

  document.getElementById('btn-prev').addEventListener('click', () => stepDir(-1));
  document.getElementById('btn-next').addEventListener('click', () => stepDir(1));
  document.getElementById('btn-reset').addEventListener('click', resetViz);
  document.getElementById('btn-auto').addEventListener('click', toggleAuto);

  document.getElementById('speed-sl').addEventListener('input', function () {
    autoDelay = +this.value;
    // Restart auto-play with new delay if running
    if (autoTimer) { stopAuto(); toggleAuto(); }
  });

  document.getElementById('src-sel').addEventListener('change', function () {
    source = this.value;
    resetViz();
  });

  // Canvas click → change source
  document.getElementById('graph-canvas').addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    const hit  = getNodeAtPoint(mx, my);
    if (hit) {
      source = hit;
      document.getElementById('src-sel').value = hit;
      resetViz();
    }
  });

  // Canvas resize → redraw
  const ro = new ResizeObserver(() => {
    if (steps.length) applyStep(stepIdx);
  });
  ro.observe(document.getElementById('graph-canvas'));

  // Initial load
  applyGraph();
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'l') stepDir(1);
  if (e.key === 'ArrowLeft'  || e.key === 'h') stepDir(-1);
  if (e.key === ' ') { e.preventDefault(); toggleAuto(); }
  if (e.key === 'r') resetViz();
});

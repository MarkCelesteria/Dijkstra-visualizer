// ui.js — renders distance[], predecessors[], heap, status bar

function renderDistTable(dist, activeNode, changedDist) {
  const el = document.getElementById('dist-table');
  el.innerHTML = Object.entries(dist).map(([k, v]) => {
    const val = v === Infinity ? '∞' : v;
    let cls = 'kv-row';
    if (changedDist && k in changedDist) cls += ' kv-row--changed';
    else if (k === activeNode)           cls += ' kv-row--active';
    else if (v !== Infinity)             cls += ' kv-row--visited';
    return `<div class="${cls}">
      <span class="key">${k}</span>
      <span class="val">${val}</span>
    </div>`;
  }).join('');
}

function renderPredTable(pred, activeNode, changedPred) {
  const el = document.getElementById('pred-table');
  el.innerHTML = Object.entries(pred).map(([k, v]) => {
    const val = v === null ? 'None' : v;
    let cls = 'kv-row';
    if (changedPred && k in changedPred) cls += ' kv-row--changed';
    else if (k === activeNode)           cls += ' kv-row--active';
    else if (v !== null)                 cls += ' kv-row--visited';
    return `<div class="${cls}">
      <span class="key">${k}</span>
      <span class="val">${val}</span>
    </div>`;
  }).join('');
}

function renderHeap(heap) {
  const el = document.getElementById('heap-view');
  if (!heap.length) {
    el.innerHTML = '<span class="heap-empty">(empty)</span>';
    return;
  }
  el.innerHTML = heap.map((item, i) => {
    const cls = i === 0 ? 'heap-chip heap-chip--top' : 'heap-chip';
    return `<div class="${cls}">(${item[0]},&nbsp;"${item[1]}")</div>`;
  }).join('');
}

function renderStatus(msg) {
  document.getElementById('status-bar').textContent = msg || '';
}

function populateSourceSelect(graph, currentSource) {
  const sel = document.getElementById('src-sel');
  sel.innerHTML = Object.keys(graph)
    .map(v => `<option value="${v}"${v === currentSource ? ' selected' : ''}>${v}</option>`)
    .join('');
}

function renderVars(vars, changedKeys) {
  const el = document.getElementById('vars-row');
  if (!vars || !Object.keys(vars).length) {
    el.innerHTML = '<span style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono)">—</span>';
    return;
  }
  el.innerHTML = Object.entries(vars).map(([k, v]) => {
    const changed = changedKeys && changedKeys.includes(k);
    const cls = changed ? 'var-chip var-chip--changed' : 'var-chip var-chip--active';
    const display = v === Infinity ? '∞' : (v === null ? 'None' : v);
    return `<div class="${cls}">
      <span class="vc-key">${k}</span>
      <span class="vc-val">${display}</span>
    </div>`;
  }).join('');
}
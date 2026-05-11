// canvas.js — renders the graph on a <canvas>

const NODE_RADIUS = 18;
let nodePositions = {};

function layoutNodes(graph, W, H) {
  const vertices = Object.keys(graph);
  const n = vertices.length;
  nodePositions = {};
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.36;

  vertices.forEach((v, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    nodePositions[v] = {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

function drawGraph(graph, source, activeNode, activeNeighbor, dist) {
  const canvas = document.getElementById('graph-canvas');
  const dpr    = window.devicePixelRatio || 1;
  const W      = canvas.clientWidth  || canvas.offsetWidth  || 400;
  const H      = canvas.clientHeight || canvas.offsetHeight || 200;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  layoutNodes(graph, W, H);

  // Draw edges
  for (const u in graph) {
    for (const [v, w] of (graph[u] || [])) {
      const p1 = nodePositions[u];
      const p2 = nodePositions[v];
      if (!p1 || !p2) continue;

      const isActive = (u === activeNode && v === activeNeighbor);
      const dx = p2.x - p1.x, dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux  = dx / len, uy = dy / len;
      const nr  = NODE_RADIUS;

      const x1 = p1.x + ux * nr, y1 = p1.y + uy * nr;
      const x2 = p2.x - ux * nr, y2 = p2.y - uy * nr;

      ctx.beginPath();
      ctx.strokeStyle = isActive ? '#3ddc97' : '#2a2d36';
      ctx.lineWidth   = isActive ? 2 : 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrowhead
      const ax = x2, ay = y2;
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(angle);
      ctx.fillStyle = isActive ? '#3ddc97' : '#3d4251';
      ctx.beginPath();
      ctx.moveTo(-8, -4);
      ctx.lineTo(0, 0);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Edge weight label
      const mx = (p1.x + p2.x) / 2 + (-uy * 10);
      const my = (p1.y + p2.y) / 2 + (ux * 10);
      ctx.fillStyle = isActive ? '#3ddc97' : '#4a5068';
      ctx.font = `500 10px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(w, mx, my);
    }
  }

  // Draw nodes
  for (const v in nodePositions) {
    const { x, y } = nodePositions[v];
    const isSource   = v === source;
    const isActive   = v === activeNode;
    const isNeighbor = v === activeNeighbor;
    const isVisited  = dist && dist[v] !== Infinity && !isActive && !isNeighbor;

    let fillColor   = '#1a1d24';
    let strokeColor = '#2a2d36';
    let textColor   = '#4a5068';

    if (isSource)   { fillColor = '#3d2a08'; strokeColor = '#f5a623'; textColor = '#f5a623'; }
    if (isVisited)  { fillColor = '#2a1a4a'; strokeColor = '#b07fff'; textColor = '#b07fff'; }
    if (isNeighbor) { fillColor = '#0f3325'; strokeColor = '#3ddc97'; textColor = '#3ddc97'; }
    if (isActive)   { fillColor = '#1e2e52'; strokeColor = '#5b8cff'; textColor = '#5b8cff'; }

    // Glow ring for active
    if (isActive || isSource) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, NODE_RADIUS + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = strokeColor + '44';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle   = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Node label
    ctx.fillStyle    = textColor;
    ctx.font         = `700 12px 'Syne', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(v, x, y);

    // Distance label below node
    if (dist && dist[v] !== Infinity) {
      ctx.fillStyle    = '#7a8099';
      ctx.font         = `500 9px 'JetBrains Mono', monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dist[v], x, y + NODE_RADIUS + 10);
    }
  }
}

function getNodeAtPoint(mx, my) {
  for (const v in nodePositions) {
    const { x, y } = nodePositions[v];
    const dx = mx - x, dy = my - y;
    if (dx * dx + dy * dy < NODE_RADIUS * NODE_RADIUS) return v;
  }
  return null;
}

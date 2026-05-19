// dijkstra.js — generates the full step list from a graph + source
//
// Each step: {
//   lines, changedLines, msg,
//   heap, dist, pred,
//   activeNode, activeNeighbor,
//   changedDist, changedPred,
//   vars, changedKeys
// }

function generateSteps(graph, source) {
  const steps = [];
  const dist  = {};
  const pred  = {};

  for (const v in graph) { dist[v] = Infinity; pred[v] = null; }

  // ── snap helper ──────────────────────────────────────────────────────────
  function snap(lines, msg, heapArr, aNode, aNbr, chDist, chPred, changedLines, vars, changedKeys) {
    steps.push({
      lines:          lines        || [],
      changedLines:   changedLines || [],
      msg,
      heap:           heapArr.map(x => [...x]),
      dist:           { ...dist },
      pred:           { ...pred },
      activeNode:     aNode || null,
      activeNeighbor: aNbr  || null,
      changedDist:    chDist || null,
      changedPred:    chPred || null,
      vars:           vars   || {},
      changedKeys:    changedKeys || [],
    });
  }

  // ── 1. Call ───────────────────────────────────────────────────────────────
  snap(
    [12], `dijkstra(graph, source="${source}") called`,
    [], null, null, null, null, [],
    { source, target: '—', status: 'starting' },
    []
  );

  // ── 2. Initialise arrays ──────────────────────────────────────────────────
  snap(
    [13, 14], 'Initialize distance=∞ for all nodes, predecessors=None',
    [], null, null, null, null, [],
    {
      ...Object.fromEntries(Object.keys(graph).map(v => [`dist[${v}]`, '∞'])),
      ...Object.fromEntries(Object.keys(graph).map(v => [`pred[${v}]`, 'None'])),
    },
    []
  );

  // ── 3. Seed source ────────────────────────────────────────────────────────
  dist[source] = 0;
  const pq = new MinHeap();
  pq.push([0, source]);

  snap(
    [16, 17, 18], `Set distance["${source}"]=0, push (0,"${source}") onto heap`,
    pq.heap, null, null, { [source]: 0 }, { [source]: null }, [],
    { [`dist[${source}]`]: 0, heap_top: `(0,"${source}")`, pred_src: 'None' },
    [`dist[${source}]`, 'heap_top']
  );

  // ── 4. Main loop ──────────────────────────────────────────────────────────
  let guard = 0;
  while (pq.heap.length && guard++ < 600) {

    // check heap
    snap(
      [20], 'Loop: heap not empty — continue',
      pq.heap, null, null, null, null, [],
      { heap_size: pq.heap.length, dist_u: '—', u: '—', v: '—', weight: '—' },
      []
    );

    // pop
    const [du, u] = pq.pop();
    snap(
      [21], `Pop min → dist_u=${du}, u="${u}"`,
      pq.heap, u, null, null, null, [21],
      { dist_u: du, u, v: '—', weight: '—', heap_size: pq.heap.length },
      ['dist_u', 'u']
    );

    // stale check
    if (du > dist[u]) {
      snap(
        [23, 24], `Stale! dist_u=${du} > dist[${u}]=${dist[u]} — skip`,
        pq.heap, u, null, null, null, [23, 24],
        { dist_u: du, u, 'dist[u]': dist[u], stale: 'YES → skip' },
        ['stale']
      );
      continue;
    }

    // process node
    snap(
      [26], `Process "${u}" (dist=${dist[u]}) — checking neighbors`,
      pq.heap, u, null, null, null, [],
      { u, 'dist[u]': dist[u], v: '—', weight: '—', action: 'iterating neighbors' },
      ['u', 'dist[u]']
    );

    const neighbors = graph[u] || [];
    if (!neighbors.length) {
      snap(
        [26], `"${u}" has no neighbors — nothing to relax`,
        pq.heap, u, null, null, null, [],
        { u, 'dist[u]': dist[u], neighbors: 0 },
        []
      );
    }

    for (const [v, w] of neighbors) {

      // looking at neighbor
      snap(
        [26, 27], `Neighbor "${v}", edge weight=${w}`,
        pq.heap, u, v, null, null, [26],
        { u, v, weight: w, 'dist[u]': dist[u], 'dist[v]': dist[v] === Infinity ? '∞' : dist[v], new_dist: '?' },
        ['v', 'weight']
      );

      const newD     = dist[u] + w;
      const improved = newD < dist[v];

      // relaxation check
      snap(
        [28], `dist[u]+w = ${dist[u]}+${w} = ${newD}  <  dist[v]=${dist[v] === Infinity ? '∞' : dist[v]}? → ${improved ? 'YES' : 'NO'}`,
        pq.heap, u, v, null, null, [28],
        { u, v, weight: w, 'dist[u]': dist[u], 'dist[v]': dist[v] === Infinity ? '∞' : dist[v], new_dist: newD, improved: improved ? 'YES' : 'NO' },
        ['new_dist', 'improved']
      );

      if (improved) {
        dist[v] = newD;
        pred[v] = u;
        pq.push([newD, v]);

        snap(
          [29, 30, 31], `✓ Relax! dist[${v}]=${newD}, pred[${v}]="${u}", pushed to heap`,
          pq.heap, u, v, { [v]: newD }, { [v]: u }, [29, 30, 31],
          { u, v, weight: w, [`dist[${v}]`]: newD, [`pred[${v}]`]: u, heap_size: pq.heap.length },
          [`dist[${v}]`, `pred[${v}]`, 'heap_size']
        );
      } else {
        snap(
          [28], `✗ No improvement for "${v}" — skip`,
          pq.heap, u, v, null, null, [28],
          { u, v, weight: w, 'dist[v]': dist[v] === Infinity ? '∞' : dist[v], new_dist: newD, improved: 'NO' },
          []
        );
      }
    }
  }

  // ── 5. Done ───────────────────────────────────────────────────────────────
  snap(
    [20], '🏁 Heap empty — all shortest paths found!',
    [], null, null, null, null, [],
    {
      status: 'done',
      ...Object.fromEntries(Object.keys(graph).map(v => [`dist[${v}]`, dist[v] === Infinity ? '∞' : dist[v]])),
    },
    []
  );

  return steps;
}
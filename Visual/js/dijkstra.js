// dijkstra.js — generates the full step list from a graph + source

// Each step: { lines, changedLines, msg, heap, dist, pred, activeNode, activeNeighbor, changedDist, changedPred }

function generateSteps(graph, source) {
  const steps = [];
  const dist   = {};
  const pred   = {};

  for (const v in graph) { dist[v] = Infinity; pred[v] = null; }

  function snap(lines, msg, heapArr, aNode, aNbr, chDist, chPred, changedLines) {
    steps.push({
      lines:          lines || [],
      changedLines:   changedLines || [],
      msg,
      heap:           heapArr.map(x => [...x]),
      dist:           { ...dist },
      pred:           { ...pred },
      activeNode:     aNode   || null,
      activeNeighbor: aNbr    || null,
      changedDist:    chDist  || null,
      changedPred:    chPred  || null,
    });
  }

  snap([12], `dijkstra(graph, source="${source}") called`, [], null, null);
  snap([13, 14], 'Initialize distance=∞ and predecessors=None for all nodes', [], null, null);

  dist[source] = 0;
  const pq = new MinHeap();
  pq.push([0, source]);

  snap([16, 17, 18], `Set distance["${source}"]=0, push (0, "${source}") onto heap`,
       pq.heap, null, null, { [source]: 0 }, { [source]: null });

  let guard = 0;
  while (pq.heap.length && guard++ < 600) {
    snap([20], 'Loop: heap not empty — continue', pq.heap, null, null);

    const [du, u] = pq.pop();
    snap([21], `Pop min from heap → (dist=${du}, node="${u}")`, pq.heap, u, null, null, null, [21]);

    if (du > dist[u]) {
      snap([23, 24], `Stale! ${du} > dist["${u}"]=${dist[u]} — skip this entry`, pq.heap, u, null, null, null, [23, 24]);
      continue;
    }

    snap([26], `Process "${u}" (dist=${dist[u]}) — iterate over neighbors`, pq.heap, u, null);

    const neighbors = graph[u] || [];
    if (!neighbors.length) {
      snap([26], `"${u}" has no neighbors`, pq.heap, u, null);
    }

    for (const [v, w] of neighbors) {
      snap([26, 27], `  Neighbor "${v}" via edge weight ${w}`, pq.heap, u, v, null, null, [26]);

      const newD = dist[u] + w;
      const improved = newD < dist[v];

      snap([28], `  Is ${dist[u]}+${w}=${newD} < dist["${v}"]=${dist[v] === Infinity ? '∞' : dist[v]}? → ${improved ? 'YES' : 'NO'}`,
           pq.heap, u, v, null, null, [28]);

      if (improved) {
        dist[v] = newD;
        pred[v] = u;
        pq.push([newD, v]);
        snap([29, 30, 31],
             `  ✓ Relax! dist["${v}"]=${newD}, pred["${v}"]="${u}", push (${newD},"${v}") to heap`,
             pq.heap, u, v, { [v]: newD }, { [v]: u }, [29, 30, 31]);
      } else {
        snap([28], `  ✗ No improvement for "${v}"`, pq.heap, u, v, null, null, [28]);
      }
    }
  }

  snap([20], '🏁 Heap empty — shortest paths found!', [], null, null);
  return steps;
}

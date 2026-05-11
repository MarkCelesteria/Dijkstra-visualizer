// code.js — builds and highlights the algorithm display

const CODE_LINES = [
  { text: "class MinHeap:",                                    type: "keyword" },
  { text: "    def push(self, element):",                      type: "fn" },
  { text: "        self.heap.append(element)",                 type: "" },
  { text: "        self._bubble_up(len(self.heap) - 1)",       type: "" },
  { text: "",                                                  type: "" },
  { text: "    def pop(self):",                                type: "fn" },
  { text: "        if len(self.heap) == 0: return None",       type: "" },
  { text: "        root = self.heap[0]",                       type: "" },
  { text: "        self.heap[0] = self.heap.pop()",            type: "" },
  { text: "        self._bubble_down(0)",                      type: "" },
  { text: "        return root",                               type: "" },
  { text: "",                                                  type: "" },
  { text: "def dijkstra(graph, source):",                      type: "fn" },
  { text: "    distance = {v: inf for v in graph}",            type: "" },
  { text: "    predecessors = {v: None for v in graph}",       type: "" },
  { text: "",                                                  type: "" },
  { text: "    distance[source] = 0",                          type: "" },
  { text: "    pq = MinHeap()",                                type: "" },
  { text: "    pq.push((0, source))",                          type: "" },
  { text: "",                                                  type: "" },
  { text: "    while len(pq.heap) > 0:            # loop",    type: "" },
  { text: "        dist_u, u = pq.pop()",                      type: "" },
  { text: "",                                                  type: "" },
  { text: "        if dist_u > distance[u]:  # stale entry",  type: "" },
  { text: "            continue",                              type: "" },
  { text: "",                                                  type: "" },
  { text: "        for v, weight in graph[u]:      # neighbors", type: "" },
  { text: "            new_d = distance[u] + weight",          type: "" },
  { text: "            if new_d < distance[v]:",               type: "" },
  { text: "                distance[v] = new_d",               type: "" },
  { text: "                predecessors[v] = u",               type: "" },
  { text: "                pq.push((distance[v], v))",         type: "" },
];

// Map logical step IDs → line indices to highlight
const LINE_GROUPS = {
  init_dist:   [13, 14],
  init_zero:   [16, 17, 18],
  loop_check:  [20],
  pop:         [21],
  stale_check: [23, 24],
  for_nbr:     [26],
  relax_check: [27, 28],
  relax_do:    [29, 30, 31],
  done:        [20],
};

function buildCodePanel() {
  const pre = document.getElementById('code-pre');
  pre.innerHTML = CODE_LINES.map((l, i) => {
    const esc = l.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;') || ' ';
    return `<span class="code-line" id="cl${i}" data-type="${l.type}">${esc}</span>`;
  }).join('\n');
}

function highlightCodeLines(activeLines, changedLines) {
  CODE_LINES.forEach((_, i) => {
    const el = document.getElementById('cl' + i);
    if (!el) return;
    el.className = 'code-line';
    if (changedLines && changedLines.includes(i)) {
      el.classList.add('code-line--changed');
    } else if (activeLines && activeLines.includes(i)) {
      el.classList.add('code-line--active');
    }
  });

  // Scroll first active line into view
  const first = activeLines && activeLines[0];
  if (first !== undefined) {
    const el = document.getElementById('cl' + first);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

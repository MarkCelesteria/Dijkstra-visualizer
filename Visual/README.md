# Dijkstra Visualizer

An interactive, step-by-step visualization of Dijkstra's shortest-path algorithm. Watch every array, heap entry, and graph edge update in real time as the algorithm runs.

> **Note:** This project was created for **school/educational purposes** and was generated with the assistance of AI (Claude by Anthropic).

---

# [Live Preview](https://markcelesteria.github.io/Dijkstra-visualizer/)

## What it does

- Steps through Dijkstra's algorithm one operation at a time
- Highlights the exact line of code currently executing
- Shows live updates to `distance[]` and `predecessors[]` arrays
- Visualizes the min-heap (priority queue) at every step
- Draws the graph on a canvas with color-coded nodes (source, active, neighbor, visited)
- Lets you edit the graph, change the source node, and replay

## Controls

| Action | How |
|---|---|
| Step forward | Click **Next →** or press `→` / `L` |
| Step backward | Click **← Prev** or press `←` / `H` |
| Auto-play / pause | Click **▶ Auto** or press `Space` |
| Reset | Click **↺ Reset** or press `R` |
| Change source | Click any node on the canvas, or use the dropdown |
| Change graph | Edit the JSON in the **Edit Graph** panel and click **Apply & Run** |
| Change speed | Drag the Speed slider (100 ms – 2 000 ms per step) |

## Graph input format

The graph is entered as a JSON adjacency list. Each key is a node name, and its value is an array of `[neighbor, weight]` pairs.

```json
{
  "A": [["B", 10], ["D", 5]],
  "B": [["C", 1]],
  "C": [],
  "D": [["B", 3], ["C", 9]],
  "E": [["D", 2]]
}
```

Nodes with no outgoing edges still need to be listed with an empty array (`"C": []`).

## Project structure

```
dijkstra-visualizer/
├── index.html          — entry point, HTML layout
├── README.md           — this file
├── LICENSE             — MIT license
├── css/
│   ├── base.css        — design tokens, reset, typography
│   ├── layout.css      — header and main grid
│   ├── panels.css      — all panel interiors
│   └── controls.css    — buttons, select, range slider
└── js/
    ├── heap.js         — MinHeap data structure
    ├── dijkstra.js     — step generator (records every state)
    ├── code.js         — builds and highlights the code panel
    ├── canvas.js       — draws the graph on <canvas>
    ├── ui.js           — renders arrays and heap chips
    └── app.js          — main controller, wires everything together
```

## Algorithm

Dijkstra's algorithm finds the shortest path from a single source node to all other nodes in a weighted directed graph with non-negative edge weights.

**Time complexity:** O((V + E) log V) with a binary heap  
**Space complexity:** O(V)

## Disclaimer

This project was built as a learning tool for academic purposes. It was created with assistance of AI and is not intended for production use.

// heap.js — MinHeap used during step generation

class MinHeap {
  constructor() { this.heap = []; }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (!this.heap.length) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  _bubbleUp(i) {
    const parent = (i - 1) >> 1;
    if (i > 0 && this.heap[i][0] < this.heap[parent][0]) {
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      this._bubbleUp(parent);
    }
  }

  _bubbleDown(i) {
    let s = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < this.heap.length && this.heap[l][0] < this.heap[s][0]) s = l;
    if (r < this.heap.length && this.heap[r][0] < this.heap[s][0]) s = r;
    if (s !== i) {
      [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
      this._bubbleDown(s);
    }
  }

  clone() {
    const h = new MinHeap();
    h.heap = this.heap.map(x => [...x]);
    return h;
  }
}

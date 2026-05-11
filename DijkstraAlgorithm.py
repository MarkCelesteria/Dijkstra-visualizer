class MinHeap:
    def __init__(self):
        self.heap = []

    def push(self, element):
        self.heap.append(element)
        self._bubble_up(len(self.heap) - 1)

    def pop(self):
        if len(self.heap) == 0: return None
        if len(self.heap) == 1: return self.heap.pop()
        
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._bubble_down(0)
        return root

    def _bubble_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index][0] < self.heap[parent][0]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._bubble_up(parent)

    def _bubble_down(self, index):
        smallest = index
        left, right = 2 * index + 1, 2 * index + 2
        
        if left < len(self.heap) and self.heap[left][0] < self.heap[smallest][0]:
            smallest = left
        if right < len(self.heap) and self.heap[right][0] < self.heap[smallest][0]:
            smallest = right
            
        if smallest != index:
            self.heap[index], self.heap[smallest] = self.heap[smallest], self.heap[index]
            self._bubble_down(smallest)

def get_path_string(predecessors, source, target):
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = predecessors[current]
    
    path.reverse()
    if path[0] == source:
        return " -> ".join(path)
    return "No Path"

def dijkstra(graph, source):
    distance = {vertex: float('inf') for vertex in graph}
    predecessors = {vertex: None for vertex in graph}

    distance[source] = 0
    pq = MinHeap()
    pq.push((0, source))

    while len(pq.heap) > 0:
        dist_u, u = pq.pop()

        if dist_u > distance[u]:
            continue

        for v, weight in graph[u]:
            if distance[u] + weight < distance[v]:
                distance[v] = distance[u] + weight
                predecessors[v] = u
                pq.push((distance[v], v))
                
    print(f"{'Node':<5} | {'Dist':<5} | {'Shortest Path'}")
    print("-" * 30)
    for vertex in graph:
        if distance[vertex] == float('inf'):
            print(f"{vertex:<5} | {'inf':<5} | Unreachable")
        else:
            path = get_path_string(predecessors, source, vertex)
            print(f"{vertex:<5} | {distance[vertex]:<5} | {path}")

graph = {
    'A': [('B', 10), ('D', 5)],
    'B': [('C', 1)],
    'C': [],
    'D': [('B', 3), ('C', 9)],
    'E': [('D', 2)]
}

dijkstra(graph, 'A')
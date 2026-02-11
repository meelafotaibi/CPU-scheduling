// Algorithm Content System - Phase 0 Foundation
class AlgoContentSystem {
    constructor() {
        this.content = new Map();
        this.initializeContent();
    }

    initializeContent() {
        // BFS Content
        this.content.set('bfs', {
            title: 'Breadth-First Search (BFS)',
            definition: 'BFS explores graph vertices level by level, visiting all neighbors before moving to the next depth level.',
            usage: 'Find shortest path in unweighted graphs, level-order traversal, connected components.',
            complexity: {
                time: 'O(V + E)',
                space: 'O(V)',
                stable: 'N/A',
                inPlace: 'No'
            },
            proscons: {
                pros: ['Guarantees shortest path', 'Complete algorithm', 'Optimal for unweighted graphs'],
                cons: ['High memory usage', 'Slower than DFS for deep graphs', 'Not suitable for infinite graphs']
            },
            code: {
                python: `def bfs(graph, start):
    visited = set()
    queue = [start]
    result = []
    
    while queue:
        vertex = queue.pop(0)
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            queue.extend(graph[vertex] - visited)
    
    return result`,
                cpp: `void bfs(vector<vector<int>>& graph, int start) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int vertex = q.front();
        q.pop();
        cout << vertex << " ";
        
        for (int neighbor : graph[vertex]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
                java: `public void bfs(List<List<Integer>> graph, int start) {
    boolean[] visited = new boolean[graph.size()];
    Queue<Integer> queue = new LinkedList<>();
    
    visited[start] = true;
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        int vertex = queue.poll();
        System.out.print(vertex + " ");
        
        for (int neighbor : graph.get(vertex)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}`
            }
        });

        // DFS Content
        this.content.set('dfs', {
            title: 'Depth-First Search (DFS)',
            definition: 'DFS explores graph vertices by going as deep as possible before backtracking.',
            usage: 'Topological sorting, cycle detection, pathfinding, maze solving.',
            complexity: {
                time: 'O(V + E)',
                space: 'O(V)',
                stable: 'N/A',
                inPlace: 'No'
            },
            proscons: {
                pros: ['Memory efficient', 'Simple implementation', 'Good for deep graphs'],
                cons: ['May not find shortest path', 'Can get stuck in infinite paths', 'Stack overflow risk']
            },
            code: {
                python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))
    
    return result`,
                cpp: `void dfs(vector<vector<int>>& graph, int vertex, vector<bool>& visited) {
    visited[vertex] = true;
    cout << vertex << " ";
    
    for (int neighbor : graph[vertex]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}`,
                java: `public void dfs(List<List<Integer>> graph, int vertex, boolean[] visited) {
    visited[vertex] = true;
    System.out.print(vertex + " ");
    
    for (int neighbor : graph.get(vertex)) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}`
            }
        });

        // Dijkstra Content
        this.content.set('dijkstra', {
            title: "Dijkstra's Algorithm",
            definition: 'Finds shortest paths from source vertex to all other vertices in weighted graph with non-negative weights.',
            usage: 'GPS navigation, network routing, social networks, game pathfinding.',
            complexity: {
                time: 'O((V + E) log V)',
                space: 'O(V)',
                stable: 'N/A',
                inPlace: 'No'
            },
            proscons: {
                pros: ['Optimal for non-negative weights', 'Widely applicable', 'Well-studied algorithm'],
                cons: ['Cannot handle negative weights', 'Slower than BFS for unweighted', 'Requires priority queue']
            },
            code: {
                python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current_dist > distances[current]:
            continue
            
        for neighbor, weight in graph[current].items():
            distance = current_dist + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`,
                cpp: `vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;
}`,
                java: `public Map<Integer, Integer> dijkstra(Map<Integer, Map<Integer, Integer>> graph, int start) {
    Map<Integer, Integer> distances = new HashMap<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    
    for (int node : graph.keySet()) {
        distances.put(node, Integer.MAX_VALUE);
    }
    distances.put(start, 0);
    pq.offer(new int[]{0, start});
    
    while (!pq.isEmpty()) {
        int[] current = pq.poll();
        int currentDist = current[0];
        int currentNode = current[1];
        
        if (currentDist > distances.get(currentNode)) continue;
        
        for (Map.Entry<Integer, Integer> neighbor : graph.get(currentNode).entrySet()) {
            int nextNode = neighbor.getKey();
            int weight = neighbor.getValue();
            int distance = currentDist + weight;
            
            if (distance < distances.get(nextNode)) {
                distances.put(nextNode, distance);
                pq.offer(new int[]{distance, nextNode});
            }
        }
    }
    
    return distances;
}`
            }
        });
    }

    getContent(algoKey) {
        return this.content.get(algoKey);
    }

    getAllAlgorithms() {
        return Array.from(this.content.keys());
    }
}

// Export for use in other modules
window.AlgoContentSystem = AlgoContentSystem;
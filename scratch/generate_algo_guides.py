import os

guides_dir = r"c:\Users\meela\Desktop\OS\cpu\guides"

algo_guides_data = {
    "searching": {
        "title": "Searching Suite",
        "tag": "Searching",
        "intro": "Linear and Binary Search strategies for locating target elements within structured datasets.",
        "concept": "Searching algorithms are fundamental techniques for retrieving elements from a collection. Linear Search scans all elements sequentially, making it suitable for unsorted datasets. Binary Search uses a divide-and-conquer strategy on sorted arrays, repeatedly halving the search space to achieve logarithmic query performance.",
        "characteristics": [
            "Linear Search works on any array structure.",
            "Binary Search requires the target array to be pre-sorted.",
            "Binary Search maintains two pointers (low and high) to define the search interval.",
            "Visualizer supports both algorithms dynamically."
        ],
        "time_complexity": "O(log N) for Binary, O(N) for Linear",
        "space_complexity": "O(1) auxiliary space",
        "best_case": "O(1) (target element found at first checked position)",
        "worst_case": "O(N) for Linear Search, O(log N) for Binary Search",
        "steps": [
            "<strong>Linear Search:</strong> Loop through the array from index 0 to N-1. If array[i] matches target, return index; else continue.",
            "<strong>Binary Search:</strong> Initialize pointers: low = 0, high = N-1.",
            "<strong>Calculate Midpoint:</strong> Compute mid = low + (high - low) / 2.",
            "<strong>Evaluate:</strong> If array[mid] matches target, return mid. If target < array[mid], set high = mid - 1. Otherwise, set low = mid + 1.",
            "<strong>Loop/End:</strong> Repeat steps 3-4 while low <= high. If not found, return -1."
        ],
        "example": "Searching for target 23 in sorted array [2, 5, 8, 12, 16, 23, 38, 56, 72]:<br>- Initial state: low=0, high=8.<br>- Calculate mid = (0+8)/2 = 4 (value 16). Since 23 > 16, set low = mid + 1 = 5.<br>- Calculate mid = (5+8)/2 = 6 (value 38). Since 23 < 38, set high = mid - 1 = 5.<br>- Calculate mid = (5+5)/2 = 5 (value 23). Since 23 == 23, target is found at index 5.",
        "visualizer_path": "searching",
        "python": """def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1 # Not found""",
        "java": """class Searching {
    int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1; // Not found
    }
}""",
        "cpp": """#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1; // Not found
}""",
        "c": """#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1; // Not found
}"""
    },
    "recursion": {
        "title": "Recursion Tree",
        "tag": "Recursion",
        "intro": "Visual representation of nested function calls and call-stack execution flow using the Fibonacci sequence.",
        "concept": "Recursion is a programming technique where a function calls itself to solve smaller subproblems of the same problem. A Recursion Tree visualizes this process by showing each function invocation as a node, and its self-calls as branches. This makes call stack depth, parameter changes, and overlapping computations (like in naive Fibonacci) visible.",
        "characteristics": [
            "Every recursive function must contain a base case to terminate execution.",
            "Each call allocates a stack frame to store parameters and local variables.",
            "Overlapping subproblems lead to exponential growth in naive recursion.",
            "Helps visualize depth-first stack execution."
        ],
        "time_complexity": "O(2^N) for naive Fibonacci recursion",
        "space_complexity": "O(N) call-stack depth memory",
        "best_case": "O(1) (input triggers base case directly)",
        "worst_case": "O(2^N) (exhaustive branching tree)",
        "steps": [
            "<strong>Define Base Case:</strong> Check if input N is 0 or 1. If so, return N directly.",
            "<strong>Recursive Branching:</strong> Otherwise, invoke fib(N - 1) to calculate the left branch.",
            "<strong>Compute Right Branch:</strong> Invoke fib(N - 2) to calculate the right branch.",
            "<strong>Accumulate & Return:</strong> Add the results of the two branches: return fib(N - 1) + fib(N - 2)."
        ],
        "example": "Calculating fib(3):<br>1. fib(3) is not a base case; calls fib(2) and fib(1).<br>2. fib(2) calls fib(1) and fib(0).<br>3. fib(1) returns 1 (base case). fib(0) returns 0 (base case).<br>4. fib(2) returns 1 + 0 = 1.<br>5. fib(1) (from original fib(3) call) returns 1 (base case).<br>6. fib(3) returns fib(2) + fib(1) = 1 + 1 = 2.",
        "visualizer_path": "recursion",
        "python": """def fibonacci(n):
    # Base cases
    if n <= 0:
        return 0
    elif n == 1:
        return 1
        
    # Recursive calls
    return fibonacci(n - 1) + fibonacci(n - 2)""",
        "java": """class Recursion {
    int fibonacci(int n) {
        // Base cases
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        // Recursive calls
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}""",
        "cpp": """int fibonacci(int n) {
    // Base cases
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // Recursive calls
    return fibonacci(n - 1) + fibonacci(n - 2);
}""",
        "c": """#include <stdio.h>

int fibonacci(int n) {
    // Base cases
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    // Recursive calls
    return fibonacci(n - 1) + fibonacci(n - 2);
}"""
    },
    "astar": {
        "title": "A* Search",
        "tag": "Pathfinding",
        "intro": "Heuristic-driven shortest pathfinding algorithm for grids and navigation graphs.",
        "concept": "A* (A-Star) is a popular and efficient heuristic-based pathfinding algorithm. It is used to find the shortest path from a start node to a goal node. It combines the actual distance from the start node (g-score) with an estimated heuristic distance to the goal node (h-score) using the function f(n) = g(n) + h(n) to prioritize node exploration.",
        "characteristics": [
            "Uses heuristics (e.g. Manhattan or Euclidean distance) to guide search.",
            "Guarantees the shortest path if the heuristic is admissible (never overestimates).",
            "Maintains Open and Closed lists of candidate nodes.",
            "Widely used in game AI, robotics, and mapping applications."
        ],
        "time_complexity": "O(E * log V) where E is edges and V is vertices",
        "space_complexity": "O(V) node queue allocation",
        "best_case": "O(V) (heuristic leads directly to target)",
        "worst_case": "O(E) (exploring all nodes in graph)",
        "steps": [
            "<strong>Initialize Lists:</strong> Create an Open list (min-priority queue) containing the start node, and an empty Closed list.",
            "<strong>Extract Best Node:</strong> Pop the node n with the lowest f(n) from the Open list.",
            "<strong>Target Check:</strong> If n is the goal, reconstruct the path and terminate.",
            "<strong>Relax Neighbors:</strong> For each neighbor, calculate its tentative g-score. If it's lower than recorded, update its parent, g-score, f-score, and add to Open list.",
            "<strong>Iterate:</strong> Mark node n as closed and repeat steps 2-4 until target found or Open list empty."
        ],
        "example": "A* Search on grid from (0,0) to (2,2) with obstacle at (1,1):<br>1. Start node (0,0): g=0, h=4 (Manhattan to (2,2)), f=4.<br>2. Open neighbors (1,0) and (0,1): both have g=1, h=3, f=4.<br>3. Pop (1,0): check neighbors. (2,0) has g=2, h=2, f=4. Obstacle at (1,1) skipped.<br>4. Pop (2,0): check neighbors. (2,1) has g=3, h=1, f=4.<br>5. Pop (2,1): neighbor (2,2) is goal! Path found: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2).",
        "visualizer_path": "astar",
        "python": """import heapq

def astar_search(grid, start, goal):
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1]) # Manhattan
        
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}
    
    while open_set:
        _, curr = heapq.heappop(open_set)
        
        if curr == goal:
            # Reconstruct path
            path = []
            while curr in came_from:
                path.append(curr)
                curr = came_from[curr]
            path.append(start)
            return path[::-1]
            
        for neighbor in grid.get_neighbors(curr):
            tentative_g = g_score[curr] + 1
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = curr
                g_score[neighbor] = tentative_g
                f_score = tentative_g + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score, neighbor))
                
    return [] # No path found""",
        "java": """import java.util.*;

class AStar {
    static class Node implements Comparable<Node> {
        int r, c, g, f;
        Node parent;
        Node(int r, int c) { this.r = r; this.c = c; }
        public int compareTo(Node other) { return Integer.compare(this.f, other.f); }
    }

    int heuristic(Node a, Node b) {
        return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
    }

    List<Node> findPath(int[][] grid, Node start, Node goal) {
        PriorityQueue<Node> openSet = new PriorityQueue<>();
        boolean[][] closedSet = new boolean[grid.length][grid[0].length];
        
        start.g = 0;
        start.f = heuristic(start, goal);
        openSet.add(start);
        
        while (!openSet.isEmpty()) {
            Node curr = openSet.poll();
            if (curr.r == goal.r && curr.c == goal.c) {
                List<Node> path = new ArrayList<>();
                while (curr != null) { path.add(0, curr); curr = curr.parent; }
                return path;
            }
            closedSet[curr.r][curr.c] = true;
            
            // Loop neighbors (simplified 4-directional)
            int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};
            for (int[] d : dirs) {
                int nr = curr.r + d[0], nc = curr.c + d[1];
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] == 0 && !closedSet[nr][nc]) {
                    Node neighbor = new Node(nr, nc);
                    int tentativeG = curr.g + 1;
                    neighbor.g = tentativeG;
                    neighbor.f = tentativeG + heuristic(neighbor, goal);
                    neighbor.parent = curr;
                    openSet.add(neighbor);
                }
            }
        }
        return new ArrayList<>();
    }
}""",
        "cpp": """#include <vector>
#include <queue>
#include <cmath>
#include <algorithm>

struct Node {
    int r, c, g, f;
    Node* parent = nullptr;
    bool operator>(const Node& other) const { return f > other.f; }
};

int heuristic(Node* a, Node* b) {
    return std::abs(a->r - b->r) + std::abs(a->c - b->c);
}

std::vector<Node*> astar(const std::vector<std::vector<int>>& grid, Node* start, Node* goal) {
    std::priority_queue<Node*, std::vector<Node*>, std::greater<Node*>> openSet;
    std::vector<std::vector<bool>> closedSet(grid.size(), std::vector<bool>(grid[0].size(), false));
    
    start->g = 0;
    start->f = heuristic(start, goal);
    openSet.push(start);
    
    while (!openSet.empty()) {
        Node* curr = openSet.top();
        openSet.pop();
        
        if (curr->r == goal->r && curr->c == goal->c) {
            std::vector<Node*> path;
            while (curr) { path.push_back(curr); curr = curr->parent; }
            std::reverse(path.begin(), path.end());
            return path;
        }
        
        closedSet[curr->r][curr->c] = true;
        int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        for (auto& d : dirs) {
            int nr = curr->r + d[0], nc = curr->c + d[1];
            if (nr >= 0 && nr < grid.size() && nc >= 0 && nc < grid[0].size() && grid[nr][nc] == 0 && !closedSet[nr][nc]) {
                Node* neighbor = new Node{nr, nc, curr->g + 1, 0, curr};
                neighbor->f = neighbor->g + heuristic(neighbor, goal);
                openSet.push(neighbor);
            }
        }
    }
    return {};
}""",
        "c": """#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>

struct Node {
    int r, c, g, f;
    struct Node* parent;
};

int heuristic(struct Node* a, struct Node* b) {
    return abs(a->r - b->r) + abs(a->c - b->c);
}

// Simplified sequential searching open set for grid routing in C
bool astar(int grid[10][10], int rows, int cols, struct Node* start, struct Node* goal, struct Node path[], int* pathSize) {
    struct Node openSet[100];
    bool closedSet[10][10] = {false};
    int openCount = 0;
    
    start->g = 0;
    start->f = heuristic(start, goal);
    start->parent = NULL;
    openSet[openCount++] = *start;
    
    while (openCount > 0) {
        // Find node with lowest f
        int bestIdx = 0;
        for (int i = 1; i < openCount; i++) {
            if (openSet[i].f < openSet[bestIdx].f) bestIdx = i;
        }
        
        struct Node curr = openSet[bestIdx];
        if (curr.r == goal->r && curr.c == goal->c) {
            // Reconstruct path
            int idx = 0;
            struct Node* temp = &curr;
            while (temp != NULL) {
                path[idx++] = *temp;
                temp = temp->parent;
            }
            *pathSize = idx;
            return true;
        }
        
        // Remove from openSet
        for (int i = bestIdx; i < openCount - 1; i++) openSet[i] = openSet[i+1];
        openCount--;
        closedSet[curr.r][curr.c] = true;
        
        int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};
        for (int i = 0; i < 4; i++) {
            int nr = curr.r + dirs[i][0];
            int nc = curr.c + dirs[i][1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 0 && !closedSet[nr][nc]) {
                struct Node neighbor;
                neighbor.r = nr; neighbor.c = nc;
                neighbor.g = curr.g + 1;
                neighbor.parent = (struct Node*)malloc(sizeof(struct Node));
                *(neighbor.parent) = curr;
                neighbor.f = neighbor.g + heuristic(&neighbor, goal);
                openSet[openCount++] = neighbor;
            }
        }
    }
    return false;
}"""
    },
    "bellman-ford": {
        "title": "Bellman-Ford Algorithm",
        "tag": "Shortest Path",
        "intro": "Shortest path algorithm capable of handling negative edge weights and detecting negative cycles.",
        "concept": "The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, it supports negative edge weights. It works by repeatedly relaxing all edges V-1 times. On the V-th iteration, it checks for negative-weight cycles; if a path's cost decreases, a negative cycle exists, making a finite shortest path impossible.",
        "characteristics": [
            "Supports negative edge weights.",
            "Detects negative-weight cycles.",
            "Dynamic programming approach via bottom-up relaxation.",
            "Slower than Dijkstra but more versatile."
        ],
        "time_complexity": "O(V * E) where V is vertices count and E is edge count",
        "space_complexity": "O(V) distance storage table",
        "best_case": "O(E) (all shortest paths found in first iteration)",
        "worst_case": "O(V * E) (all iterations relaxed exhaustively)",
        "steps": [
            "<strong>Initialize:</strong> Set distance to source node to 0, and all other nodes to infinity.",
            "<strong>Relax Edges:</strong> Loop V-1 times. In each iteration, for every edge (u, v) with weight w, if dist[u] + w < dist[v], set dist[v] = dist[u] + w.",
            "<strong>Cycle Check:</strong> Loop through all edges one more time. If dist[u] + w < dist[v] for any edge, report that a negative cycle exists."
        ],
        "example": "Graph with A->B (4), B->C (-2), A->C (5). Source A:<br>1. Initial: dist[A]=0, dist[B]=∞, dist[C]=∞.<br>2. Iteration 1: Relax A->B: dist[B]=4. Relax B->C: dist[C]=4-2=2. Relax A->C: dist[C]=min(2,5)=2.<br>3. Iteration 2: No changes. dist[A]=0, dist[B]=4, dist[C]=2.<br>Result: Optimal paths found.",
        "visualizer_path": "bellman-ford",
        "python": """def bellman_ford(vertices, edges, source):
    # Step 1: Initialize distances
    dist = {v: float('inf') for v in vertices}
    dist[source] = 0
    
    # Step 2: Relax edges |V| - 1 times
    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    # Step 3: Check for negative-weight cycles
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            raise ValueError("Graph contains negative cycle")
            
    return dist""",
        "java": """import java.util.*;

class BellmanFord {
    static class Edge {
        int u, v, w;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.w = w; }
    }

    boolean runBellmanFord(int V, List<Edge> edges, int src, int[] dist) {
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        for (int i = 0; i < V - 1; i++) {
            for (Edge e : edges) {
                if (dist[e.u] != Integer.MAX_VALUE && dist[e.u] + e.w < dist[e.v]) {
                    dist[e.v] = dist[e.u] + e.w;
                }
            }
        }
        
        for (Edge e : edges) {
            if (dist[e.u] != Integer.MAX_VALUE && dist[e.u] + e.w < dist[e.v]) {
                return false; // Negative cycle detected
            }
        }
        return true;
    }
}""",
        "cpp": """#include <vector>
#include <climits>

struct Edge {
    int u, v, w;
};

bool bellmanFord(int V, const std::vector<Edge>& edges, int src, std::vector<int>& dist) {
    dist.assign(V, INT_MAX);
    dist[src] = 0;
    
    for (int i = 0; i < V - 1; ++i) {
        for (const auto& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
            }
        }
    }
    
    for (const auto& e : edges) {
        if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
            return false; // Negative cycle detected
        }
    }
    return true;
}""",
        "c": """#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

struct Edge {
    int u, v, w;
};

bool bellmanFord(int V, int E, struct Edge edges[], int src, int dist[]) {
    for (int i = 0; i < V; i++) dist[i] = INT_MAX;
    dist[src] = 0;
    
    for (int i = 0; i < V - 1; i++) {
        for (int j = 0; j < E; j++) {
            int u = edges[j].u;
            int v = edges[j].v;
            int w = edges[j].w;
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    for (int j = 0; j < E; j++) {
        int u = edges[j].u;
        int v = edges[j].v;
        int w = edges[j].w;
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            return false; // Negative cycle
        }
    }
    return true;
}"""
    },
    "mst": {
        "title": "Minimum Spanning Tree",
        "tag": "Minimum Spanning Tree",
        "intro": "Graph connectivity algorithms (Kruskal's and Prim's) that find the minimum cost to link all vertices.",
        "concept": "A Minimum Spanning Tree (MST) is a subset of the edges of a connected, edge-weighted undirected graph that connects all the vertices together, without any cycles and with the minimum possible total edge weight. Kruskal's Algorithm builds the tree by sorting all edges and adding them one-by-one, using a Disjoint-Set (Union-Find) data structure to prevent cycles.",
        "characteristics": [
            "Connects all vertices without loops/cycles.",
            "Total edges in MST is always V-1.",
            "Prim's is node-centric (good for dense graphs).",
            "Kruskal's is edge-centric (good for sparse graphs)."
        ],
        "time_complexity": "O(E * log V) using priority queues or sorting",
        "space_complexity": "O(V + E) for storing graph and Union-Find",
        "best_case": "O(E * log V)",
        "worst_case": "O(E * log V)",
        "steps": [
            "<strong>Sort Edges:</strong> Sort all edges in non-decreasing order of their weight.",
            "<strong>Union-Find Init:</strong> Create a disjoint set representation for each vertex.",
            "<strong>Pick Smallest Edge:</strong> Select the smallest edge. Check if vertices belong to the same subset.",
            "<strong>Include or Skip:</strong> If subsets are different, merge subsets (union) and add the edge to the MST. Otherwise, skip.",
            "<strong>Terminate:</strong> Repeat until V-1 edges are added to the MST."
        ],
        "example": "Edges: A-B(4), B-C(2), A-C(3). 3 vertices:<br>1. Sorted edges: B-C(2), A-C(3), A-B(4).<br>2. Add B-C(2): MST has B-C.<br>3. Add A-C(3): doesn't make a cycle. MST has B-C, A-C.<br>4. Edge A-B(4) forms cycle A-C-B-A: discarded.<br>Result: MST edges: B-C and A-C. Total weight = 5.",
        "visualizer_path": "mst",
        "python": """class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        
    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
        
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            if self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            elif self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
            return True
        return False

def kruskal_mst(n, edges):
    # edges = [(u, v, w), ...]
    edges.sort(key=lambda x: x[2])
    ds = DisjointSet(n)
    mst = []
    mst_weight = 0
    
    for u, v, w in edges:
        if ds.union(u, v):
            mst.append((u, v, w))
            mst_weight += w
            if len(mst) == n - 1:
                break
                
    return mst, mst_weight""",
        "java": """import java.util.*;

class Kruskal {
    static class Edge implements Comparable<Edge> {
        int u, v, w;
        Edge(int u, int v, int w) { this.u = u; this.v = v; this.w = w; }
        public int compareTo(Edge other) { return Integer.compare(this.w, other.w); }
    }

    static class DisjointSet {
        int[] parent, rank;
        DisjointSet(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }
        int find(int i) {
            if (parent[i] == i) return i;
            return parent[i] = find(parent[i]);
        }
        boolean union(int x, int y) {
            int rx = find(x), ry = find(y);
            if (rx != ry) {
                if (rank[rx] < rank[ry]) parent[rx] = ry;
                else if (rank[rx] > rank[ry]) parent[ry] = rx;
                else { parent[ry] = rx; rank[rx]++; }
                return true;
            }
            return false;
        }
    }

    List<Edge> runKruskal(int n, List<Edge> edges) {
        Collections.sort(edges);
        DisjointSet ds = new DisjointSet(n);
        List<Edge> mst = new ArrayList<>();
        
        for (Edge e : edges) {
            if (ds.union(e.u, e.v)) {
                mst.add(e);
                if (mst.size() == n - 1) break;
            }
        }
        return mst;
    }
}""",
        "cpp": """#include <vector>
#include <algorithm>

struct Edge {
    int u, v, w;
    bool operator<(const Edge& other) const { return w < other.w; }
};

struct DisjointSet {
    std::vector<int> parent, rank;
    DisjointSet(int n) {
        parent.resize(n);
        rank.assign(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    bool unionSets(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx != ry) {
            if (rank[rx] < rank[ry]) parent[rx] = ry;
            else if (rank[rx] > rank[ry]) parent[ry] = rx;
            else { parent[ry] = rx; rank[rx]++; }
            return true;
        }
        return false;
    }
};

std::vector<Edge> kruskal(int n, std::vector<Edge>& edges) {
    std::sort(edges.begin(), edges.end());
    DisjointSet ds(n);
    std::vector<Edge> mst;
    for (const auto& e : edges) {
        if (ds.unionSets(e.u, e.v)) {
            mst.push_back(e);
            if (mst.size() == n - 1) break;
        }
    }
    return mst;
}""",
        "c": """#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct Edge {
    int u, v, w;
};

int compareEdges(const void* a, const void* b) {
    return ((struct Edge*)a)->w - ((struct Edge*)b)->w;
}

int findSet(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = findSet(parent, parent[i]);
}

bool unionSets(int parent[], int rank[], int x, int y) {
    int rx = findSet(parent, x);
    int ry = findSet(parent, y);
    if (rx != ry) {
        if (rank[rx] < rank[ry]) parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
    return false;
}

void kruskal(int n, int e, struct Edge edges[], struct Edge mst[], int* mstSize) {
    qsort(edges, e, sizeof(struct Edge), compareEdges);
    int* parent = (int*)malloc(n * sizeof(int));
    int* rank = (int*)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) parent[i] = i;
    
    int count = 0;
    for (int i = 0; i < e; i++) {
        if (unionSets(parent, rank, edges[i].u, edges[i].v)) {
            mst[count++] = edges[i];
            if (count == n - 1) break;
        }
    }
    *mstSize = count;
    free(parent);
    free(rank);
}"""
    },
    "topo": {
        "title": "Topological Sort",
        "tag": "Scheduling",
        "intro": "Linear ordering of vertices in a Directed Acyclic Graph (DAG) respecting dependency constraints.",
        "concept": "Topological Sorting of a directed acyclic graph (DAG) is a linear ordering of its vertices such that for every directed edge u -> v, vertex u comes before v in the ordering. Kahn's Algorithm is a queue-based topological sort that iteratively removes vertices with zero in-degree (no incoming dependencies) and updates their neighbors.",
        "characteristics": [
            "Only works on Directed Acyclic Graphs (DAGs).",
            "If a graph has cycles, topological sorting is impossible.",
            "Kahn's Algorithm uses in-degree tracking.",
            "Essential for task scheduling, compilers, and package managers."
        ],
        "time_complexity": "O(V + E) where V is vertices and E is edges",
        "space_complexity": "O(V) in-degree array and queue storage",
        "best_case": "O(V + E)",
        "worst_case": "O(V + E)",
        "steps": [
            "<strong>Calculate In-Degrees:</strong> Compute the number of incoming edges for all vertices.",
            "<strong>Queue Init:</strong> Insert all vertices with in-degree equal to 0 into a queue.",
            "<strong>Extract & Record:</strong> Pop vertex u from queue, append it to result sequence.",
            "<strong>Relax Neighbors:</strong> For each outgoing edge u -> v, decrement in-degree of v. If in-degree of v becomes 0, push it into the queue.",
            "<strong>Acyclicity Check:</strong> If output contains fewer than V nodes, the graph has a cycle."
        ],
        "example": "DAG with edges: A->B, A->C, B->D, C->D. 4 nodes:<br>1. In-degrees: A=0, B=1, C=1, D=2. Queue = [A].<br>2. Pop A: result = [A]. Decrement neighbors: B in-degree=0, C in-degree=0. Queue = [B, C].<br>3. Pop B: result = [A, B]. Decrement neighbor D: D in-degree=1.<br>4. Pop C: result = [A, B, C]. Decrement neighbor D: D in-degree=0. Queue = [D].<br>5. Pop D: result = [A, B, C, D]. Queue empty.<br>Result: Valid topological order A -> B -> C -> D.",
        "visualizer_path": "topo",
        "python": """from collections import deque

def topological_sort(n, adj_list):
    in_degree = [0] * n
    for u in range(n):
        for v in adj_list[u]:
            in_degree[v] += 1
            
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    while queue:
        u = queue.popleft()
        result.append(u)
        for v in adj_list[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
                
    if len(result) != n:
        return [] # Cycle detected
        
    return result""",
        "java": """import java.util.*;

class TopologicalSort {
    List<Integer> runSort(int n, List<List<Integer>> adj) {
        int[] inDegree = new int[n];
        for (int u = 0; u < n; u++) {
            for (int v : adj.get(u)) inDegree[v]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) q.add(i);
        }
        
        List<Integer> result = new ArrayList<>();
        while (!q.isEmpty()) {
            int u = q.poll();
            result.add(u);
            for (int v : adj.get(u)) {
                inDegree[v]--;
                if (inDegree[v] == 0) q.add(v);
            }
        }
        
        if (result.size() != n) return new ArrayList<>(); // Cycle detected
        return result;
    }
}""",
        "cpp": """#include <vector>
#include <queue>

std::vector<int> topologicalSort(int n, const std::vector<std::vector<int>>& adj) {
    std::vector<int> inDegree(n, 0);
    for (int u = 0; u < n; ++u) {
        for (int v : adj[u]) inDegree[v]++;
    }
    
    std::queue<int> q;
    for (int i = 0; i < n; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }
    
    std::vector<int> result;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        for (int v : adj[u]) {
            inDegree[v]--;
            if (inDegree[v] == 0) q.push(v);
        }
    }
    
    if (result.size() != n) return {}; // Cycle detected
    return result;
}""",
        "c": """#include <stdio.h>
#include <stdbool.h>

bool topologicalSort(int n, int adj[][10], int counts[], int result[]) {
    int inDegree[10] = {0};
    for (int u = 0; u < n; u++) {
        for (int i = 0; i < counts[u]; i++) {
            inDegree[adj[u][i]]++;
        }
    }
    
    int queue[10];
    int front = 0, rear = 0;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) queue[rear++] = i;
    }
    
    int count = 0;
    while (front < rear) {
        int u = queue[front++];
        result[count++] = u;
        for (int i = 0; i < counts[u]; i++) {
            int v = adj[u][i];
            inDegree[v]--;
            if (inDegree[v] == 0) queue[rear++] = v;
        }
    }
    
    return count == n; // returns false if cycle exists
}"""
    },
    "advanced-sorting": {
        "title": "Radix & Bucket Sort",
        "tag": "Distribution Sorts",
        "intro": "Non-comparison based sorting algorithms achieving linear complexity under value constraints.",
        "concept": "Radix Sort and Bucket Sort are non-comparison based sorting algorithms. Radix Sort processes numbers digit-by-digit, from the least significant digit (LSD) to the most significant digit (MSD), using Counting Sort as a stable sorting subroutine. Bucket Sort partitions elements into a finite number of buckets, sorts each bucket individually (e.g. using Insertion Sort), and concatenates them.",
        "characteristics": [
            "Does not compare elements directly.",
            "Radix Sort is stable.",
            "Bucket Sort relies on uniform distribution of inputs.",
            "Can sort in O(N) linear time under specific conditions."
        ],
        "time_complexity": "O(d * (N + k)) for Radix, O(N + k) average for Bucket",
        "space_complexity": "O(N + k) auxiliary memory space",
        "best_case": "O(N)",
        "worst_case": "O(N^2) for Bucket Sort (skewed buckets)",
        "steps": [
            "<strong>Radix Sort:</strong> Find the maximum number to determine the number of digits (d).",
            "<strong>Counting Sort Pass:</strong> Loop from least significant digit (1s) to most significant digit (10s, 100s, ...).",
            "<strong>Evaluate Digit:</strong> Perform stable Counting Sort on the array based on the active digit.",
            "<strong>Bucket Sort:</strong> Create an array of empty buckets.",
            "<strong>Distribute:</strong> Put array elements into buckets based on value range: index = floor(N * value / Max).",
            "<strong>Sort & Merge:</strong> Sort each bucket individually and concatenate results."
        ],
        "example": "Radix sorting [170, 45, 75, 90, 802, 24, 2, 66]:<br>1. Sort by 1s digit: [170, 90, 802, 2, 24, 45, 75, 66]<br>2. Sort by 10s digit: [802, 2, 24, 45, 66, 170, 75, 90]<br>3. Sort by 100s digit: [2, 24, 45, 66, 75, 90, 170, 802]<br>Result: Sorted array.",
        "visualizer_path": "advanced-sorting",
        "python": """def counting_sort_for_radix(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
        
    for i in range(1, 10):
        count[i] += count[i - 1]
        
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
        
    for i in range(n):
        arr[i] = output[i]

def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10""",
        "java": """class RadixSort {
    void countingSort(int[] arr, int n, int exp) {
        int[] output = new int[n];
        int[] count = new int[10];
        
        for (int i = 0; i < n; i++) count[(arr[i]/exp)%10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i-1];
        
        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i]/exp)%10] - 1] = arr[i];
            count[(arr[i]/exp)%10]--;
        }
        System.arraycopy(output, 0, arr, 0, n);
    }

    void sort(int[] arr) {
        int max = arr[0];
        for (int val : arr) if (val > max) max = val;
        
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSort(arr, arr.length, exp);
        }
    }
}""",
        "cpp": """#include <vector>
#include <algorithm>

void countingSort(std::vector<int>& arr, int exp) {
    int n = arr.size();
    std::vector<int> output(n);
    int count[10] = {0};
    
    for (int i = 0; i < n; i++) count[(arr[i]/exp)%10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10] - 1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(std::vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *std::max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        countingSort(arr, exp);
    }
}""",
        "c": """#include <stdio.h>

void countingSort(int arr[], int n, int exp) {
    int output[100];
    int count[10] = {0};
    
    for (int i = 0; i < n; i++) count[(arr[i]/exp)%10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i-1];
    
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i]/exp)%10] - 1] = arr[i];
        count[(arr[i]/exp)%10]--;
    }
    for (int i = 0; i < n; i++) arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        countingSort(arr, n, exp);
    }
}"""
    },
    "dp": {
        "title": "Dynamic Programming",
        "tag": "Optimization",
        "intro": "Optimization technique solving complex problems by breaking them into overlapping subproblems and caching results.",
        "concept": "Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable to problems exhibiting overlapping subproblems and optimal substructure. Rather than recomputing subproblems, DP caches answers in memory. This can be done top-down with memoization (recursion + hashing) or bottom-up with tabulation (iterative array updates).",
        "characteristics": [
            "Eliminates redundant overlapping computations.",
            "Optimal substructure: overall solution built from local subproblem solutions.",
            "Memoization: Top-Down recursion with lookup cache.",
            "Tabulation: Bottom-Up iterative table updates."
        ],
        "time_complexity": "O(N) for linear sequence tabulation",
        "space_complexity": "O(N) memory table size",
        "best_case": "O(N)",
        "worst_case": "O(N)",
        "steps": [
            "<strong>State Definition:</strong> Define the state variables (e.g. DP[i] represents fib(i)).",
            "<strong>Base Cases:</strong> Initialize baseline states (e.g. DP[0] = 0, DP[1] = 1).",
            "<strong>State Transition:</strong> Define transition formula (e.g. DP[i] = DP[i-1] + DP[i-2]).",
            "<strong>Iterative Table Fill:</strong> Run a loop from i=2 to N, filling DP[i] using the transition.",
            "<strong>Return Result:</strong> Access DP[N] for the final solution."
        ],
        "example": "Tabulating fib(4):<br>1. Initialize array DP size 5: DP = [0, 1, 0, 0, 0].<br>2. Compute DP[2] = DP[1] + DP[0] = 1 + 0 = 1. DP becomes [0, 1, 1, 0, 0].<br>3. Compute DP[3] = DP[2] + DP[1] = 1 + 1 = 2. DP becomes [0, 1, 1, 2, 0].<br>4. Compute DP[4] = DP[3] + DP[2] = 2 + 1 = 3. DP becomes [0, 1, 1, 2, 3].<br>Result: fib(4) = 3.",
        "visualizer_path": "dp",
        "python": """def fibonacci_tabulation(n):
    if n <= 0: return 0
    if n == 1: return 1
    
    # Create DP table
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
        
    return dp[n]""",
        "java": """class DynamicProgramming {
    int fibonacciTabulation(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }
}""",
        "cpp": """#include <vector>

int fibonacciTabulation(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    std::vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}""",
        "c": """#include <stdio.h>

int fibonacciTabulation(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    int dp[100];
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}"""
    },
    "cycle-detection": {
        "title": "Cycle Detection",
        "tag": "Analysis",
        "intro": "Identifying cycles in graphs using DFS traversal and recursive stack tracking.",
        "concept": "Cycle Detection is the task of finding closed loops in graphs. In directed graphs, cycles are detected during a Depth-First Search (DFS) traversal by identifying 'back-edges'. A back-edge is an edge that points from the current vertex to an ancestor vertex that is still active in the current recursion stack.",
        "characteristics": [
            "Detects recursive loops in directed networks.",
            "Maintains recursion stack state.",
            "Distinguishes between back-edges, forward-edges, and cross-edges.",
            "Essential for deadlock detection and compiler compilation orders."
        ],
        "time_complexity": "O(V + E) where V is vertices and E is edges",
        "space_complexity": "O(V) visitor state maps",
        "best_case": "O(1) (cycle detected at first node)",
        "worst_case": "O(V + E) (acyclic graph)",
        "steps": [
            "<strong>State Init:</strong> Maintain arrays/maps for visited (fully processed) and recursion_stack (active in current DFS path).",
            "<strong>Loop All Nodes:</strong> For each unvisited node, run DFS.",
            "<strong>Push Recursion:</strong> Mark current node as visited and add to recursion_stack.",
            "<strong>Evaluate Neighbors:</strong> For each neighbor v, if v is in recursion_stack, a cycle is detected.",
            "<strong>Recurse:</strong> If neighbor v is not visited, recursively call DFS on v. If that returns true, propagate cycle detection.",
            "<strong>Backtrack:</strong> Remove current node from recursion_stack and return false."
        ],
        "example": "Directed graph: A->B, B->C, C->A:<br>1. DFS(A): mark A as visited & active. Stack = {A}.<br>2. Visit B: DFS(B): mark B as visited & active. Stack = {A, B}.<br>3. Visit C: DFS(C): mark C as visited & active. Stack = {A, B, C}.<br>4. From C: Neighbor A is already in the recursion stack! Cycle detected.<br>Result: Cycle detected (A->B->C->A).",
        "visualizer_path": "cycle-detection",
        "python": """def has_cycle_dfs(u, adj, visited, rec_stack):
    visited[u] = True
    rec_stack[u] = True
    
    for v in adj[u]:
        if not visited[v]:
            if has_cycle_dfs(v, adj, visited, rec_stack):
                return True
        elif rec_stack[v]:
            return True
            
    rec_stack[u] = False
    return False

def detect_cycle(n, adj):
    visited = [False] * n
    rec_stack = [False] * n
    
    for i in range(n):
        if not visited[i]:
            if has_cycle_dfs(i, adj, visited, rec_stack):
                return True
    return False""",
        "java": """import java.util.*;

class CycleDetection {
    private boolean dfs(int u, List<List<Integer>> adj, boolean[] visited, boolean[] recStack) {
        visited[u] = true;
        recStack[u] = true;
        
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                if (dfs(v, adj, visited, recStack)) return true;
            } else if (recStack[v]) {
                return true;
            }
        }
        recStack[u] = false;
        return false;
    }

    boolean hasCycle(int n, List<List<Integer>> adj) {
        boolean[] visited = new boolean[n];
        boolean[] recStack = new boolean[n];
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                if (dfs(i, adj, visited, recStack)) return true;
            }
        }
        return false;
    }
}""",
        "cpp": """#include <vector>

bool dfs(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited, std::vector<bool>& recStack) {
    visited[u] = true;
    recStack[u] = true;
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            if (dfs(v, adj, visited, recStack)) return true;
        } else if (recStack[v]) {
            return true;
        }
    }
    recStack[u] = false;
    return false;
}

bool hasCycle(int n, const std::vector<std::vector<int>>& adj) {
    std::vector<bool> visited(n, false);
    std::vector<bool> recStack(n, false);
    
    for (int i = 0; i < n; ++i) {
        if (!visited[i]) {
            if (dfs(i, adj, visited, recStack)) return true;
        }
    }
    return false;
}""",
        "c": """#include <stdio.h>
#include <stdbool.h>

bool dfs(int u, int adj[][10], int counts[], bool visited[], bool recStack[]) {
    visited[u] = true;
    recStack[u] = true;
    
    for (int i = 0; i < counts[u]; i++) {
        int v = adj[u][i];
        if (!visited[v]) {
            if (dfs(v, adj, counts, visited, recStack)) return true;
        } else if (recStack[v]) {
            return true;
        }
    }
    recStack[u] = false;
    return false;
}

bool hasCycle(int n, int adj[][10], int counts[]) {
    bool visited[10] = {false};
    bool recStack[10] = {false};
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfs(i, adj, counts, visited, recStack)) return true;
        }
    }
    return false;
}"""
    },
    "bubble": {
        "title": "Bubble Sort",
        "tag": "Sorting",
        "intro": "A simple comparison-based sorting algorithm that repeatedly swaps adjacent out-of-order elements.",
        "concept": "Bubble Sort is a simple comparison-based sorting algorithm. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted, bubbling the largest unsorted elements to their correct positions at the end of each pass.",
        "characteristics": [
            "Stable sort: maintains relative order of equal keys.",
            "In-place sort: O(1) auxiliary memory.",
            "Simple implementation but inefficient for large datasets.",
            "Optimizable by stopping early if a pass completes without any swaps."
        ],
        "time_complexity": "O(N^2) average and worst case",
        "space_complexity": "O(1) in-place storage",
        "best_case": "O(N) (pre-sorted array with early exit check)",
        "worst_case": "O(N^2) (reverse sorted array)",
        "steps": [
            "<strong>Iterate Passes:</strong> Loop from i=0 to N-1 for passes.",
            "<strong>Compare Adjacent:</strong> Loop j from 0 to N-i-2. Compare array[j] and array[j+1].",
            "<strong>Swap:</strong> If array[j] > array[j+1], swap their positions. Set swapped = true.",
            "<strong>Optimization Check:</strong> If a pass finishes with swapped == false, the array is sorted; exit early."
        ],
        "example": "Sorting [5, 1, 4, 2]:<br>1. Pass 1: Compare 5,1 (swap) -> [1, 5, 4, 2]. Compare 5,4 (swap) -> [1, 4, 5, 2]. Compare 5,2 (swap) -> [1, 4, 2, 5]. Max element 5 bubbled to end.<br>2. Pass 2: Compare 1,4 (no swap) -> [1, 4, 2, 5]. Compare 4,2 (swap) -> [1, 2, 4, 5]. Compare 4,5 (no swap) -> [1, 2, 4, 5].<br>3. Pass 3: No swaps occur. Exit early.<br>Result: Sorted array [1, 2, 4, 5].",
        "visualizer_path": "bubble",
        "python": """def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break""",
        "java": """class BubbleSort {
    void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}""",
        "cpp": """#include <vector>
#include <algorithm>

void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}""",
        "c": """#include <stdio.h>
#include <stdbool.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}"""
    },
    "selection": {
        "title": "Selection Sort",
        "tag": "Sorting",
        "intro": "A comparison-based sorting algorithm that repeatedly selects the minimum element from the unsorted portion.",
        "concept": "Selection Sort divides the input array into two parts: a sorted sublist built up from left to right, and an unsorted sublist. It works by repeatedly finding the minimum element from the unsorted sublist and swapping it with the first element of the unsorted sublist, expanding the sorted boundary.",
        "characteristics": [
            "Unstable sort: may change relative order of equal items.",
            "In-place: O(1) auxiliary memory.",
            "Performs exactly N swaps in worst case (constant write overhead).",
            "Independent of initial ordering: always takes O(N^2) comparisons."
        ],
        "time_complexity": "O(N^2) for all cases",
        "space_complexity": "O(1) auxiliary memory",
        "best_case": "O(N^2) comparisons, O(1) swaps",
        "worst_case": "O(N^2) comparisons, O(N) swaps",
        "steps": [
            "<strong>Set Boundary:</strong> Loop index i from 0 to N-2.",
            "<strong>Scan Min:</strong> Assume array[i] is minimum. Loop index j from i+1 to N-1 to find the actual minimum element in the unsorted range.",
            "<strong>Update Min Index:</strong> If array[j] < array[min_idx], set min_idx = j.",
            "<strong>Swap:</strong> Swap array[i] with array[min_idx]. Repeat until array is fully sorted."
        ],
        "example": "Sorting [29, 10, 14, 37]:<br>1. Pass 1 (i=0): Unsorted is [29, 10, 14, 37]. Min is 10. Swap 29 and 10 -> [10, 29, 14, 37].<br>2. Pass 2 (i=1): Unsorted is [29, 14, 37]. Min is 14. Swap 29 and 14 -> [10, 14, 29, 37].<br>3. Pass 3 (i=2): Unsorted is [29, 37]. Min is 29. No swap -> [10, 14, 29, 37].<br>Result: Sorted array [10, 14, 29, 37].",
        "visualizer_path": "selection",
        "python": """def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]""",
        "java": """class SelectionSort {
    void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}""",
        "cpp": """#include <vector>
#include <algorithm>

void selectionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        std::swap(arr[i], arr[minIdx]);
    }
}""",
        "c": """#include <stdio.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}"""
    },
    "insertion": {
        "title": "Insertion Sort",
        "tag": "Sorting",
        "intro": "An intuitive comparison-based sorting algorithm that builds the sorted array one item at a time.",
        "concept": "Insertion Sort builds a sorted array one element at a time. It takes each incoming element from the unsorted section and inserts it into its correct relative position within the sorted section by shifting larger elements to the right.",
        "characteristics": [
            "Stable sort.",
            "In-place sort: O(1) memory.",
            "Adaptive: extremely efficient for nearly sorted or small datasets.",
            "Online: can sort data as it is received."
        ],
        "time_complexity": "O(N^2) average and worst case",
        "space_complexity": "O(1) auxiliary space",
        "best_case": "O(N) (pre-sorted array; no shifts)",
        "worst_case": "O(N^2) (reverse sorted array; maximum shifts)",
        "steps": [
            "<strong>Pick Key:</strong> Loop index i from 1 to N-1. Select key = array[i].",
            "<strong>Shifting Pointer:</strong> Set pointer j = i - 1.",
            "<strong>Shift elements:</strong> While j >= 0 and array[j] > key, shift array[j] to array[j+1] and decrement j.",
            "<strong>Insert Key:</strong> Place key at index j+1. Repeat for all elements."
        ],
        "example": "Sorting [12, 11, 13, 5, 6]:<br>1. i=1 (key=11): compare 11,12. Shift 12 -> [12, 12, 13, 5, 6]. Insert 11 -> [11, 12, 13, 5, 6].<br>2. i=2 (key=13): compare 13,12 (no shift) -> [11, 12, 13, 5, 6].<br>3. i=3 (key=5): compare 5 with 13, 12, 11. Shift all -> [11, 11, 12, 13, 6] -> insert 5 -> [5, 11, 12, 13, 6].<br>4. i=4 (key=6): shift 13, 12, 11. Insert 6 -> [5, 6, 11, 12, 13].<br>Result: Sorted array [5, 6, 11, 12, 13].",
        "visualizer_path": "insertion",
        "python": """def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key""",
        "java": """class InsertionSort {
    void sort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}""",
        "cpp": """#include <vector>

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}""",
        "c": """#include <stdio.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}"""
    },
    "quick": {
        "title": "Quick Sort",
        "tag": "Sorting",
        "intro": "A high-performance divide-and-conquer sorting algorithm based on partitioning around a pivot.",
        "concept": "Quick Sort is an efficient divide-and-conquer sorting algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.",
        "characteristics": [
            "Divide-and-conquer strategy.",
            "Unstable sort in its typical in-place formulation.",
            "High cache efficiency and fast in practice.",
            "Worst-case occurs with poor pivot choices."
        ],
        "time_complexity": "O(N * log N) average case",
        "space_complexity": "O(log N) stack memory",
        "best_case": "O(N * log N)",
        "worst_case": "O(N^2) (reverse sorted array with end pivot)",
        "steps": [
            "<strong>Select Pivot:</strong> Select a pivot element (e.g. last element, middle element, or random).",
            "<strong>Partitioning:</strong> Place elements smaller than pivot to its left, larger elements to its right. Place pivot at its final sorted position.",
            "<strong>Recurse Left:</strong> Invoke Quick Sort on the left partition (index low to pivot-1).",
            "<strong>Recurse Right:</strong> Invoke Quick Sort on the right partition (index pivot+1 to high)."
        ],
        "example": "Sorting [8, 3, 2, 7] using last element 7 as pivot:<br>1. Partitioning: elements < 7 go left, elements > 7 go right.<br>2. 3 and 2 are < 7, 8 is > 7.<br>3. Swap pivot 7 to index 2: [3, 2, 7, 8]. Pivot 7 is now in place.<br>4. Recurse on left [3, 2] with pivot 2: partitions to [2, 3].<br>5. Recurse on right [8] (single element: base case).<br>Result: Sorted array [2, 3, 7, 8].",
        "visualizer_path": "quick",
        "python": """def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)""",
        "java": """class QuickSort {
    int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
}""",
        "cpp": """#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}""",
        "c": """#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}"""
    },
    "merge": {
        "title": "Merge Sort",
        "tag": "Sorting",
        "intro": "A stable divide-and-conquer sorting algorithm that recursively splits and merges sub-arrays.",
        "concept": "Merge Sort is an O(N log N) comparison-based sorting algorithm. It is a divide-and-conquer algorithm that recursively divides the input array into two halves, calls Merge Sort on each half, and then merges the two sorted halves back together into a single sorted array.",
        "characteristics": [
            "Divide-and-conquer design.",
            "Stable sorting algorithm.",
            "Not in-place: requires O(N) auxiliary space for temp arrays.",
            "Guaranteed O(N log N) performance regardless of initial array ordering."
        ],
        "time_complexity": "O(N * log N) for all cases",
        "space_complexity": "O(N) auxiliary space",
        "best_case": "O(N * log N)",
        "worst_case": "O(N * log N)",
        "steps": [
            "<strong>Divide:</strong> Calculate midpoint: mid = (low + high) / 2.",
            "<strong>Sort Partitions:</strong> Recursively call Merge Sort on the left half (low to mid) and right half (mid+1 to high).",
            "<strong>Merge Temp:</strong> Combine the two sorted halves by comparing elements from each, copying them in sorted order into a temporary array.",
            "<strong>Update Source:</strong> Copy the merged values from the temporary array back to the original array."
        ],
        "example": "Sorting [38, 27, 43, 3]:<br>1. Split into left [38, 27] and right [43, 3].<br>2. Split [38, 27] into [38] and [27]. Merge them back sorted -> [27, 38].<br>3. Split [43, 3] into [43] and [3]. Merge them back sorted -> [3, 43].<br>4. Merge [27, 38] and [3, 43]: compare 27,3 (add 3) -> compare 27,43 (add 27) -> compare 38,43 (add 38) -> add 43.<br>Result: Sorted array [3, 27, 38, 43].",
        "visualizer_path": "merge",
        "python": """def merge(arr, l, m, r):
    n1 = m - l + 1
    n2 = r - m
    L = [arr[l + i] for i in range(n1)]
    R = [arr[m + 1 + j] for j in range(n2)]
    
    i = j = 0
    k = l
    while i < n1 and j < n2:
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
        
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
        
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1

def merge_sort(arr, l, r):
    if l < r:
        m = l + (r - l) // 2
        merge_sort(arr, l, m)
        merge_sort(arr, m + 1, r)""",
        "java": """class MergeSort {
    void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
        
        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) { arr[k] = L[i]; i++; k++; }
        while (j < n2) { arr[k] = R[j]; j++; k++; }
    }

    void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
        }
    }
}""",
        "cpp": """#include <vector>

void merge(std::vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    std::vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
    }
}""",
        "c": """#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
    
    free(L);
    free(R);
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
    }
}"""
    }
}

html_template = """<!DOCTYPE html>
<html lang="en" data-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} Guide - AlgoVisual Hub</title>
    <meta name="description"
        content="{concept_excerpt}">
    <link rel="stylesheet" href="../assets/css/main.css">
    <link rel="stylesheet" href="../assets/css/responsive.css?v=mobile_fix_1">

    <link rel="icon" href="../assets/img/logo.png" type="image/png">
</head>

<body><canvas id="brain-canvas"></canvas>
    <nav>
        <div class="container">
            <div class="nav-content">
                <a href="../index.html" class="logo">
                    <img src="../assets/img/logo.png" alt="AlgoVisual Hub" style="height:48px;width:48px;">
                    <span>AlgoVisual Hub</span>
                </a>
                <div class="nav-links">
                    <a href="../index.html">Home</a>
                    <a href="../dsa.html">DSA</a>
                    <a href="../algorithms.html">Algorithms</a>
                    <a href="../os.html">OS</a>
                    <a href="../roadmap.html">Roadmap</a>
                </div>
            </div>
        </div>
    </nav>

    <main>
        <div class="container" style="padding: 60px 24px;">
            <article>
                <header style="text-align: center; margin-bottom: 60px;">
                    <span class="section-tag">{tag}</span>
                    <h1
                        style="font-size: 3rem; font-weight: 900; margin: 20px 0; background: var(--gradient-primary); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">
                        {title}
                    </h1>
                    <p
                        style="font-size: 1.3rem; color: var(--text-muted); max-width: 800px; margin: 0 auto; line-height: 1.6;">
                        {intro}
                    </p>
                </header>

                <div class="grid grid-2" style="margin-bottom: 60px; gap: 30px;">
                    <div class="glass-card" style="padding: 35px;">
                        <h2>What is {title}?</h2>
                        <p>{concept}</p>

                        <h3 style="margin-top: 25px; color: var(--primary);">Key Characteristics:</h3>
                        <ul style="line-height: 1.8; padding-left: 20px; color: var(--text-muted); margin-top: 10px;">
                            {characteristics_html}
                        </ul>
                    </div>

                    <div class="glass-card" style="padding: 35px;">
                        <h2>Complexity Analysis</h2>
                        <div class="complexity-table" style="margin-top: 20px;">
                            <div class="complexity-row" style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                <span class="complexity-label" style="font-weight:700; color:var(--text-muted);">Avg Time Complexity:</span>
                                <span class="complexity-value" style="font-family:'Courier New', monospace; font-weight:bold; color:var(--primary);">{time_complexity}</span>
                            </div>
                            <div class="complexity-row" style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                <span class="complexity-label" style="font-weight:700; color:var(--text-muted);">Space Complexity:</span>
                                <span class="complexity-value" style="font-family:'Courier New', monospace; font-weight:bold; color:var(--accent);">{space_complexity}</span>
                            </div>
                            <div class="complexity-row" style="display:flex; justify-content:space-between; padding: 12px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
                                <span class="complexity-label" style="font-weight:700; color:var(--text-muted);">Best Case:</span>
                                <span class="complexity-value" style="font-family:'Courier New', monospace; font-weight:bold; color:#4ade80;">{best_case}</span>
                            </div>
                            <div class="complexity-row" style="display:flex; justify-content:space-between; padding: 12px 0;">
                                <span class="complexity-label" style="font-weight:700; color:var(--text-muted);">Worst Case:</span>
                                <span class="complexity-value" style="font-family:'Courier New', monospace; font-weight:bold; color:#f87171;">{worst_case}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-card" style="margin-bottom: 60px; padding: 35px;">
                    <h2>How it Works Step-by-Step</h2>
                    <ol style="margin: 20px 0; padding-left: 20px; line-height: 2.0; color: var(--text-muted);">
                        {steps_html}
                    </ol>
                </div>

                {code_block_html}

                <div class="glass-card" style="padding: 35px; margin-bottom: 60px;">
                    <h2>Worked Trace Example</h2>
                    <p style="color: var(--text-muted); line-height: 1.8; margin-top: 10px;">
                        {example}
                    </p>
                </div>

                <div class="glass-card" style="padding: 50px; text-align: center; margin-top: 40px;">
                    <h2 style="margin-bottom: 20px;">Ready to Understand {title} Visually?</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px;">
                        Don't just read about it. Launch our interactive, premium algorithm visualizer to step through calculations in real-time.
                    </p>
                    <a href="../visualizers/algorithms/{visualizer_path}.html" class="btn btn-primary"
                        style="font-size: 1.2rem; padding: 15px 30px; display: inline-block;">
                        Launch {title} Visualizer &rarr;
                    </a>
                </div>
            </article>
        </div>
    </main>

    <footer style="margin-top:60px;">
        <div class="container" style="text-align:center; padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.08);">
            <p>© 2025 by Meelo 💙</p>
        </div>
    </footer>

    <script src="../assets/js/brain-animation.js"></script>
</body>
</html>
"""

replacement_template = """<div class="glass-card" style="margin-bottom: 60px; padding: 35px;">
                    <h2>Code Implementation</h2>
                    
                    <style>
                        .code-tabs-container {{
                            display: flex;
                            gap: 12px;
                            margin-bottom: 20px;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                            padding-bottom: 12px;
                        }}
                        .code-tab-btn {{
                            background: transparent;
                            border: none;
                            color: var(--text-muted);
                            font-size: 0.95rem;
                            font-weight: 600;
                            padding: 8px 16px;
                            cursor: pointer;
                            border-radius: 8px;
                            transition: all 0.3s ease;
                            border: 1px solid transparent;
                        }}
                        .code-tab-btn:hover {{
                            color: var(--text);
                            background: rgba(255, 255, 255, 0.05);
                        }}
                        .code-tab-btn.active {{
                            color: #fff;
                            background: var(--gradient-primary);
                            box-shadow: var(--glow-primary);
                            border: 1px solid rgba(255, 255, 255, 0.15);
                        }}
                        .code-viewer-container {{
                            position: relative;
                        }}
                        .copy-code-btn {{
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            color: var(--text-muted);
                            padding: 6px 12px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 0.8rem;
                            font-weight: 600;
                            transition: all 0.2s ease;
                            z-index: 10;
                        }}
                        .copy-code-btn:hover {{
                            background: rgba(255, 255, 255, 0.15);
                            color: var(--text);
                            border-color: rgba(255, 255, 255, 0.2);
                        }}
                    </style>

                    <div class="code-tabs-container">
                        <button class="code-tab-btn active" onclick="switchGuideLang(this, 'python')">Python</button>
                        <button class="code-tab-btn" onclick="switchGuideLang(this, 'java')">Java</button>
                        <button class="code-tab-btn" onclick="switchGuideLang(this, 'cpp')">C++</button>
                        <button class="code-tab-btn" onclick="switchGuideLang(this, 'c')">C</button>
                    </div>

                    <div class="code-viewer-container">
                        <button class="copy-code-btn" onclick="copyCode()">
                            <i class="far fa-copy" style="margin-right: 5px;"></i>Copy
                        </button>
                        <div class="code-card">
                            <div class="code-viewer" style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                                <pre><code id="guide-code-block" class="language-python" style="font-family:'JetBrains Mono', monospace; font-size:0.9rem; color:#e2e8f0; line-height:1.5; white-space: pre-wrap;"></code></pre>
                            </div>
                        </div>
                    </div>

                    <script>
                        const codeTemplates = {{
                            python: `{python_code}`,
                            java: `{java_code}`,
                            cpp: `{cpp_code}`,
                            c: `{c_code}`
                        }};

                        function switchGuideLang(button, lang) {{
                            // Update active tab button style
                            const container = button.parentElement;
                            container.querySelectorAll('.code-tab-btn').forEach(btn => btn.classList.remove('active'));
                            button.classList.add('active');

                            // Update code content
                            const codeBlock = document.getElementById('guide-code-block');
                            codeBlock.textContent = codeTemplates[lang];
                            
                            // Update syntax highlighting class
                            codeBlock.className = 'language-' + (lang === 'cpp' ? 'cpp' : lang);
                        }}

                        function copyCode() {{
                            const codeBlock = document.getElementById('guide-code-block');
                            navigator.clipboard.writeText(codeBlock.textContent).then(() => {{
                                const btn = document.querySelector('.copy-code-btn');
                                btn.innerHTML = '<i class="fas fa-check" style="margin-right: 5px;"></i>Copied!';
                                setTimeout(() => {{
                                    btn.innerHTML = '<i class="far fa-copy" style="margin-right: 5px;"></i>Copy';
                                }}, 2000);
                            }});
                        }}

                        // Initialize with default language (Python)
                        document.addEventListener('DOMContentLoaded', () => {{
                            const firstTab = document.querySelector('.code-tab-btn');
                            if (firstTab) switchGuideLang(firstTab, 'python');
                        }});
                    </script>
                </div>"""

def escape_js_backticks(text):
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

os.makedirs(guides_dir, exist_ok=True)

for key, data in algo_guides_data.items():
    char_list = "".join([f"<li>{c}</li>" for c in data["characteristics"]])
    steps_list = "".join([f"<li>{s}</li>" for s in data["steps"]])
    
    # Escape codes for JS template literals
    py_esc = escape_js_backticks(data["python"])
    java_esc = escape_js_backticks(data["java"])
    cpp_esc = escape_js_backticks(data["cpp"])
    c_esc = escape_js_backticks(data["c"])
    
    code_block_html = replacement_template.format(
        python_code=py_esc,
        java_code=java_esc,
        cpp_code=cpp_esc,
        c_code=c_esc
    )
    
    file_content = html_template.format(
        title=data["title"],
        tag=data["tag"],
        intro=data["intro"],
        concept=data["concept"],
        concept_excerpt=data["concept"][:150] + "...",
        characteristics_html=char_list,
        time_complexity=data["time_complexity"],
        space_complexity=data["space_complexity"],
        best_case=data["best_case"],
        worst_case=data["worst_case"],
        steps_html=steps_list,
        code_block_html=code_block_html,
        example=data["example"],
        visualizer_path=data["visualizer_path"]
    )
    
    filepath = os.path.join(guides_dir, f"{key}.html")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(file_content)
    print(f"Generated Algorithm guide: {filepath}")

print("All 14 Algorithm guides generated successfully!")

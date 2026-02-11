// DFS Content Extension
window.AlgoContentSystem.prototype.addDFSContent = function() {
    this.content.set('dfs', {
        title: 'Depth-First Search (DFS)',
        definition: 'DFS explores graph vertices by going as deep as possible before backtracking, using a stack (or recursion).',
        usage: 'Topological sorting, cycle detection, pathfinding, maze solving, connected components.',
        complexity: {
            time: 'O(V + E)',
            space: 'O(V)',
            stable: 'N/A',
            inPlace: 'No'
        },
        proscons: {
            pros: ['Memory efficient for deep graphs', 'Simple recursive implementation', 'Good for detecting cycles'],
            cons: ['May not find shortest path', 'Can get stuck in infinite paths', 'Stack overflow risk in deep recursion']
        },
        code: {
            python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start, end=' ')
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited`,
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
};

// Auto-add DFS content
document.addEventListener('DOMContentLoaded', () => {
    if (window.AlgoContentSystem) {
        const contentSystem = new AlgoContentSystem();
        contentSystem.addDFSContent();
    }
});
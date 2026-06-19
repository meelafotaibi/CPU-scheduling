/**
 * bellman-ford.js - Bellman-Ford algorithm implementation using the shared engine.
 */
class BellmanFordAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateTable

        this.distances = {};
        this.predecessors = {};
        this.startNode = null;
        this.iteration = 1;
        this.edgeIndex = 0;
        this.complete = false;
        this.negativeCycle = false;
    }

    reset() {
        this.distances = {};
        this.predecessors = {};
        this.iteration = 1;
        this.edgeIndex = 0;
        this.complete = false;
        this.negativeCycle = false;

        this.engine.nodes.forEach(n => {
            n.status = 'default';
            this.distances[n.id] = Infinity;
        });

        if (this.engine.nodes.length > 0) {
            this.startNode = this.engine.nodes[0].id;
        }

        this.engine.draw();
        this.ui.updateTable(this.distances);
        this.ui.updateStatus("Ready for Bellman-Ford. Relaxing edges (N-1) times.");
    }

    async nextStep() {
        if (this.complete) return false;

        const numNodes = this.engine.nodes.length;
        const edges = this.engine.edges;

        if (this.iteration === 1 && this.edgeIndex === 0) {
            this.distances[this.startNode] = 0;
            this.engine.updateNodeStatus(this.startNode, 'current');
            this.ui.updateStatus(`Starting Bellman-Ford from Node ${this.startNode}. Discovered distance 0.`);
            this.ui.updateTable(this.distances);
            this.edgeIndex = -1; // Trigger first real relaxation on next step
            return true;
        }

        if (this.edgeIndex === -1) this.edgeIndex = 0;

        if (this.iteration < numNodes) {
            // Relax all edges
            const [u, v, weight] = edges[this.edgeIndex];
            this.ui.updateStatus(`Iteration ${this.iteration}/${numNodes - 1}: Relaxing edge ${u} → ${v} (w=${weight})`);

            // Reset all node statuses before highlighting
            this.engine.nodes.forEach(n => { if (n.status !== 'visited') n.status = 'default'; });

            this.engine.updateNodeStatus(u, 'current');
            this.engine.updateNodeStatus(v, 'queued');

            if (this.distances[u] !== Infinity && this.distances[u] + weight < this.distances[v]) {
                this.distances[v] = this.distances[u] + weight;
                this.predecessors[v] = u;
                this.ui.updateStatus(`Updated distance to Node ${v}: ${this.distances[v]}`);
                this.ui.updateTable(this.distances);
            }

            this.edgeIndex++;
            if (this.edgeIndex >= edges.length) {
                this.edgeIndex = 0;
                this.iteration++;
                if (this.iteration >= numNodes) {
                    this.ui.updateStatus("N-1 iterations complete. Final check for negative cycles...");
                }
            }
            return true;
        } else {
            // Check for negative cycles
            if (this.edgeIndex < edges.length) {
                const [u, v, weight] = edges[this.edgeIndex];
                if (this.distances[u] !== Infinity && this.distances[u] + weight < this.distances[v]) {
                    this.negativeCycle = true;
                    this.complete = true;
                    this.ui.updateStatus("ALARM: Negative cycle detected! Algorithm cannot find shortest path.");
                    return false;
                }
                this.edgeIndex++;
                return true;
            } else {
                this.complete = true;
                this.ui.updateStatus("Shortest Paths Discovered! No negative cycles found.");
                return false;
            }
        }
    }
}

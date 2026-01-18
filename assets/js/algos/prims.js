/**
 * prims.js - Prim's Algorithm for MST.
 */
class PrimsAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback; // playback instance
        this.ui = ui; // { updateStatus, updateStats, updateTable }

        this.visited = new Set();
        this.pq = []; // { weight, from, to }
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
        this.currentEdge = null;
    }

    reset() {
        this.visited = new Set();
        this.pq = [];
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
        this.engine.clearHighlights();
        this.ui.updateStats(0);
        this.ui.updateStatus("Select a starting node to begin Prim's Algorithm.");
    }

    start(startNodeId) {
        this.reset();
        this.visit(startNodeId);
        this.ui.updateStatus(`Starting Prim's from node ${startNodeId}`);
    }

    visit(nodeId) {
        this.visited.add(nodeId);
        this.engine.highlight(nodeId, 'visit');

        // Add all outgoing edges to PQ
        this.engine.edges.forEach(edge => {
            if (edge.from === nodeId && !this.visited.has(edge.to)) {
                this.pq.push(edge);
            } else if (edge.to === nodeId && !this.visited.has(edge.from)) {
                // For MST we usually assume undirected, so handle both
                this.pq.push({ from: edge.to, to: edge.from, weight: edge.weight, id: edge.id });
            }
        });

        // Sort PQ by weight
        this.pq.sort((a, b) => a.weight - b.weight);
    }

    async nextStep() {
        if (this.complete || this.pq.length === 0) {
            if (this.visited.size < this.engine.nodes.size && this.pq.length === 0) {
                this.ui.updateStatus("Graph is disconnected. MST complete for current component.");
            } else {
                this.ui.updateStatus(`MST Complete! Total Weight: ${this.totalWeight}`);
            }
            this.complete = true;
            return false;
        }

        // Pick the smallest edge
        const edge = this.pq.shift();

        if (this.visited.has(edge.to)) {
            this.ui.updateStatus(`Skipping edge (${edge.from}-${edge.to}) as node ${edge.to} is already visited.`);
            return true; // Try next step immediately
        }

        this.currentEdge = edge;
        this.engine.highlight(edge.id, 'path');
        this.mstEdges.push(edge);
        this.totalWeight += edge.weight;
        this.ui.updateStats(this.totalWeight);
        this.ui.updateStatus(`Adding edge (${edge.from}-${edge.to}) with weight ${edge.weight}.`);

        this.visit(edge.to);
        return true;
    }
}

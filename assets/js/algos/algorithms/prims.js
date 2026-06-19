/**
 * prims.js - Prim's Algorithm for MST.
 * Works with GraphEngine where edges are arrays: [u, v, weight]
 * and nodes is an Array of {id, x, y, status}
 */
class PrimsAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // { updateStatus, updateStats }

        this.visited = new Set();
        this.pq = []; // { weight, from, to }
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
    }

    reset() {
        this.visited = new Set();
        this.pq = [];
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
        // Reset node colors
        this.engine.nodes.forEach(n => n.status = 'default');
        this.engine.draw();
        this.ui.updateStats(0);
        this.ui.updateStatus("Click Run to start Prim's Algorithm.");
    }

    start(startNodeId) {
        this.reset();
        this.visitNode(startNodeId);
        this.ui.updateStatus(`Starting Prim's from Node ${startNodeId}. Added to MST.`);
    }

    visitNode(nodeId) {
        this.visited.add(nodeId);
        this.engine.updateNodeStatus(nodeId, 'visited');

        // Add all edges adjacent to this node to PQ
        // Engine edges are arrays: [u, v, weight]
        this.engine.edges.forEach(([u, v, w]) => {
            const weight = w || 1;
            if (u === nodeId && !this.visited.has(v)) {
                this.pq.push({ from: u, to: v, weight });
            } else if (v === nodeId && !this.visited.has(u)) {
                // Undirected: consider reverse direction too
                this.pq.push({ from: v, to: u, weight });
            }
        });

        // Sort PQ by weight ascending
        this.pq.sort((a, b) => a.weight - b.weight);
    }

    async nextStep() {
        if (this.complete) return false;

        // Remove stale edges (to already-visited nodes)
        while (this.pq.length > 0 && this.visited.has(this.pq[0].to)) {
            const skipped = this.pq.shift();
            this.ui.updateStatus(`Skipping edge (${skipped.from}→${skipped.to}) — already visited.`);
        }

        if (this.pq.length === 0) {
            this.complete = true;
            if (this.visited.size < this.engine.nodes.length) {
                this.ui.updateStatus(`Graph is disconnected. MST complete for current component. Weight: ${this.totalWeight}`);
            } else {
                this.ui.updateStatus(`🎉 MST Complete! Total Weight: ${this.totalWeight}`);
            }
            return false;
        }

        const edge = this.pq.shift();

        if (this.visited.has(edge.to)) {
            this.ui.updateStatus(`Skipping edge (${edge.from}→${edge.to}) — already visited.`);
            return true;
        }

        this.mstEdges.push(edge);
        this.totalWeight += edge.weight;
        this.ui.updateStats(this.totalWeight);
        this.ui.updateStatus(`✅ Adding edge (${edge.from}→${edge.to}), weight=${edge.weight}. MST weight: ${this.totalWeight}`);

        // Highlight the newly added edge destination
        this.engine.updateNodeStatus(edge.from, 'current');
        setTimeout(() => {
            this.engine.updateNodeStatus(edge.from, 'visited');
        }, 300);

        this.visitNode(edge.to);

        // Check if MST complete
        if (this.visited.size >= this.engine.nodes.length) {
            this.complete = true;
            this.ui.updateStatus(`🎉 MST Complete! Total Weight: ${this.totalWeight}`);
            return false;
        }

        return true;
    }
}

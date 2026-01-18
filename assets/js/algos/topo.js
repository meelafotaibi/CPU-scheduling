/**
 * topo.js - Kahn's Algorithm for Topological Sorting.
 */
class TopoAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateList, updateInDegree

        this.inDegree = {};
        this.queue = [];
        this.result = [];
        this.complete = false;
        this.started = false;
    }

    reset() {
        this.inDegree = {};
        this.queue = [];
        this.result = [];
        this.complete = false;
        this.started = false;

        // Kahn's needs directed graph
        this.engine.directed = true;

        this.engine.nodes.forEach(n => {
            n.status = 'default';
            this.inDegree[n.id] = 0;
        });

        this.engine.edges.forEach(([u, v]) => {
            if (this.inDegree[v] !== undefined) this.inDegree[v]++;
        });

        this.engine.draw();
        this.ui.updateInDegree(this.inDegree);
        this.ui.updateList(this.result);
        this.ui.updateStatus("Ready for Topological Sort (Kahn's Algorithm).");
    }

    async nextStep() {
        if (this.complete) return false;

        if (!this.started) {
            // Find nodes with in-degree 0
            Object.keys(this.inDegree).forEach(id => {
                if (this.inDegree[id] === 0) {
                    this.queue.push(parseInt(id));
                    this.engine.updateNodeStatus(parseInt(id), 'queued');
                }
            });
            this.started = true;
            this.ui.updateStatus("Finding all nodes with In-Degree 0: [" + this.queue.join(', ') + "]");
            return true;
        }

        if (this.queue.length === 0) {
            this.complete = true;
            if (this.result.length < this.engine.nodes.length) {
                this.ui.updateStatus("Cycle detected! Topological sort only works on DAGs (Direct Acyclic Graphs).");
            } else {
                this.ui.updateStatus("Topological Sort Complete!");
            }
            return false;
        }

        const uId = this.queue.shift();
        this.result.push(uId);
        this.engine.updateNodeStatus(uId, 'visited');
        this.ui.updateList(this.result);
        this.ui.updateStatus("Processing Node " + uId + ". Reducing in-degree of neighbors.");

        const neighbors = this.engine.getNeighbors(uId);
        for (const neighbor of neighbors) {
            this.inDegree[neighbor.id]--;
            this.ui.updateInDegree(this.inDegree);

            if (this.inDegree[neighbor.id] === 0) {
                this.queue.push(neighbor.id);
                this.engine.updateNodeStatus(neighbor.id, 'queued');
            }
            await new Promise(r => setTimeout(r, 300));
        }

        return true;
    }
}

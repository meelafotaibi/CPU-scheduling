/**
 * kruskal.js - Kruskal's Algorithm for MST using Union-Find.
 * Works with GraphEngine where edges are arrays: [u, v, weight]
 */
class KruskalAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;

        this.sortedEdges = []; // Sorted copies of edges [u, v, w]
        this.edgeIndex = 0;
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;

        // Union-Find Data Structure
        this.parent = {};
        this.rank = {};
    }

    reset() {
        this.sortedEdges = [];
        this.edgeIndex = 0;
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
        this.parent = {};
        this.rank = {};

        // Reset node colors
        this.engine.nodes.forEach(n => n.status = 'default');
        this.engine.draw();
        this.ui.updateStats(0);
        this.ui.updateStatus("Click Run to start Kruskal's Algorithm.");
    }

    start() {
        this.reset();

        // Initialize Union-Find for each node
        this.engine.nodes.forEach(n => {
            this.parent[n.id] = n.id;
            this.rank[n.id] = 0;
        });

        // Make a sorted copy of edges (engine edges are [u, v, w])
        this.sortedEdges = this.engine.edges.map(e => [...e]);
        this.sortedEdges.sort((a, b) => (a[2] || 0) - (b[2] || 0));
        this.edgeIndex = 0;

        this.ui.updateStatus(`Sorted ${this.sortedEdges.length} edges by weight. Starting selection...`);
    }

    // --- Union Find Helpers ---
    find(id) {
        if (this.parent[id] !== id) {
            this.parent[id] = this.find(this.parent[id]); // Path compression
        }
        return this.parent[id];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            return true;
        }
        return false;
    }

    async nextStep() {
        if (this.complete) return false;

        if (this.edgeIndex >= this.sortedEdges.length) {
            this.complete = true;
            this.ui.updateStatus(`Kruskal's Complete! MST Weight: ${this.totalWeight}`);
            return false;
        }

        const [u, v, w] = this.sortedEdges[this.edgeIndex];
        this.edgeIndex++;

        const root1 = this.find(u);
        const root2 = this.find(v);

        if (root1 !== root2) {
            this.union(u, v);
            this.mstEdges.push([u, v, w]);
            this.totalWeight += (w || 0);

            // Highlight accepted nodes
            this.engine.updateNodeStatus(u, 'visited');
            this.engine.updateNodeStatus(v, 'visited');

            this.ui.updateStats(this.totalWeight);
            this.ui.updateStatus(`<i class="fas fa-check-circle" style="color: var(--success);"></i> Accepted edge (${u}→${v}), weight=${w}. MST weight: ${this.totalWeight}`);
        } else {
            // Cycle detected - highlight in current color momentarily
            this.engine.updateNodeStatus(u, 'current');
            this.engine.updateNodeStatus(v, 'current');
            setTimeout(() => {
                this.engine.updateNodeStatus(u, 'default');
                this.engine.updateNodeStatus(v, 'default');
            }, 400);
            this.ui.updateStatus(`<i class="fas fa-times-circle" style="color: var(--danger);"></i> Skipped edge (${u}→${v}) — would create cycle.`);
        }

        // Check if MST is complete (V-1 edges)
        if (this.mstEdges.length >= this.engine.nodes.length - 1) {
            this.complete = true;
            this.ui.updateStatus(`<i class="fas fa-award" style="color: var(--accent);"></i> MST Complete! Total Weight: ${this.totalWeight}`);
            return false;
        }

        return true;
    }
}

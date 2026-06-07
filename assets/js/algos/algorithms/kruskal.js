/**
 * kruskal.js - Kruskal's Algorithm for MST using Union-Find.
 */
class KruskalAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;

        this.edges = []; // Sorted edges
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;

        // Union-Find Data Structure
        this.parent = {};
        this.rank = {};
    }

    reset() {
        this.edges = [];
        this.mstEdges = [];
        this.totalWeight = 0;
        this.complete = false;
        this.parent = {};
        this.rank = {};

        this.engine.clearHighlights();
        this.ui.updateStats(0);
        this.ui.updateStatus("Click Run to start Kruskal's Algorithm.");
    }

    start() {
        this.reset();

        // 1. Collect all edges
        // Note: GraphEngine edges are directed objects if directed=true. 
        // For MST we usually treat as undirected. Duplicate edges (u->v, v->u) might exist.
        // We need to filter unique undirected edges or handle duplicates.
        // Simple approach: Use a set of sorted ID pairs to dedup.

        const uniqueEdges = new Map();

        this.engine.edges.forEach(e => {
            // Create a unique key for undirected edge
            const key = [e.from, e.to].sort().join('-');
            if (!uniqueEdges.has(key)) {
                uniqueEdges.set(key, e);
            } else {
                // If exists, keep smaller weight? Or just assume consistent.
                if (e.weight < uniqueEdges.get(key).weight) {
                    uniqueEdges.set(key, e);
                }
            }
        });

        this.edges = Array.from(uniqueEdges.values());

        // 2. Sort by weight
        this.edges.sort((a, b) => a.weight - b.weight);

        // 3. Initialize Disjoint Set for all nodes
        this.engine.nodes.forEach((_, id) => {
            this.makeSet(id);
        });

        this.ui.updateStatus(`Sorted ${this.edges.length} unique edges. Starting selection...`);
    }

    // --- Union Find Helpers ---
    makeSet(id) {
        this.parent[id] = id;
        this.rank[id] = 0;
    }

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
            // Union by rank
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

        // If we have V-1 edges, we strictly are done for a connected graph.
        // But let's just run until edge list empty to be safe for disconnected graphs.
        if (this.edges.length === 0) {
            this.complete = true;
            this.ui.updateStatus(`Kruskal's Complete! Total Weight: ${this.totalWeight}`);
            return false;
        }

        // Pick smallest edge
        const edge = this.edges.shift();

        // Highlight assumed 'processing' state (maybe yellow/orange?)
        // this.engine.highlight(edge.id, 'check'); // If engine supports 'check'

        const root1 = this.find(edge.from);
        const root2 = this.find(edge.to);

        if (root1 !== root2) {
            this.union(edge.from, edge.to);
            this.mstEdges.push(edge);
            this.totalWeight += edge.weight;

            // Visualize
            this.engine.highlight(edge.id, 'path'); // Green/Final
            this.engine.highlight(edge.from, 'visit');
            this.engine.highlight(edge.to, 'visit');

            this.ui.updateStats(this.totalWeight);
            this.ui.updateStatus(`Accepted edge (${edge.from}-${edge.to}). Weight: ${edge.weight}`);
        } else {
            // Cycle detected
            this.ui.updateStatus(`Skipped edge (${edge.from}-${edge.to}) (Cycle detected).`);
            // Optional: flash red?
        }

        return true;
    }
}

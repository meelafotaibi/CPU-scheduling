/**
 * dijkstra.js - Dijkstra's Shortest Path implementation using the shared engine.
 */
class DijkstraAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // Object with updateStatus, updateTable

        this.distances = {};
        this.visited = new Set();
        this.pq = []; // Simple priority queue (array sorted by distance)
        this.complete = false;
        this.started = false;
    }

    reset() {
        this.distances = {};
        this.visited = new Set();
        this.pq = [];
        this.complete = false;
        this.started = false;

        this.engine.nodes.forEach(n => {
            n.status = 'default';
            this.distances[n.id] = Infinity;
        });

        this.engine.draw();
        this.ui.updateTable(this.distances, this.visited);
        this.ui.updatePQ(this.pq);
        this.ui.updateStatus("Ready to find shortest paths with Dijkstra.");
    }

    async nextStep() {
        if (this.complete) return false;

        if (!this.started) {
            const startNode = this.engine.nodes[0].id;
            this.distances[startNode] = 0;
            this.pq = [{ id: startNode, dist: 0 }];
            this.started = true;
            this.ui.updateStatus(`Starting Dijkstra from Node ${startNode}. Distance set to 0.`);
            this.engine.updateNodeStatus(startNode, 'queued');
            this.ui.updateTable(this.distances, this.visited);
            this.ui.updatePQ(this.pq);
            return true;
        }

        if (this.pq.length === 0) {
            this.complete = true;
            this.ui.updateStatus("Dijkstra Complete! All shortest paths found.");
            return false;
        }

        // Extract min
        this.pq.sort((a, b) => a.dist - b.dist);
        this.ui.updatePQ(this.pq);
        const { id: currentId, dist: currentDist } = this.pq.shift();
        this.ui.updatePQ(this.pq);

        if (this.visited.has(currentId)) {
            this.ui.updateStatus(`Node ${currentId} already finalized, skipping.`);
            return true;
        }

        // Visit Node
        this.visited.add(currentId);
        this.engine.updateNodeStatus(currentId, 'current');
        this.ui.updateStatus(`Finalizing Node ${currentId} with distance ${currentDist}.`);
        this.ui.updateTable(this.distances, this.visited);

        // Relax neighbors
        const neighbors = this.engine.getNeighbors(currentId);
        for (const neighbor of neighbors) {
            if (this.visited.has(neighbor.id)) continue;

            const newDist = currentDist + neighbor.weight;
            if (newDist < this.distances[neighbor.id]) {
                const oldDist = this.distances[neighbor.id];
                this.distances[neighbor.id] = newDist;
                this.pq.push({ id: neighbor.id, dist: newDist });
                this.engine.updateNodeStatus(neighbor.id, 'queued');
                this.ui.updateStatus(`Relaxing Node ${neighbor.id}: ${oldDist} -> ${newDist} (via Node ${currentId})`);
                this.ui.updateTable(this.distances, this.visited);
                this.ui.updatePQ(this.pq);
                // Mini pause for visualization
                await new Promise(r => setTimeout(r, 300));
            }
        }

        setTimeout(() => {
            this.engine.updateNodeStatus(currentId, 'visited');
        }, 300);

        return true;
    }
}

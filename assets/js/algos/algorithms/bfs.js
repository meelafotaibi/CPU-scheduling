/**
 * bfs.js - Breadth-First Search implementation using the shared engine.
 */
class BFSAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // Object with updateStatus, updateQueue methods

        this.queue = [];
        this.visited = new Set();
        this.complete = false;
        this.started = false;
    }

    reset() {
        this.queue = [];
        this.visited = new Set();
        this.complete = false;
        this.started = false;
        this.engine.nodes.forEach(n => n.status = 'default');
        this.engine.draw();
        this.ui.updateQueue([]);
        this.ui.updateStatus("Ready to start BFS.");
    }

    async nextStep() {
        if (this.complete) return false;

        if (!this.started) {
            const startNode = this.engine.nodes[0].id; // Standard start from first node
            this.queue = [startNode];
            this.started = true;
            this.ui.updateStatus(`Starting BFS from Node ${startNode}. Adding to Queue.`);
            this.engine.updateNodeStatus(startNode, 'queued');
            this.ui.updateQueue(this.queue);
            return true;
        }

        if (this.queue.length === 0) {
            this.complete = true;
            this.ui.updateStatus("BFS Traversal Complete!");
            return false;
        }

        const currentId = this.queue.shift();
        this.ui.updateQueue(this.queue);

        if (this.visited.has(currentId)) {
            this.ui.updateStatus(`Node ${currentId} already visited, skipping.`);
            return true;
        }

        // Visit Node
        this.visited.add(currentId);
        this.engine.updateNodeStatus(currentId, 'current');
        this.ui.updateStatus(`Visiting Node ${currentId}. Checking neighbors...`);

        // Find neighbors
        const neighbors = this.engine.getNeighbors(currentId)
            .filter(n => !this.visited.has(n.id) && !this.queue.includes(n.id))
            .map(n => n.id);

        // Finalize node color after processing
        setTimeout(() => {
            this.engine.updateNodeStatus(currentId, 'visited');
        }, 300);

        if (neighbors.length > 0) {
            neighbors.forEach(n => {
                this.queue.push(n);
                this.engine.updateNodeStatus(n, 'queued');
            });
            this.ui.updateQueue(this.queue);
            this.ui.updateStatus(`Found Neighbors: ${neighbors.join(', ')}. Enqueuing layer by layer.`);
        } else {
            this.ui.updateStatus(`No unvisited neighbors for Node ${currentId}. Moving to next node in Queue.`);
        }

        return true;
    }
}

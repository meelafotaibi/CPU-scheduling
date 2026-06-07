/**
 * dfs.js - Depth-First Search implementation using the shared engine.
 */
class DFSAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // Object with updateStatus, updateStack methods

        this.stack = [];
        this.visited = new Set();
        this.complete = false;
        this.started = false;
    }

    reset() {
        this.stack = [];
        this.visited = new Set();
        this.complete = false;
        this.started = false;
        this.engine.nodes.forEach(n => n.status = 'default');
        this.engine.draw();
        this.ui.updateStack([]);
        this.ui.updateStatus("Ready to start DFS.");
    }

    async nextStep() {
        if (this.complete) return false;

        if (!this.started) {
            const startNode = this.engine.nodes[0].id;
            this.stack = [startNode];
            this.started = true;
            this.ui.updateStatus(`Starting DFS from Node ${startNode}.`);
            this.engine.updateNodeStatus(startNode, 'queued');
            this.ui.updateStack(this.stack);
            return true;
        }

        if (this.stack.length === 0) {
            this.complete = true;
            this.ui.updateStatus("DFS Traversal Complete!");
            return false;
        }

        const currentId = this.stack.pop();
        this.ui.updateStack(this.stack);

        if (this.visited.has(currentId)) {
            this.ui.updateStatus(`Node ${currentId} already visited, skipping.`);
            return true;
        }

        // Visit Node
        this.visited.add(currentId);
        this.engine.updateNodeStatus(currentId, 'current');
        this.ui.updateStatus(`Visiting Node ${currentId}. Exploring neighbors...`);

        // Find neighbors and add to stack in reverse for standard DFS order
        const neighbors = this.engine.getNeighbors(currentId)
            .filter(n => !this.visited.has(n.id))
            .map(n => n.id);

        // Mark current as visited after a short delay or in next step
        setTimeout(() => {
            this.engine.updateNodeStatus(currentId, 'visited');
        }, 300);

        if (neighbors.length > 0) {
            neighbors.reverse().forEach(n => {
                if (!this.stack.includes(n)) {
                    this.stack.push(n);
                    this.engine.updateNodeStatus(n, 'queued');
                }
            });
            this.ui.updateStack(this.stack);
            this.ui.updateStatus(`Found neighbors: ${neighbors.reverse().join(', ')}. Pushing to Stack.`);
        } else {
            this.ui.updateStatus(`No unvisited neighbors for Node ${currentId}. Backtracking...`);
        }

        return true;
    }
}

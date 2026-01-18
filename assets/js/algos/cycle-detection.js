/**
 * cycle-detection.js - DFS-based cycle detection for Directed Graphs.
 */
class CycleDetectionAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;

        this.visited = new Set();
        this.recStack = new Set();
        this.complete = false;
        this.foundCycle = false;
        this.stack = []; // For iterative visualization
    }

    reset() {
        this.visited.clear();
        this.recStack.clear();
        this.complete = false;
        this.foundCycle = false;
        this.stack = [];
        this.engine.nodes.forEach(n => n.status = 'default');
        this.engine.draw();
        this.ui.updateStatus("Ready for Cycle Detection. Running DFS with recursion stack check.");
    }

    async nextStep() {
        if (this.complete) return false;

        // If stack is empty, find the next unvisited node to start DFS
        if (this.stack.length === 0) {
            const startNode = this.engine.nodes.find(n => !this.visited.has(n.id));
            if (!startNode) {
                this.complete = true;
                this.ui.updateStatus("DFS exploration finished. No cycles found.");
                return false;
            }
            this.stack.push({ id: startNode.id, neighborIdx: 0 });
            this.visited.add(startNode.id);
            this.recStack.add(startNode.id);
            this.engine.updateNodeStatus(startNode.id, 'current');
            this.ui.updateStatus(`Starting DFS from Node ${startNode.id}. Adding to recursion stack.`);
            return true;
        }

        const current = this.stack[this.stack.length - 1];
        const neighbors = this.engine.getNeighbors(current.id);

        if (current.neighborIdx < neighbors.length) {
            const neighborId = neighbors[current.neighborIdx].id;
            current.neighborIdx++;

            if (this.recStack.has(neighborId)) {
                this.foundCycle = true;
                this.complete = true;
                this.engine.updateNodeStatus(neighborId, 'queued'); // Highlight cycle back-edge
                this.ui.updateStatus(`CYCLE DETECTED! Node ${neighborId} is already in the current recursion stack.`);
                return false;
            }

            if (!this.visited.has(neighborId)) {
                this.visited.add(neighborId);
                this.recStack.add(neighborId);
                this.stack.push({ id: neighborId, neighborIdx: 0 });
                this.engine.updateNodeStatus(neighborId, 'current');
                this.ui.updateStatus(`Moving to Node ${neighborId}. Adding to recursion stack.`);
                return true;
            } else {
                this.ui.updateStatus(`Node ${neighborId} already visited and not in recursion stack. Skipping.`);
                return true; // Stay on current node and try next neighbor
            }
        } else {
            // Finished exploring current node
            const finished = this.stack.pop();
            this.recStack.delete(finished.id);
            this.engine.updateNodeStatus(finished.id, 'visited');
            this.ui.updateStatus(`Finished Node ${finished.id}. Removing from recursion stack.`);
            return true;
        }
    }
}

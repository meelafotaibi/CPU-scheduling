/**
 * astar.js - A* Search implementation using the shared engine.
 */
class AStarAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateTable, updatePQ, setGoal

        this.gScore = {};
        this.fScore = {};
        this.prev = {};
        this.visited = new Set();
        this.openSet = []; // Array of {id, f}
        this.startNode = null;
        this.goalNode = null;
        this.complete = false;
        this.started = false;
    }

    reset() {
        this.gScore = {};
        this.fScore = {};
        this.prev = {};
        this.visited = new Set();
        this.openSet = [];
        this.complete = false;
        this.started = false;

        this.engine.nodes.forEach(n => {
            n.status = 'default';
            this.gScore[n.id] = Infinity;
            this.fScore[n.id] = Infinity;
        });

        // Default Goal is the last node
        if (this.engine.nodes.length > 0) {
            this.startNode = this.engine.nodes[0].id;
            this.goalNode = this.engine.nodes[this.engine.nodes.length - 1].id;
        }

        this.engine.draw();
        this.updateUI();
        this.ui.updateStatus("Ready for A*. Target: Node " + this.goalNode);
    }

    heuristic(nodeId) {
        const u = this.engine.nodes.find(n => n.id === nodeId);
        const v = this.engine.nodes.find(n => n.id === this.goalNode);
        if (!u || !v) return 0;
        return Math.sqrt(Math.pow(u.x - v.x, 2) + Math.pow(u.y - v.y, 2)) / 50; // Scaled for readability
    }

    updateUI() {
        const tableData = {};
        this.engine.nodes.forEach(n => {
            tableData[n.id] = {
                g: this.gScore[n.id],
                h: this.heuristic(n.id).toFixed(1),
                f: this.fScore[n.id] === Infinity ? '∞' : this.fScore[n.id].toFixed(1)
            };
        });
        this.ui.updateTable(tableData, this.visited, this.goalNode);
        this.ui.updatePQ(this.openSet);
    }

    async nextStep() {
        if (this.complete) return false;

        if (!this.started) {
            this.gScore[this.startNode] = 0;
            this.fScore[this.startNode] = this.heuristic(this.startNode);
            this.openSet = [{ id: this.startNode, f: this.fScore[this.startNode] }];
            this.started = true;
            this.engine.updateNodeStatus(this.startNode, 'queued');
            this.updateUI();
            this.ui.updateStatus(`Starting A* from ${this.startNode}. Goal is ${this.goalNode}.`);
            return true;
        }

        if (this.openSet.length === 0) {
            this.complete = true;
            this.ui.updateStatus("Search finished. No path found.");
            return false;
        }

        // Extract min F
        this.openSet.sort((a, b) => a.f - b.f);
        const current = this.openSet.shift();
        const currentId = current.id;

        if (currentId === this.goalNode) {
            this.complete = true;
            this.engine.updateNodeStatus(currentId, 'current');
            this.ui.updateStatus(`Goal Reached! Node ${currentId} found.`);
            this.reconstructPath();
            return false;
        }

        this.visited.add(currentId);
        this.engine.updateNodeStatus(currentId, 'current');
        this.ui.updateStatus(`Exploring Node ${currentId} (f=${current.f.toFixed(1)})`);
        this.updateUI();

        const neighbors = this.engine.getNeighbors(currentId);
        for (const neighbor of neighbors) {
            if (this.visited.has(neighbor.id)) continue;

            const tentativeG = this.gScore[currentId] + neighbor.weight;
            if (tentativeG < this.gScore[neighbor.id]) {
                this.prev[neighbor.id] = currentId;
                this.gScore[neighbor.id] = tentativeG;
                this.fScore[neighbor.id] = tentativeG + this.heuristic(neighbor.id);

                if (!this.openSet.find(o => o.id === neighbor.id)) {
                    this.openSet.push({ id: neighbor.id, f: this.fScore[neighbor.id] });
                    this.engine.updateNodeStatus(neighbor.id, 'queued');
                }

                this.ui.updateStatus(`Relaxing ${neighbor.id}: g=${tentativeG.toFixed(1)}, f=${this.fScore[neighbor.id].toFixed(1)}`);
                this.updateUI();
                await new Promise(r => setTimeout(r, 300));
            }
        }

        setTimeout(() => {
            if (currentId !== this.goalNode) this.engine.updateNodeStatus(currentId, 'visited');
        }, 300);

        return true;
    }

    reconstructPath() {
        let curr = this.goalNode;
        while (this.prev[curr]) {
            // Highlight path in engine (Status: visited or special color)
            this.engine.updateNodeStatus(curr, 'visited'); // Keep it green/teal
            curr = this.prev[curr];
        }
        this.engine.updateNodeStatus(this.startNode, 'current');
        this.engine.draw();
    }
}

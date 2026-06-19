/**
 * GraphEngine.js - Core rendering and data model for all graph-based visualizers.
 */
class GraphEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.directed = false;
        this.nodeRadius = 25;
        this.isRunning = false;
        this.showGrid = false;
        this.editMode = false;
        this.selectedNode = null;

        this.colors = {
            default: '#fff',
            current: '#ff6b6b',
            queued: '#667eea',
            visited: '#4BC0C0',
            stroke: '#333',
            edge: '#ddd',
            text: '#333',
            textActive: '#fff'
        };

        this.initResize();
        this.initInteractions();
    }

    initResize() {
        const resize = () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.draw();
        };
        window.addEventListener('resize', resize);
        resize();
    }

    initInteractions() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.editMode) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedNode = this.getNodeAt(x, y);
            if (clickedNode) {
                if (this.selectedNode && this.selectedNode !== clickedNode) {
                    const weight = prompt("Enter Edge Weight:", "1") || "1";
                    this.addEdge(this.selectedNode.id, clickedNode.id, parseInt(weight));
                    this.selectedNode = null;
                } else {
                    this.selectedNode = clickedNode;
                }
            } else {
                const id = this.nodes.length > 0 ? Math.max(...this.nodes.map(n => n.id)) + 1 : 1;
                this.nodes.push({ id, x, y, status: 'default' });
                this.selectedNode = null;
            }
            this.draw();
        });
    }

    setEditMode(enabled) {
        this.editMode = enabled;
        this.selectedNode = null;
        this.canvas.style.cursor = enabled ? 'crosshair' : 'default';
        this.draw();
    }

    getNodeAt(x, y) {
        return this.nodes.find(n => Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2) < this.nodeRadius);
    }

    addEdge(u, v, w) {
        const exists = this.edges.find(e => (e[0] === u && e[1] === v) || (!this.directed && e[0] === v && e[1] === u));
        if (exists) exists[2] = w;
        else this.edges.push([u, v, w]);
    }

    setGraph(nodes, edges) {
        this.nodes = nodes.map(n => ({ ...n, status: 'default' }));
        this.edges = edges;
        this.draw();
    }

    updateNodeStatus(id, status) {
        const node = this.nodes.find(n => n.id === id);
        if (node) node.status = status;
        this.draw();
    }

    draw() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        this.colors.text = isDark ? '#fff' : '#333';
        this.colors.stroke = isDark ? '#ccc' : '#333';
        this.colors.edge = isDark ? '#555' : '#ddd';
        this.colors.default = isDark ? '#2d2d44' : '#fff'; // Node background

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.showGrid) this.drawGrid(isDark);

        // Draw Edges
        this.edges.forEach(([u, v, weight]) => {
            const nodeU = this.nodes.find(n => n.id === u);
            const nodeV = this.nodes.find(n => n.id === v);
            if (nodeU && nodeV) {
                this.drawEdge(nodeU, nodeV, weight, isDark);
            }
        });

        // Draw Nodes
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);

            if (this.selectedNode === node) {
                this.ctx.fillStyle = '#fff3cd';
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = 'rgba(255, 193, 7, 0.5)';
            } else {
                this.ctx.fillStyle = this.colors[node.status] || this.colors.default;
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fill();
            this.ctx.strokeStyle = this.selectedNode === node ? '#ffc107' : this.colors.stroke;
            this.ctx.lineWidth = this.selectedNode === node ? 3 : 2;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // ID Label
            this.ctx.fillStyle = (node.status === 'default' && this.selectedNode !== node) ? this.colors.text : this.colors.textActive;
            if (this.selectedNode === node) this.ctx.fillStyle = '#856404';

            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(node.id, node.x, node.y);
        });
    }

    drawEdge(u, v, weight, isDark) {
        const angle = Math.atan2(v.y - u.y, v.x - u.x);

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.edge;
        this.ctx.lineWidth = 2;

        const startX = u.x + Math.cos(angle) * this.nodeRadius;
        const startY = u.y + Math.sin(angle) * this.nodeRadius;
        // Shorten line a bit so arrow doesn't overlap node
        const endX = v.x - Math.cos(angle) * (this.nodeRadius + 2);
        const endY = v.y - Math.sin(angle) * (this.nodeRadius + 2);

        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // Draw Arrow for directed
        if (this.directed) {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.colors.edge;
            const arrowSize = 10;
            this.ctx.moveTo(endX, endY);
            // Simple arrow head logic
            this.ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
            this.ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Draw Weight
        if (weight !== undefined) {
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            // Background for text visibility
            this.ctx.fillStyle = isDark ? '#2d2d44' : 'rgba(255,255,255,0.9)';
            const txt = weight.toString();
            this.ctx.font = 'bold 14px Arial';
            const tw = this.ctx.measureText(txt).width;
            this.ctx.fillRect(midX - tw / 2 - 4, midY - 10, tw + 8, 20);

            this.ctx.fillStyle = isDark ? '#ddd' : '#555';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(txt, midX, midY);
        }
    }

    drawGrid(isDark) {
        const size = 50;
        this.ctx.strokeStyle = isDark ? '#333' : '#f0f0f0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= this.canvas.width; x += size) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y <= this.canvas.height; y += size) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }

    scrambleNodes() {
        this.nodes.forEach(n => {
            n.x = this.nodeRadius * 2 + Math.random() * (this.canvas.width - this.nodeRadius * 4);
            n.y = this.nodeRadius * 2 + Math.random() * (this.canvas.height - this.nodeRadius * 4);
        });
        this.draw();
    }

    getNeighbors(id) {
        let neighbors = [];
        this.edges.forEach(([u, v, weight]) => {
            if (u === id) neighbors.push({ id: v, weight: weight || 1 });
            else if (!this.directed && v === id) neighbors.push({ id: u, weight: weight || 1 });
        });
        return neighbors;
    }

    // Utility: reset all node statuses to 'default' (compatible with ArrayEngine API callers)
    clearHighlights() {
        this.nodes.forEach(n => n.status = 'default');
        this.draw();
    }
}


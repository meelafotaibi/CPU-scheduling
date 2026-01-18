/**
 * recursion-engine.js - Specialized engine for visualizing recursive call trees.
 */
class RecursionEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = []; // { id, label, value, x, y, parentId, children: [] }
        this.nodeRadius = 25;
        this.levelHeight = 80;
        this.colors = {
            active: '#ffd700', // Yellow for current call
            done: '#28a745',   // Green for completed call
            pending: '#fff',   // White for future calls
            text: '#333',
            stroke: '#666'
        };

        this.initResize();
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

    reset() {
        this.nodes = [];
        this.draw();
    }

    addNode(label, value, parentId = null) {
        const id = this.nodes.length;
        const node = {
            id,
            label,
            value,
            parentId,
            status: 'active',
            children: [],
            x: 0,
            y: 0
        };

        if (parentId !== null) {
            this.nodes[parentId].children.push(id);
        }

        this.nodes.push(node);
        this.updateLayout();
        this.draw();
        return id;
    }

    updateNodeStatus(id, status) {
        if (this.nodes[id]) {
            this.nodes[id].status = status;
            this.draw();
        }
    }

    updateLayout() {
        if (this.nodes.length === 0) return;

        // Simple hierarchical layout
        const root = this.nodes[0];
        const layoutNode = (nodeId, level, leftBound, rightBound) => {
            const node = this.nodes[nodeId];
            node.y = 50 + level * this.levelHeight;
            node.x = (leftBound + rightBound) / 2;

            if (node.children.length > 0) {
                const step = (rightBound - leftBound) / node.children.length;
                node.children.forEach((childId, i) => {
                    layoutNode(childId, level + 1, leftBound + i * step, leftBound + (i + 1) * step);
                });
            }
        };

        layoutNode(0, 0, 0, this.canvas.width);
    }

    draw() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first
        this.nodes.forEach(node => {
            if (node.parentId !== null) {
                const parent = this.nodes[node.parentId];
                this.ctx.beginPath();
                this.ctx.moveTo(parent.x, parent.y);
                this.ctx.lineTo(node.x, node.y);
                this.ctx.strokeStyle = isDark ? '#555' : '#ddd';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });

        // Draw nodes
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[node.status] || (isDark ? '#2d2d44' : this.colors.pending);
            this.ctx.fill();
            this.ctx.strokeStyle = isDark ? '#ccc' : this.colors.stroke;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Label (e.g., F(5))
            this.ctx.fillStyle = isDark ? '#e0e0e0' : this.colors.text;
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label, node.x, node.y);

            // Result if done
            if (node.status === 'done' && node.value !== undefined) {
                this.ctx.fillStyle = '#28a745'; // Green is good in both
                this.ctx.font = 'bold 14px Arial';
                this.ctx.fillText(`= ${node.value}`, node.x, node.y + 35);
            }
        });
    }
}

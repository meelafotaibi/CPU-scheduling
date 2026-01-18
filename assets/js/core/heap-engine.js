/**
 * heap-engine.js - Visualization for Binary Heaps (Array + Tree view).
 */
class HeapEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.heap = [];
        this.highlights = {}; // { index: status }
        this.nodeRadius = 22;
        this.levelHeight = 70;

        this.colors = {
            default: '#4a90e2',
            compare: '#ffd700',
            swap: '#ff4d4d',
            sorted: '#28a745',
            text: '#333'
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

    setHeap(arr) {
        this.heap = [...arr];
        this.highlights = {};
        this.draw();
    }

    highlight(indices, status) {
        if (Array.isArray(indices)) {
            indices.forEach(idx => this.highlights[idx] = status);
        } else {
            this.highlights[indices] = status;
        }
        this.draw();
    }

    clearHighlights() {
        this.highlights = {};
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.heap.length === 0) return;

        // Draw Tree
        this.drawTree();

        // Draw Array Representation at the bottom
        this.drawArray();
    }

    drawTree() {
        if (this.heap.length === 0) return;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        const drawNode = (idx, x, y, levelWidth) => {
            const val = this.heap[idx];
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;

            if (left < this.heap.length) {
                const lx = x - levelWidth / 4;
                const ly = y + this.levelHeight;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(lx, ly);
                this.ctx.strokeStyle = isDark ? '#555' : '#ddd';
                this.ctx.stroke();
                drawNode(left, lx, ly, levelWidth / 2);
            }

            if (right < this.heap.length) {
                const rx = x + levelWidth / 4;
                const ry = y + this.levelHeight;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(rx, ry);
                this.ctx.strokeStyle = isDark ? '#555' : '#ddd';
                this.ctx.stroke();
                drawNode(right, rx, ry, levelWidth / 2);
            }

            // Draw current node
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.nodeRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[this.highlights[idx]] || (isDark ? '#2d2d44' : '#fff');
            this.ctx.fill();
            this.ctx.strokeStyle = this.colors.default;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.fillStyle = this.highlights[idx] ? '#fff' : (isDark ? '#e0e0e0' : '#333');
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(val, x, y);

            // Draw Index
            this.ctx.fillStyle = isDark ? '#aaa' : '#999';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`[${idx}]`, x, y - 32);
        };

        const rootX = this.canvas.width / 2;
        const rootY = 60;
        drawNode(0, rootX, rootY, this.canvas.width * 0.8);
    }

    drawArray() {
        const startX = 50;
        const startY = this.canvas.height - 60;
        const size = 40;
        const spacing = 5;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        this.heap.forEach((val, idx) => {
            const x = startX + idx * (size + spacing);

            this.ctx.fillStyle = this.colors[this.highlights[idx]] || (isDark ? '#2d2d44' : '#f8f9fa');
            this.ctx.strokeStyle = isDark ? '#555' : '#ddd';
            this.ctx.lineWidth = 1;
            this.ctx.fillRect(x, startY, size, size);
            this.ctx.strokeRect(x, startY, size, size);

            this.ctx.fillStyle = this.highlights[idx] ? '#fff' : (isDark ? '#e0e0e0' : '#333');
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val, x + size / 2, startY + size / 2 + 5);

            this.ctx.fillStyle = isDark ? '#aaa' : '#bbb';
            this.ctx.font = '9px Arial';
            this.ctx.fillText(idx, x + size / 2, startY + size + 15);
        });
    }
}

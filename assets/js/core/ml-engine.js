/**
 * ml-engine.js - Core engine for AI/ML visualizations on a 2D coordinate plane.
 */
class MLEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.points = []; // { x, y, label, color }
        this.centroids = []; // For clustering
        this.line = null; // { m, c } for regression
        this.padding = 40;
        this.showGrid = false;
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
        this.canvas.onclick = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.onCanvasClick(x, y);
        };
    }

    onCanvasClick(x, y) {
        // Default behavior: add a data point
        this.addPoint(x, y);
    }

    addPoint(x, y, color = '#333') {
        this.points.push({ x, y, color });
        this.draw();
    }

    clear() {
        this.points = [];
        this.centroids = [];
        this.line = null;
        this.draw();
    }

    draw() {
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        this.ctx.clearRect(0, 0, cw, ch);

        if (this.showGrid) this.drawGrid(isDark);

        // Draw Axes
        this.ctx.strokeStyle = isDark ? '#333' : '#eee';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, 0);
        this.ctx.lineTo(this.padding, ch - this.padding);
        this.ctx.lineTo(cw, ch - this.padding);
        this.ctx.stroke();

        // Draw Regression Line if exists
        if (this.line) {
            this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            const x1 = this.padding;
            const y1 = this.line.m * x1 + this.line.c;
            const x2 = cw;
            const y2 = this.line.m * x2 + this.line.c;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        // Draw Centroids (for K-Means)
        this.centroids.forEach(c => {
            this.ctx.fillStyle = c.color;
            this.ctx.strokeStyle = isDark ? '#fff' : '#fff'; // Keep white stroke for contrast on colored dots
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            // Draw cross or star shape for centroid
            this.ctx.beginPath();
            this.ctx.moveTo(c.x - 5, c.y - 5); this.ctx.lineTo(c.x + 5, c.y + 5);
            this.ctx.moveTo(c.x + 5, c.y - 5); this.ctx.lineTo(c.x - 5, c.y + 5);
            this.ctx.stroke();
        });

        // Draw Data Points
        this.points.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    drawGrid(isDark) {
        const size = 50;
        this.ctx.beginPath();
        this.ctx.strokeStyle = isDark ? '#333' : '#f5f5f5';
        this.ctx.lineWidth = 1;
        for (let x = this.padding; x <= this.canvas.width; x += size) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height - this.padding);
        }
        for (let y = 0; y <= this.canvas.height - this.padding; y += size) {
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }
}

/**
 * dsa-engine.js - Visualization for Linked Lists, Stacks, Queues, and Trees.
 */
class DSAEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = []; // { value, x, y, next: nodeRef, left: nodeRef, right: nodeRef }
        this.showGrid = false;
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

    drawNode(x, y, value, highlighted = false) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        this.ctx.fillStyle = highlighted ? '#ff6b6b' : (isDark ? '#2d2d44' : '#fff');
        this.ctx.strokeStyle = '#4a90e2';
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = highlighted ? '#fff' : (isDark ? '#e0e0e0' : '#333');
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(value, x, y + 6);
    }

    drawArrow(x1, y1, x2, y2) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headlen = 10;
        const d = 30;
        const startX = x1 + Math.cos(angle) * d;
        const startY = y1 + Math.sin(angle) * d;
        const endX = x2 - Math.cos(angle) * d;
        const endY = y2 - Math.sin(angle) * d;

        this.ctx.strokeStyle = isDark ? '#aaa' : '#999';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(endX, endY);
        this.ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.showGrid) this.drawGrid();
        // Specialized draw methods will be called by subclasses
    }

    drawGrid() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const size = 50;
        this.ctx.beginPath();
        this.ctx.strokeStyle = isDark ? '#333' : '#f8f8f8';
        this.ctx.lineWidth = 1;
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
}

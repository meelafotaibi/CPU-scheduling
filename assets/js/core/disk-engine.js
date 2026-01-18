/**
 * disk-engine.js - Visualization for Disk Scheduling algorithms (Line Graph).
 */
class DiskEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.requests = [];
        this.path = []; // [{cylinder, time}]
        this.maxCylinders = 200;
        this.padding = 40;
        this.colors = {
            line: '#4a90e2',
            point: '#ff4d4d',
            grid: '#eee',
            accent: '#f39c12'
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

    setData(requests, initialHead, path) {
        this.requests = requests;
        this.path = path;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        if (this.path.length > 0) {
            this.drawPath();
        }
    }

    drawGrid() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        ctx.strokeStyle = isDark ? '#333' : '#eee';
        ctx.lineWidth = 1;

        // Draw horizontal grid (timesteps)
        const stepY = (height - 2 * this.padding) / 10;
        for (let i = 0; i <= 10; i++) {
            const y = this.padding + i * stepY;
            ctx.beginPath();
            ctx.moveTo(this.padding, y);
            ctx.lineTo(width - this.padding, y);
            ctx.stroke();
        }

        // Draw vertical grid (cylinders)
        const stepX = (width - 2 * this.padding) / 10;
        for (let i = 0; i <= 10; i++) {
            const x = this.padding + i * stepX;
            ctx.beginPath();
            ctx.moveTo(x, this.padding);
            ctx.lineTo(x, height - this.padding);
            ctx.stroke();

            // Labels
            ctx.fillStyle = isDark ? '#aaa' : '#999';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(i * (this.maxCylinders / 10)), x, height - this.padding + 15);
        }

        // Axes titles
        ctx.fillStyle = isDark ? '#ccc' : '#666';
        ctx.font = 'bold 12px Arial';
        ctx.fillText("Cylinders (0-199)", width / 2, height - 10);

        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = isDark ? '#ccc' : '#666'; // Also updated this one
        ctx.fillText("Time / Sequence", 0, 0);
        ctx.restore();
    }

    drawPath() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;

        const scaleX = (width - 2 * this.padding) / (this.maxCylinders - 1);
        const scaleY = (height - 2 * this.padding) / (this.path.length || 1);

        ctx.beginPath();
        ctx.strokeStyle = this.colors.line;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        this.path.forEach((p, i) => {
            const x = this.padding + p.cylinder * scaleX;
            const y = this.padding + i * scaleY;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw points
        this.path.forEach((p, i) => {
            const x = this.padding + p.cylinder * scaleX;
            const y = this.padding + i * scaleY;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? this.colors.accent : this.colors.point;
            ctx.fill();

            // Value tag
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? '#ddd' : '#333';
            ctx.font = '10px Arial';
            ctx.fillText(p.cylinder, x, y - 10);
        });
    }

    highlightHead(cylinder) {
        // Optional real-time marker
    }
}
Riverside

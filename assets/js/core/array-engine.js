/**
 * array-engine.js - Shared engine for array-based sorting visualizations.
 */
class ArrayEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.highlights = {}; // { index: status }
        this.colors = {
            default: '#4a90e2',
            compare: '#ffd700', // Yellow
            swap: '#ff4d4d',    // Red
            sorted: '#28a745',  // Green
            pivot: '#9b59b6'    // Purple
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

    setArray(arr) {
        this.array = [...arr];
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

    swap(i, j) {
        const temp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = temp;
        this.draw();
    }

    draw() {
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        this.ctx.clearRect(0, 0, cw, ch);

        if (this.array.length === 0) return;

        const maxVal = Math.max(...this.array);
        const barWidth = (cw / this.array.length) * 0.8;
        const spacing = (cw / this.array.length) * 0.2;
        const startX = spacing / 2;

        this.array.forEach((val, idx) => {
            const barHeight = (val / maxVal) * (ch * 0.8);
            const x = startX + idx * (barWidth + spacing);
            const y = ch - barHeight - 20;

            // Determine color
            this.ctx.fillStyle = this.colors[this.highlights[idx]] || this.colors.default;

            // Draw Bar
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, barWidth, barHeight, 5);
            this.ctx.fill();

            // Draw Value
            if (this.array.length <= 20) {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                this.ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(val, x + barWidth / 2, y - 5);
            }
        });
    }
}

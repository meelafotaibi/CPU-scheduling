/**
 * perceptron-algo.js - Single Layer Perceptron visualization and decision boundary.
 */
class PerceptronAlgo {
    constructor(canvasId, ui) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ui = ui;

        // Model parameters
        this.w1 = 0.5;
        this.w2 = -0.5;
        this.bias = 0.1;

        this.points = []; // [{x, y, label}]
        this.highlightedPoint = null;

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

    updateParams(w1, w2, bias) {
        this.w1 = w1;
        this.w2 = w2;
        this.bias = bias;
        this.draw();
    }

    setPoints(points) {
        this.points = points;
        this.draw();
    }

    // Predict label: sign(w1*x + w2*y + b)
    predict(x, y) {
        const z = this.w1 * x + this.w2 * y + this.bias;
        return z >= 0 ? 1 : -1;
    }

    draw() {
        const ctx = this.ctx;
        const { width, height } = this.canvas;
        ctx.clearRect(0, 0, width, height);

        const isDark = document.body.getAttribute('data-theme') === 'dark';

        // Draw decision boundary area
        const step = 4;
        for (let x = 0; x < width; x += step) {
            for (let y = 0; y < height; y += step) {
                const nx = (x / width) * 2 - 1;
                const ny = (y / height) * 2 - 1;

                const p = this.predict(nx, ny);
                ctx.fillStyle = p === 1 ? 'rgba(74, 144, 226, 0.1)' : 'rgba(255, 77, 77, 0.1)';
                ctx.fillRect(x, y, step, step);
            }
        }

        // Draw the line: w1*x + w2*y + b = 0  => y = (-w1*x - b) / w2
        // To handle division by zero (vertical line when w2 = 0)
        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#fff' : '#111';
        ctx.lineWidth = 3;

        if (Math.abs(this.w2) < 0.001) {
            // Vertical line: x = -b / w1
            const nx = -this.bias / this.w1;
            const canvasX = (nx + 1) / 2 * width;
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, height);
        } else {
            const xStart = -1;
            const yStart = (-this.w1 * xStart - this.bias) / this.w2;
            const xEnd = 1;
            const yEnd = (-this.w1 * xEnd - this.bias) / this.w2;

            const canvasXStart = (xStart + 1) / 2 * width;
            const canvasYStart = (yStart + 1) / 2 * height;
            const canvasXEnd = (xEnd + 1) / 2 * width;
            const canvasYEnd = (yEnd + 1) / 2 * height;

            ctx.moveTo(canvasXStart, canvasYStart);
            ctx.lineTo(canvasXEnd, canvasYEnd);
        }
        ctx.stroke();

        // Draw data points
        this.points.forEach(p => {
            const px = (p.x + 1) / 2 * width;
            const py = (p.y + 1) / 2 * height;

            // Pulsate highlighted point
            if (this.highlightedPoint && Math.abs(this.highlightedPoint.x - p.x) < 0.001 && Math.abs(this.highlightedPoint.y - p.y) < 0.001) {
                ctx.beginPath();
                ctx.arc(px, py, 14, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(241, 196, 15, 0.4)';
                ctx.fill();
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fillStyle = p.label === 1 ? '#4a90e2' : '#ff4d4d';
            ctx.fill();
            ctx.strokeStyle = isDark ? '#1e293b' : '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Check if misclassified
            if (this.predict(p.x, p.y) !== p.label) {
                ctx.beginPath();
                ctx.arc(px, py, 10, 0, Math.PI * 2);
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }
}


/**
 * knn-algo.js - K-Nearest Neighbors classification logic.
 */
class KNNAlgo {
    constructor(canvasId, ui) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ui = ui;
        this.points = []; // [{x, y, label}]
        this.k = 3;
        this.queryPoint = null;

        this.colors = {
            A: '#4a90e2', // Class A
            B: '#ff4d4d', // Class B
            query: '#f39c12',
            bg: '#fdfdfd'
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

    addPoint(x, y, label) {
        this.points.push({ x, y, label });
        this.draw();
    }

    setQuery(x, y) {
        this.queryPoint = { x, y };
        this.classify();
    }

    classify() {
        if (!this.queryPoint || this.points.length === 0) return;

        // Calculate distances
        const distances = this.points.map(p => ({
            ...p,
            dist: Math.sqrt((p.x - this.queryPoint.x) ** 2 + (p.y - this.queryPoint.y) ** 2)
        }));

        // Sort and take K
        distances.sort((a, b) => a.dist - b.dist);
        const nearest = distances.slice(0, Math.min(this.k, distances.length));

        // Count votes
        const votes = nearest.reduce((acc, p) => {
            acc[p.label] = (acc[p.label] || 0) + 1;
            return acc;
        }, {});

        const result = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

        this.draw(nearest, result);
        this.ui.updateResult(result, votes);
    }

    draw(nearest = [], result = null) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw data points
        this.points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = this.colors[p.label];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw query point
        if (this.queryPoint) {
            // Draw lines to nearest
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#ddd';
            nearest.forEach(n => {
                ctx.beginPath();
                ctx.moveTo(this.queryPoint.x, this.queryPoint.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
            });
            ctx.setLineDash([]);

            // Draw query point itself
            ctx.beginPath();
            ctx.arc(this.queryPoint.x, this.queryPoint.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = result ? this.colors[result] : this.colors.query;
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw circle radius of K-th nearest
            if (nearest.length > 0) {
                const maxDist = nearest[nearest.length - 1].dist;
                ctx.beginPath();
                ctx.arc(this.queryPoint.x, this.queryPoint.y, maxDist, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(243, 156, 18, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    clear() {
        this.points = [];
        this.queryPoint = null;
        this.draw();
        this.ui.updateResult(null, {});
    }
}
Riverside

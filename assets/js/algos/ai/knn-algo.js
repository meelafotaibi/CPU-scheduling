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
        this.animating = false;
        this.animationProgress = 0;

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

    setQuery(x, y, onComplete = null) {
        if (this.animating) return;
        this.queryPoint = { x, y };
        this.classify(onComplete);
    }

    classify(onComplete = null) {
        if (!this.queryPoint || this.points.length === 0) {
            if (onComplete) onComplete(null, {});
            return;
        }

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

        const result = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // Start expanded ring animation
        this.animating = true;
        this.animationProgress = 0;
        const startTime = Date.now();
        const duration = 1000; // 1 second animation

        const maxDist = nearest.length > 0 ? nearest[nearest.length - 1].dist : 150;

        const tick = () => {
            const elapsed = Date.now() - startTime;
            this.animationProgress = Math.min(1.0, elapsed / duration);

            const currentRadius = this.animationProgress * maxDist;
            const visibleNearest = nearest.filter(n => n.dist <= currentRadius);

            // During animation we don't show the final classification color on query point
            this.draw(visibleNearest, null, currentRadius);

            if (this.animationProgress < 1.0) {
                requestAnimationFrame(tick);
            } else {
                this.animating = false;
                this.draw(nearest, result, maxDist);
                this.ui.updateResult(result, votes);
                if (onComplete) onComplete(result, votes);
            }
        };

        requestAnimationFrame(tick);
    }

    draw(nearest = [], result = null, currentRadius = 0) {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        const isDark = document.body.getAttribute('data-theme') === 'dark';

        // Draw axes
        ctx.strokeStyle = isDark ? '#333' : '#eee';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(30, ch - 30);
        ctx.lineTo(cw, ch - 30);
        ctx.stroke();

        // Draw data points
        this.points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = this.colors[p.label];
            ctx.fill();
            ctx.strokeStyle = isDark ? '#1e293b' : '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw query point and classification indicators
        if (this.queryPoint) {
            // Draw lines to nearest
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
            nearest.forEach(n => {
                ctx.beginPath();
                ctx.moveTo(this.queryPoint.x, this.queryPoint.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
            });
            ctx.setLineDash([]);

            // Draw expanding ring
            if (currentRadius > 0) {
                ctx.beginPath();
                ctx.arc(this.queryPoint.x, this.queryPoint.y, currentRadius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(243, 156, 18, 0.35)';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                const grad = ctx.createRadialGradient(
                    this.queryPoint.x, this.queryPoint.y, 0,
                    this.queryPoint.x, this.queryPoint.y, currentRadius
                );
                grad.addColorStop(0, 'rgba(243, 156, 18, 0.03)');
                grad.addColorStop(1, 'rgba(243, 156, 18, 0.12)');
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Draw query point itself
            ctx.beginPath();
            ctx.arc(this.queryPoint.x, this.queryPoint.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = result ? this.colors[result] : this.colors.query;
            ctx.fill();
            ctx.strokeStyle = isDark ? '#fff' : '#333';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }
    }

    clear() {
        if (this.animating) return;
        this.points = [];
        this.queryPoint = null;
        this.draw();
        this.ui.updateResult(null, {});
    }
}


/**
 * Premium Cinematic Brain Animation
 * Uses Canvas API to simulate a glowing neural network brain
 */
class BrainAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        // Force canvas into visibility overlaying the background
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';

        this.ctx = this.canvas.getContext('2d');
        this.constellations = [];
        this.ambientStars = [];

        // Optimize counts for mobile viewports to preserve performance
        const isMobile = window.innerWidth < 768;
        this.constellationCount = isMobile ? 8 : 18; 
        this.starCount = isMobile ? 60 : 150;

        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseVelocityX = 0;
        this.mouseVelocityY = 0;
        this.isMouseDown = false;

        this.pulse = 0;
        this.colors = ['#ffffff', '#a855f7', '#6366f1', '#e0e7ff'];

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.constellations = [];
        this.ambientStars = [];

        // Generate Ambient Background Space Stars
        for (let i = 0; i < this.starCount; i++) {
            this.ambientStars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.05 + 0.01
            });
        }

        // Generate Discrete Zodiac Constellations
        for (let c = 0; c < this.constellationCount; c++) {
            const numStars = 4 + Math.floor(Math.random() * 6); // 4 to 9 stars per cluster
            const template = [];
            let cx = 0, cy = 0;

            // Generate the shape (random walk to form distinct lines/angles)
            template.push({ x: cx, y: cy, isMajor: Math.random() > 0.4 });
            for (let i = 1; i < numStars; i++) {
                // Keep the angles sharp (like real constellations)
                const angle = (Math.floor(Math.random() * 8) * (Math.PI / 4));
                const dist = 25 + Math.random() * 30; // Shorter distances for smaller, tighter clusters
                cx += Math.cos(angle) * dist;
                cy += Math.sin(angle) * dist;
                template.push({ x: cx, y: cy, isMajor: Math.random() > 0.4 });
            }

            this.constellations.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4, // Slow continuous drift ("moving by itself")
                vy: (Math.random() - 0.5) * 0.4,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.002, // Very slight rotation
                stars: template,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                phase: Math.random() * Math.PI * 2,
                dragVx: 0,
                dragVy: 0,
                trail: [], // For shooting star effect on the whole cluster
                // For the "points at first, then connect" animation
                timeAlive: -Math.random() * 100 // Stagger the start times slightly
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());

        const updateMouse = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            this.mouseVelocityX = x - this.lastMouseX;
            this.mouseVelocityY = y - this.lastMouseY;
            this.lastMouseX = x;
            this.lastMouseY = y;
            this.mouseX = x;
            this.mouseY = y;
        };

        window.addEventListener('mousemove', updateMouse);
        window.addEventListener('touchmove', updateMouse);
        window.addEventListener('mousedown', () => { this.isMouseDown = true; });
        window.addEventListener('touchstart', (e) => { this.isMouseDown = true; updateMouse(e); });
        window.addEventListener('mouseup', () => { this.isMouseDown = false; });
        window.addEventListener('touchend', () => { this.isMouseDown = false; });
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.pulse += 0.02;
        this.ctx.globalCompositeOperation = 'source-over';

        // 1. Draw Ambient Tiny Stars
        this.ctx.fillStyle = '#ffffff';
        this.ambientStars.forEach(star => {
            star.y -= star.speed; // Slow upward drift
            if (star.y < 0) star.y = this.canvas.height;

            const twinkle = 0.3 + Math.sin(this.pulse * 0.5 + star.phase) * 0.7;
            this.ctx.globalAlpha = twinkle * 0.5;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 2. Draw Zodiac Constellations
        this.constellations.forEach(c => {
            // Apply drift and physics
            c.x += c.vx + c.dragVx;
            c.y += c.vy + c.dragVy;
            c.rotation += c.rotSpeed;
            c.timeAlive += 1; // Age the constellation

            // Physics decay (friction against dragging)
            c.dragVx *= 0.95;
            c.dragVy *= 0.95;

            // Screen wrapping
            const pad = 200;
            if (c.x < -pad) c.x = this.canvas.width + pad;
            if (c.x > this.canvas.width + pad) c.x = -pad;
            if (c.y < -pad) c.y = this.canvas.height + pad;
            if (c.y > this.canvas.height + pad) c.y = -pad;

            // Interactive Dragging (Throwing Constellations)
            const distMouse = Math.sqrt((c.x - this.mouseX) ** 2 + (c.y - this.mouseY) ** 2);
            if (this.isMouseDown && distMouse < 180) {
                c.dragVx += this.mouseVelocityX * 0.05;
                c.dragVy += this.mouseVelocityY * 0.05;
            }

            // Calculate absolute positions of stars in this cluster
            const cos = Math.cos(c.rotation);
            const sin = Math.sin(c.rotation);
            const starPositions = c.stars.map(s => {
                return {
                    x: c.x + (s.x * cos - s.y * sin),
                    y: c.y + (s.x * sin + s.y * cos),
                    isMajor: s.isMajor
                };
            });

            // Shooting Star Trail (if thrown fast enough)
            const speed = Math.sqrt(c.dragVx ** 2 + c.dragVy ** 2);
            if (speed > 4) {
                c.trail.push({ x: c.x, y: c.y, alpha: Math.min(0.5, speed / 15) });
            }
            if (c.trail.length > 15) c.trail.shift();

            // Draw Trail
            c.trail.forEach((t, i) => {
                t.alpha *= 0.8;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, 8 * (i / 15), 0, Math.PI * 2);
                this.ctx.fillStyle = c.color;
                this.ctx.globalAlpha = t.alpha;
                this.ctx.fill();
            });

            const twinkle = 0.5 + Math.sin(this.pulse + c.phase) * 0.5;

            // Draw connecting lines with dynamic "connecting" animation
            // Starts as 0 (no lines), gradually increases to render the segments
            if (c.timeAlive > 0) {
                // Determine how many segments to draw based on time alive
                // e.g. takes 150 frames to fully connect
                const progress = Math.min(1.0, c.timeAlive / 150);
                const totalSegments = starPositions.length - 1;
                const segmentsToDraw = totalSegments * progress;

                this.ctx.beginPath();
                this.ctx.moveTo(starPositions[0].x, starPositions[0].y);

                for (let i = 1; i < starPositions.length; i++) {
                    if (i <= Math.floor(segmentsToDraw)) {
                        // Fully draw this segment
                        this.ctx.lineTo(starPositions[i].x, starPositions[i].y);
                    } else if (i === Math.ceil(segmentsToDraw)) {
                        // Partially draw this segment
                        const segmentProgress = segmentsToDraw % 1;
                        const prev = starPositions[i - 1];
                        const target = starPositions[i];
                        const partialX = prev.x + (target.x - prev.x) * segmentProgress;
                        const partialY = prev.y + (target.y - prev.y) * segmentProgress;
                        this.ctx.lineTo(partialX, partialY);
                        break;
                    }
                }

                this.ctx.strokeStyle = c.color;
                this.ctx.lineWidth = 1;
                this.ctx.globalAlpha = 0.35 + (twinkle * 0.15);
                this.ctx.stroke();
            }

            // Draw the individual stars (points)
            starPositions.forEach((pos, idx) => {
                // Make stars fade in slightly based on timeAlive so it feels dynamic
                // If the line hasn't reached an outer star yet, keep it slightly dimmer
                const starVisibility = c.timeAlive > (idx * 20) - 50 ? 1 : 0.2;

                let size = pos.isMajor ? 2.5 : 1.5;

                // Outer Glow (Fast)
                if (pos.isMajor) {
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, size * 2.5, 0, Math.PI * 2);
                    this.ctx.fillStyle = c.color;
                    this.ctx.globalAlpha = Math.max(0.05, twinkle * 0.3) * starVisibility;
                    this.ctx.fill();
                }

                // Inner Bright Core
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.globalAlpha = Math.max(0.3, twinkle) * starVisibility;
                this.ctx.fill();
            });
        });

        this.ctx.globalAlpha = 1.0;
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

function initBrainAnimation() {
    // Prevent double initialization
    if (window.activeBrainAnimation) return;
    
    const canvas = document.getElementById('brain-canvas');
    if (canvas) {
        window.activeBrainAnimation = new BrainAnimation('brain-canvas');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrainAnimation);
} else {
    initBrainAnimation();
}

// Handle iOS Safari bfcache (Back/Forward cache) pageshow events
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        initBrainAnimation();
    }
});


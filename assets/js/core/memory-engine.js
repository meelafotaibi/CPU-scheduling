/**
 * memory-engine.js - Visualization for Memory blocks and allocations.
 */
class MemoryEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.blocks = []; // { id, size, free, processId }
        this.colors = {
            free: '#e0e0e0',
            busy: '#4a90e2',
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

    setBlocks(blocks) {
        this.blocks = blocks.map((size, idx) => ({
            id: idx + 1,
            size: size,
            free: true,
            processId: null,
            processSize: 0
        }));
        this.draw();
    }

    allocate(blockIdx, processId, processSize) {
        const block = this.blocks[blockIdx];
        if (block && block.free && block.size >= processSize) {
            block.free = false;
            block.processId = processId;
            block.processSize = processSize;
            this.draw();
            return true;
        }
        return false;
    }

    reset() {
        this.blocks.forEach(b => {
            b.free = true;
            b.processId = null;
            b.processSize = 0;
        });
        this.draw();
    }

    draw() {
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        // Dynamic colors
        const colors = {
            free: isDark ? '#2d2d44' : '#e0e0e0',
            busy: '#4a90e2',
            text: isDark ? '#e0e0e0' : '#333'
        };

        this.ctx.clearRect(0, 0, cw, ch);

        if (this.blocks.length === 0) return;

        const totalMemory = this.blocks.reduce((sum, b) => sum + b.size, 0);
        const margin = 50;
        const availableWidth = cw - 2 * margin;
        const barHeight = 80;
        const y = ch / 2 - barHeight / 2;

        let currentX = margin;
        this.blocks.forEach((block, idx) => {
            const blockWidth = (block.size / totalMemory) * availableWidth;

            // Draw Block
            this.ctx.fillStyle = block.free ? colors.free : colors.busy;
            this.ctx.strokeStyle = isDark ? '#555' : '#999';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(currentX, y, blockWidth, barHeight);
            this.ctx.strokeRect(currentX, y, blockWidth, barHeight);

            // Labels
            this.ctx.fillStyle = colors.text;
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';

            // Size Label
            this.ctx.fillText(`${block.size}K`, currentX + blockWidth / 2, y + barHeight + 20);

            // Process Info
            if (!block.free) {
                this.ctx.fillStyle = 'white'; // Always white on blue busy block
                this.ctx.font = 'bold 14px Arial';
                this.ctx.fillText(`P${block.processId}`, currentX + blockWidth / 2, y + barHeight / 2 + 5);
                this.ctx.font = '10px Arial';
                this.ctx.fillText(`Used: ${block.processSize}K`, currentX + blockWidth / 2, y + barHeight / 2 + 20);
            } else {
                this.ctx.fillStyle = isDark ? '#aaa' : '#666';
                this.ctx.fillText('Free', currentX + blockWidth / 2, y + barHeight / 2 + 5);
            }

            currentX += blockWidth;
        });
    }
}

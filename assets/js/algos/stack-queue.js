/**
 * stack-queue.js - Stack and Queue visualization.
 */
class StackQueueAlgo {
    constructor(engine, type = 'stack') {
        this.engine = engine;
        this.type = type; // 'stack' or 'queue'
        this.items = [];
    }

    push(val) {
        this.items.push(val);
        this.layout();
    }

    pop() {
        if (this.type === 'stack') {
            this.items.pop();
        } else {
            this.items.shift();
        }
        this.layout();
    }

    layout() {
        this.engine.draw();
    }

    draw() {
        const startX = 100;
        const spacing = 70;
        const y = this.engine.canvas.height / 2;

        this.items.forEach((val, i) => {
            const x = startX + i * spacing;
            // Draw square for stack/queue items
            this.engine.ctx.fillStyle = '#4a90e2';
            this.engine.ctx.strokeStyle = '#333';
            this.engine.ctx.lineWidth = 2;
            this.engine.ctx.fillRect(x - 25, y - 25, 50, 50);
            this.engine.ctx.strokeRect(x - 25, y - 25, 50, 50);

            this.engine.ctx.fillStyle = '#fff';
            this.engine.ctx.font = 'bold 16px Arial';
            this.engine.ctx.textAlign = 'center';
            this.engine.ctx.fillText(val, x, y + 6);

            // Labels for head/tail or top
            if (this.type === 'stack' && i === this.items.length - 1) {
                this.engine.ctx.fillStyle = '#ff6b6b';
                this.engine.ctx.fillText('TOP', x, y - 40);
            } else if (this.type === 'queue') {
                if (i === 0) {
                    this.engine.ctx.fillStyle = '#ff6b6b';
                    this.engine.ctx.fillText('FRONT', x, y - 40);
                }
                if (i === this.items.length - 1) {
                    this.engine.ctx.fillStyle = '#2ecc71';
                    this.engine.ctx.fillText('REAR', x, y + 50);
                }
            }
        });
    }
}

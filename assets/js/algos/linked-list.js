/**
 * linked-list.js - Singly Linked List logic.
 */
class LinkedListAlgo {
    constructor(engine) {
        this.engine = engine;
        this.head = null;
        this.nodeCount = 0;
    }

    add(value) {
        const newNode = { value, x: 0, y: 0, next: null };
        if (!this.head) {
            this.head = newNode;
        } else {
            let curr = this.head;
            while (curr.next) curr = curr.next;
            curr.next = newNode;
        }
        this.nodeCount++;
        this.layout();
    }

    insertAt(index, value) {
        if (index < 0 || index > this.nodeCount) {
            window.ui.updateStatus(`Index ${index} out of bounds!`);
            return;
        }
        const newNode = { value, x: 0, y: 0, next: null };
        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let curr = this.head;
            let prev = null;
            let i = 0;
            while (i < index) {
                prev = curr;
                curr = curr.next;
                i++;
            }
            prev.next = newNode;
            newNode.next = curr;
        }
        this.nodeCount++;
        this.layout();
        window.ui.updateStatus(`Inserted ${value} at index ${index}`);
    }

    remove() {
        if (!this.head) return;
        this.head = this.head.next;
        this.nodeCount--;
        this.layout();
        window.ui.updateStatus(`Removed head node`);
    }

    removeAt(index) {
        if (index < 0 || index >= this.nodeCount) {
            window.ui.updateStatus(`Index ${index} out of bounds!`);
            return;
        }
        if (!this.head) return;

        if (index === 0) {
            this.head = this.head.next;
        } else {
            let curr = this.head;
            let prev = null;
            let i = 0;
            while (i < index) {
                prev = curr;
                curr = curr.next;
                i++;
            }
            prev.next = curr.next;
        }
        this.nodeCount--;
        this.layout();
        window.ui.updateStatus(`Removed node at index ${index}`);
    }

    reverse() {
        let prev = null;
        let current = this.head;
        let next = null;
        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        this.head = prev;
        this.layout();
        window.ui.updateStatus(`Reversed the list`);
    }

    layout() {
        let curr = this.head;
        let i = 0;
        const startX = 100;
        const spacing = 150;
        const y = this.engine.canvas.height / 2;

        while (curr) {
            curr.x = startX + i * spacing;
            curr.y = y;
            curr = curr.next;
            i++;
        }
        this.engine.draw();
    }

    draw() {
        const ctx = this.engine.ctx;
        let curr = this.head;
        const w = 100; // Rect Width
        const h = 50;  // Rect Height
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const stroke = '#4a90e2';
        const bg = isDark ? '#2d2d44' : '#fff';
        const text = isDark ? '#fff' : '#333';

        while (curr) {
            // Centered coordinates for the rect
            const x = curr.x - w / 2;
            const y = curr.y - h / 2;

            // Draw Box
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.fillStyle = bg;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);

            // Draw Divider
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();

            // Draw Data (Left)
            ctx.fillStyle = text;
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(curr.value, x + w / 4, y + h / 2);

            // Draw Pointer (Right)
            if (curr.next) {
                // Dot center
                ctx.fillStyle = stroke;
                const px = x + 3 * w / 4;
                const py = y + h / 2;
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();

                // Draw Custom Arrow to next node
                this.drawLinkArrow(px, py, curr.next.x - w / 2, curr.next.y);
            } else {
                // NULL (Ground / Diagonal)
                ctx.lineWidth = 1;
                ctx.strokeStyle = text;
                ctx.beginPath();
                ctx.moveTo(x + w / 2, y + h);
                ctx.lineTo(x + w, y);
                ctx.stroke();
            }

            curr = curr.next;
        }
    }

    drawLinkArrow(x1, y1, x2, y2) {
        const ctx = this.engine.ctx;
        const headlen = 10;
        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
}

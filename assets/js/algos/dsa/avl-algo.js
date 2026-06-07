/**
 * avl-algo.js - AVL Tree implementation with rotations and visualization.
 */
class AVLAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
    }

    reset() {
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.draw();
    }

    insert(val) {
        this.steps = [];
        this.root = this._insert(this.root, val);
        this.steps.push({ type: 'done', root: this.cloneTree(this.root) });
    }

    _insert(node, val) {
        if (!node) {
            const newNode = { val, left: null, right: null, height: 1 };
            this.steps.push({ type: 'create', val, node: { ...newNode } });
            return newNode;
        }

        this.steps.push({ type: 'compare', nodeVal: node.val, val });
        if (val < node.val) {
            node.left = this._insert(node.left, val);
        } else if (val > node.val) {
            node.right = this._insert(node.right, val);
        } else {
            return node;
        }

        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        const balance = this.getBalance(node);

        // Left Left Case
        if (balance > 1 && val < node.left.val) {
            this.steps.push({ type: 'rotate', mode: 'LL', val: node.val });
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && val > node.right.val) {
            this.steps.push({ type: 'rotate', mode: 'RR', val: node.val });
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && val > node.left.val) {
            this.steps.push({ type: 'rotate', mode: 'LR', val: node.val });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && val < node.right.val) {
            this.steps.push({ type: 'rotate', mode: 'RL', val: node.val });
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        return y;
    }

    getHeight(n) { return n ? n.height : 0; }
    getBalance(n) { return n ? this.getHeight(n.left) - this.getHeight(n.right) : 0; }

    cloneTree(node) {
        if (!node) return null;
        return {
            val: node.val,
            height: node.height,
            left: this.cloneTree(node.left),
            right: this.cloneTree(node.right)
        };
    }

    draw(displayRoot = this.root, highlights = {}) {
        const canvas = this.engine.canvas;
        const ctx = this.engine.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!displayRoot) return;

        const drawNode = (node, x, y, levelWidth) => {
            if (node.left) {
                const lx = x - levelWidth / 4;
                const ly = y + 70;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(lx, ly);
                ctx.strokeStyle = '#ddd';
                ctx.stroke();
                drawNode(node.left, lx, ly, levelWidth / 2);
            }
            if (node.right) {
                const rx = x + levelWidth / 4;
                const ry = y + 70;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(rx, ry);
                ctx.strokeStyle = '#ddd';
                ctx.stroke();
                drawNode(node.right, rx, ry, levelWidth / 2);
            }

            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);

            let color = '#fff';
            if (highlights.val === node.val) color = '#ffd700';
            if (highlights.rotateVal === node.val) color = '#ff4d4d';

            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#4a90e2';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.val, x, y);

            // Height label
            ctx.fillStyle = '#999';
            ctx.font = '10px Arial';
            ctx.fillText(`h=${node.height}`, x, y + 32);
        };

        drawNode(displayRoot, canvas.width / 2, 60, canvas.width * 0.85);
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        const step = this.steps[this.currentStep];

        if (step.type === 'compare') {
            this.ui.updateStatus(`Comparing ${step.val} with node ${step.nodeVal}...`);
            this.draw(null, { val: step.nodeVal });
        } else if (step.type === 'create') {
            this.ui.updateStatus(`Inserting ${step.val} into the tree.`);
            // For insertion, we show the tree before rotations
        } else if (step.type === 'rotate') {
            this.ui.updateStatus(`Imbalance detected! Performing ${step.mode} rotation at node ${step.val}.`);
            this.draw(null, { rotateVal: step.val });
        } else if (step.type === 'done') {
            this.ui.updateStatus(`Node inserted and tree balanced.`);
            this.draw(step.root);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}
Riverside

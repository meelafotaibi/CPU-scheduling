/**
 * avl-algo.js - AVL Tree implementation with rotations, visualizer fixes, and Balance Rotator Game.
 */
class AVLAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.viewMode = 'avl';
        this.insertSequence = [];

        // Challenge Mode state
        this.challengeActive = false;
        this.challengeUnbalancedNode = null; // Node that is unbalanced
        this.requiredRotationMode = null; // 'LL', 'RR', 'LR', 'RL'
        this.moves = 0;
    }

    reset() {
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.insertSequence = [];
        this.engine.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
    }

    insert(val) {
        this.insertSequence.push(val);
        this.steps = [];
        this.root = this._insert(this.root, val);
        this.steps.push({ 
            type: 'done', 
            msg: `Node ${val} inserted and tree balanced.`,
            root: this.cloneTree(this.root),
            highlights: {}
        });
        this.currentStep = 0;
    }

    _insert(node, val) {
        if (!node) {
            const newNode = { val, left: null, right: null, height: 1 };
            this.steps.push({ 
                type: 'create', 
                msg: `Creating new leaf node ${val}.`,
                val, 
                root: this.cloneTree(this.root),
                highlights: { createVal: val }
            });
            return newNode;
        }

        this.steps.push({ 
            type: 'compare', 
            msg: `Comparing ${val} with node ${node.val}.`,
            root: this.cloneTree(this.root),
            highlights: { compareVal: node.val }
        });

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
            this.steps.push({ 
                type: 'rotate', 
                msg: `Imbalance detected at ${node.val} (balance = ${balance}). Requires LL rotation.`,
                mode: 'LL', 
                root: this.cloneTree(this.root),
                highlights: { rotateVal: node.val }
            });
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && val > node.right.val) {
            this.steps.push({ 
                type: 'rotate', 
                msg: `Imbalance detected at ${node.val} (balance = ${balance}). Requires RR rotation.`,
                mode: 'RR', 
                root: this.cloneTree(this.root),
                highlights: { rotateVal: node.val }
            });
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && val > node.left.val) {
            this.steps.push({ 
                type: 'rotate', 
                msg: `Imbalance detected at ${node.val} (balance = ${balance}). Requires LR rotation.`,
                mode: 'LR', 
                root: this.cloneTree(this.root),
                highlights: { rotateVal: node.val }
            });
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && val < node.right.val) {
            this.steps.push({ 
                type: 'rotate', 
                msg: `Imbalance detected at ${node.val} (balance = ${balance}). Requires RL rotation.`,
                mode: 'RL', 
                root: this.cloneTree(this.root),
                highlights: { rotateVal: node.val }
            });
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

    startChallenge() {
        this.challengeActive = true;
        this.moves = 0;

        // Generate a standard unbalanced scenario
        // E.g. Insert values: 50, 30, 20 (LL case at 50)
        const cases = [
            { vals: [50, 30, 20], rotation: 'LL', unbalanced: 50, msg: "Inserted 50, 30, 20. Node 50 is now unbalanced." },
            { vals: [50, 70, 80], rotation: 'RR', unbalanced: 50, msg: "Inserted 50, 70, 80. Node 50 is now unbalanced." },
            { vals: [50, 30, 40], rotation: 'LR', unbalanced: 50, msg: "Inserted 50, 30, 40. Node 50 is now unbalanced." },
            { vals: [50, 70, 60], rotation: 'RL', unbalanced: 50, msg: "Inserted 50, 70, 60. Node 50 is now unbalanced." }
        ];

        const choice = cases[Math.floor(Math.random() * cases.length)];
        this.root = null;
        
        // Build the tree manually without balancing
        const insertNoBalance = (node, val) => {
            if (!node) return { val, left: null, right: null, height: 1 };
            if (val < node.val) node.left = insertNoBalance(node.left, val);
            else node.right = insertNoBalance(node.right, val);
            node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
            return node;
        };

        choice.vals.forEach(v => {
            this.root = insertNoBalance(this.root, v);
        });

        this.challengeUnbalancedNode = choice.unbalanced;
        this.requiredRotationMode = choice.rotation;

        this.ui.updateStatus(`🎯 Balance Rotator! The tree is unbalanced at node <b>${choice.unbalanced}</b>.<br>Click the correct rotation type in the control bar below to rebalance it.`);
        this.draw();
    }

    stopChallenge() {
        this.challengeActive = false;
        this.challengeUnbalancedNode = null;
        this.requiredRotationMode = null;
        this.reset();
        this.insert(50);
        this.insert(30);
        this.insert(70);
    }

    applyChallengeRotation(mode) {
        if (!this.challengeActive) return;

        this.moves++;
        if (mode === this.requiredRotationMode) {
            // Apply actual rotation
            if (mode === 'LL') {
                this.root = this.rightRotate(this.root);
            } else if (mode === 'RR') {
                this.root = this.leftRotate(this.root);
            } else if (mode === 'LR') {
                this.root.left = this.leftRotate(this.root.left);
                this.root = this.rightRotate(this.root);
            } else if (mode === 'RL') {
                this.root.right = this.rightRotate(this.root.right);
                this.root = this.leftRotate(this.root);
            }

            this.ui.updateStatus(`👑 Balanced! You correctly solved the imbalance using a <b>${mode} rotation</b> in ${this.moves} move.`);
            if (typeof GamificationSystem !== 'undefined') {
                GamificationSystem.saveScore('avl', 'tree_balancer', this.moves, 1);
                ProgressSystem.complete('dsa', 'AVL Trees');
            }
            this.challengeActive = false;
        } else {
            this.ui.updateStatus(`❌ Incorrect rotation! That would make the tree more unbalanced. Try again!`);
        }
        this.draw();
    }

    buildBST(sequence) {
        if (!sequence || sequence.length === 0) return null;
        const bstInsert = (node, val) => {
            if (!node) return { val, left: null, right: null, height: 1 };
            if (val < node.val) node.left = bstInsert(node.left, val);
            else if (val > node.val) node.right = bstInsert(node.right, val);
            node.height = 1 + Math.max(node.left ? node.left.height : 0, node.right ? node.right.height : 0);
            return node;
        };
        let root = null;
        sequence.forEach(val => {
            root = bstInsert(root, val);
        });
        return root;
    }

    draw(displayRoot = this.root, highlights = {}) {
        const canvas = this.engine.canvas;
        const ctx = this.engine.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const rootToDraw = displayRoot || this.root;
        if (!rootToDraw) return;

        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const defaultColor = '#4a90e2';

        const drawNode = (node, x, y, levelWidth) => {
            if (node.left) {
                const lx = x - levelWidth / 4;
                const ly = y + 70;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(lx, ly);
                ctx.strokeStyle = isDark ? '#555' : '#ddd';
                ctx.lineWidth = 2;
                ctx.stroke();
                drawNode(node.left, lx, ly, levelWidth / 2);
            }
            if (node.right) {
                const rx = x + levelWidth / 4;
                const ry = y + 70;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(rx, ry);
                ctx.strokeStyle = isDark ? '#555' : '#ddd';
                ctx.lineWidth = 2;
                ctx.stroke();
                drawNode(node.right, rx, ry, levelWidth / 2);
            }

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);

            let nodeColor = isDark ? '#2d2d44' : '#fff';
            
            // Highlights override
            if (highlights.compareVal === node.val) nodeColor = '#ffd700'; // Yellow
            if (highlights.rotateVal === node.val || (this.challengeActive && node.val === this.challengeUnbalancedNode)) nodeColor = '#ff4d4d'; // Red
            if (highlights.createVal === node.val) nodeColor = '#2ecc71'; // Green

            ctx.fillStyle = nodeColor;
            ctx.fill();
            ctx.strokeStyle = defaultColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text
            ctx.fillStyle = (highlights.compareVal === node.val || highlights.rotateVal === node.val || highlights.createVal === node.val) ? '#fff' : (isDark ? '#e0e0e0' : '#333');
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.val, x, y);

            // Height and Balance factor
            const balance = this.getBalance(node);
            if (this.viewMode === 'bf') {
                ctx.save();
                const absBf = Math.abs(balance);
                const bfColor = absBf > 1 ? '#ff4d4d' : absBf === 1 ? '#ffd700' : '#2ecc71';
                ctx.fillStyle = bfColor;
                ctx.font = 'bold 12px Arial';
                ctx.fillText(`BF: ${balance}`, x, y - 32);
                ctx.restore();
            }

            ctx.fillStyle = isDark ? '#aaa' : '#888';
            ctx.font = '10px Arial';
            ctx.fillText(`h=${node.height} (b=${balance})`, x, y + 32);
        };

        if (this.viewMode === 'compare') {
            // Draw central partition line
            ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash

            // Draw labels
            ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('AVL Tree (Self-Balancing)', canvas.width / 4, 30);
            ctx.fillText('BST Tree (Unbalanced)', 3 * canvas.width / 4, 30);

            // Draw AVL on left half
            drawNode(rootToDraw, canvas.width / 4, 80, canvas.width * 0.45);

            // Construct and draw BST on right half
            const bstRoot = this.buildBST(this.insertSequence);
            if (bstRoot) {
                drawNode(bstRoot, 3 * canvas.width / 4, 80, canvas.width * 0.45);
            }
            return;
        }

        drawNode(rootToDraw, canvas.width / 2, 60, canvas.width * 0.85);
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        
        const step = this.steps[this.currentStep];
        this.ui.updateStatus(step.msg);
        
        // Draw the state captured at this step
        this.draw(step.root, step.highlights);

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}

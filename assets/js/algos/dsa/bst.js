/**
 * bst.js - Binary Search Tree logic with stepping trace and Path Guesser Game.
 */
class BSTAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = null;

        // Trace state
        this.steps = [];
        this.currentStep = 0;

        // Challenge state
        this.challengeActive = false;
        this.targetValue = null;
        this.targetPath = [];
        this.currentPathIndex = 0;
        this.errors = 0;

        this.initEvents();
    }

    initEvents() {
        this.engine.canvas.addEventListener('mousedown', (e) => {
            if (!this.challengeActive) return;
            const rect = this.engine.canvas.getBoundingClientRect();
            const scaleX = this.engine.canvas.width / rect.width;
            const scaleY = this.engine.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            this.handleCanvasClick(x, y);
        });
    }

    handleCanvasClick(clickX, clickY) {
        // Find which node was clicked
        let clickedNode = null;
        const checkClick = (node) => {
            if (!node) return;
            const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
            if (dist <= 25) {
                clickedNode = node;
                return;
            }
            checkClick(node.left);
            checkClick(node.right);
        };
        checkClick(this.root);

        if (clickedNode) {
            const expectedNode = this.targetPath[this.currentPathIndex];
            if (clickedNode.value === expectedNode.value) {
                // Correct!
                clickedNode.challengeHighlight = 'correct';
                this.currentPathIndex++;
                if (this.currentPathIndex >= this.targetPath.length) {
                    this.ui.updateStatus(`<i class="fas fa-crown" style="color: #f59e0b;"></i> Path Guesser Complete! You found node <b>${this.targetValue}</b> with only ${this.errors} errors.`);
                    if (typeof GamificationSystem !== 'undefined') {
                        GamificationSystem.saveScore('bst', 'path_guesser', this.errors, 0);
                        ProgressSystem.complete('dsa', 'Binary Search Trees');
                    }
                    this.challengeActive = false;
                } else {
                    this.ui.updateStatus(`Correct! Next, click the next node along the search path for <b>${this.targetValue}</b>.`);
                }
            } else {
                // Incorrect
                clickedNode.challengeHighlight = 'incorrect';
                this.errors++;
                this.ui.updateStatus(`<i class="fas fa-times-circle" style="color: var(--danger);"></i> Incorrect! Think about the BST search property: search value ${this.targetValue} compared with ${expectedNode.value}.`);
            }
            this.engine.draw();
        }
    }

    startChallenge() {
        this.challengeActive = true;
        this.errors = 0;
        this.currentPathIndex = 0;

        // Reset and build a nice BST of 6 nodes
        this.root = null;
        const vals = [50, 30, 70, 20, 40, 60, 80];
        vals.forEach(v => this.insertNoSteps(v));

        // Select a leaf or child node as the target
        const leaves = [20, 40, 60, 80, 30, 70];
        this.targetValue = leaves[Math.floor(Math.random() * leaves.length)];

        // Compute correct search path from root to target
        this.targetPath = [];
        let curr = this.root;
        while (curr) {
            this.targetPath.push(curr);
            if (this.targetValue < curr.value) curr = curr.left;
            else if (this.targetValue > curr.value) curr = curr.right;
            else break;
        }

        // Reset challenge highlight
        const resetHighlights = (node) => {
            if (!node) return;
            node.challengeHighlight = null;
            resetHighlights(node.left);
            resetHighlights(node.right);
        };
        resetHighlights(this.root);

        this.ui.updateStatus(`<i class="fas fa-bullseye" style="color: var(--accent);"></i> BST Path Guesser! Guess the search path for value: <b>${this.targetValue}</b>.<br>Click nodes in the correct order starting from the ROOT.`);
        this.engine.draw();
    }

    stopChallenge() {
        this.challengeActive = false;
        this.reset();
        this.insert(50);
        this.insert(30);
        this.insert(70);
    }

    reset() {
        this.root = null;
        this.steps = [];
        this.currentStep = 0;
        this.engine.draw();
    }

    insertNoSteps(val) {
        const newNode = { value: val, left: null, right: null, x: 0, y: 0 };
        if (!this.root) {
            this.root = newNode;
        } else {
            this._insertNode(this.root, newNode);
        }
        this.layout();
    }

    insert(val) {
        this.steps = [];
        const newNode = { value: val, left: null, right: null, x: 0, y: 0 };
        
        if (!this.root) {
            this.root = newNode;
            this.steps.push({
                type: 'create',
                msg: `Root is empty. Creating root node with value ${val}.`,
                root: this.cloneTree(this.root),
                highlightVal: val
            });
        } else {
            this._insertStep(this.root, newNode);
        }
        
        this.steps.push({
            type: 'done',
            msg: `Successfully inserted node ${val}.`,
            root: this.cloneTree(this.root),
            highlightVal: null
        });

        this.currentStep = 0;
        this.layout();
    }

    _insertStep(node, newNode) {
        this.steps.push({
            type: 'compare',
            msg: `Comparing ${newNode.value} with node ${node.value}`,
            root: this.cloneTree(this.root),
            highlightVal: node.value
        });

        if (newNode.value < node.value) {
            if (!node.left) {
                node.left = newNode;
                this.steps.push({
                    type: 'create',
                    msg: `Value ${newNode.value} is smaller than ${node.value}. Inserting to the left.`,
                    root: this.cloneTree(this.root),
                    highlightVal: newNode.value
                });
            } else {
                this._insertStep(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
                this.steps.push({
                    type: 'create',
                    msg: `Value ${newNode.value} is greater than or equal to ${node.value}. Inserting to the right.`,
                    root: this.cloneTree(this.root),
                    highlightVal: newNode.value
                });
            } else {
                this._insertStep(node.right, newNode);
            }
        }
    }

    _insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) node.left = newNode;
            else this._insertNode(node.left, newNode);
        } else {
            if (!node.right) node.right = newNode;
            else this._insertNode(node.right, newNode);
        }
    }

    cloneTree(node) {
        if (!node) return null;
        return {
            value: node.value,
            left: this.cloneTree(node.left),
            right: this.cloneTree(node.right)
        };
    }

    layout() {
        if (!this.root) return;
        const canvasWidth = this.engine.canvas.width;
        this._computeLayout(this.root, canvasWidth / 2, 80, canvasWidth / 4);
        this.engine.draw();
    }

    _computeLayout(node, x, y, xOffset) {
        if (!node) return;
        node.x = x;
        node.y = y;
        if (node.left) this._computeLayout(node.left, x - xOffset, y + 80, xOffset / 2);
        if (node.right) this._computeLayout(node.right, x + xOffset, y + 80, xOffset / 2);
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        
        const step = this.steps[this.currentStep];
        this.ui.updateStatus(step.msg);
        
        // Render tree captured at this step
        this.root = this.cloneTree(step.root);
        this.layout();
        
        this.highlightedVal = step.highlightVal;

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }

    draw() {
        this._drawNode(this.root);
    }

    _drawNode(node) {
        if (!node) return;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        if (node.left) {
            this.engine.drawArrow(node.x, node.y, node.left.x, node.left.y);
            this._drawNode(node.left);
        }
        if (node.right) {
            this.engine.drawArrow(node.x, node.y, node.right.x, node.right.y);
            this._drawNode(node.right);
        }

        // Highlight coloring
        let isHighlighted = false;
        let colorOverride = null;

        if (this.challengeActive) {
            if (node.challengeHighlight === 'correct') {
                colorOverride = '#28a745'; // Green
                isHighlighted = true;
            } else if (node.challengeHighlight === 'incorrect') {
                colorOverride = '#dc3545'; // Red
                isHighlighted = true;
            }
        } else {
            if (node.value === this.highlightedVal) {
                isHighlighted = true;
            }
        }

        this.drawNodeCustom(node.x, node.y, node.value, isHighlighted, colorOverride);
    }

    drawNodeCustom(x, y, value, highlighted = false, colorOverride = null) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const ctx = this.engine.ctx;
        
        ctx.fillStyle = colorOverride ? colorOverride : (highlighted ? '#ffd700' : (isDark ? '#2d2d44' : '#fff'));
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = (highlighted || colorOverride) ? '#fff' : (isDark ? '#e0e0e0' : '#333');
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, x, y);
    }
}

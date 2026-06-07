/**
 * minimax.js - Minimax and Alpha-Beta implementation for tree search.
 */
class MinimaxAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = null;
        this.isAlphaBeta = false;
        this.steps = [];
        this.currentStep = 0;
    }

    generateTree(depth, branchFactor) {
        let nodeId = 1;
        const createNode = (d) => {
            const node = {
                id: nodeId++,
                value: null,
                children: [],
                depth: d,
                alpha: -Infinity,
                beta: Infinity,
                highlight: false,
                finalValue: null
            };
            if (d < depth) {
                for (let i = 0; i < branchFactor; i++) {
                    node.children.push(createNode(d + 1));
                }
            } else {
                node.value = Math.floor(Math.random() * 20) - 10;
            }
            return node;
        };
        this.root = createNode(0);
        this.layout();
    }

    layout() {
        if (!this.root) return;
        const canvasWidth = this.engine.canvas.width;
        const depthHeight = 80;

        const computePos = (node, x, y, width) => {
            node.x = x;
            node.y = y;
            const childWidth = width / node.children.length;
            node.children.forEach((child, i) => {
                computePos(child, x - width / 2 + childWidth * i + childWidth / 2, y + depthHeight, childWidth);
            });
        };
        computePos(this.root, canvasWidth / 2, 50, canvasWidth * 0.8);
        this.engine.draw();
    }

    run(isAlphaBeta) {
        this.isAlphaBeta = isAlphaBeta;
        this.steps = [];
        this._minimax(this.root, true, -Infinity, Infinity);
        this.currentStep = 0;
    }

    _minimax(node, isMaximizing, alpha, beta) {
        this.steps.push({ type: 'visit', node, alpha, beta });

        if (node.children.length === 0) {
            node.finalValue = node.value;
            this.steps.push({ type: 'return', node, value: node.value });
            return node.value;
        }

        if (isMaximizing) {
            let bestVal = -Infinity;
            for (let child of node.children) {
                const val = this._minimax(child, false, alpha, beta);
                bestVal = Math.max(bestVal, val);
                alpha = Math.max(alpha, bestVal);
                if (this.isAlphaBeta && beta <= alpha) {
                    this.steps.push({ type: 'prune', node: child, alpha, beta });
                    break;
                }
            }
            node.finalValue = bestVal;
            this.steps.push({ type: 'return', node, value: bestVal });
            return bestVal;
        } else {
            let bestVal = Infinity;
            for (let child of node.children) {
                const val = this._minimax(child, true, alpha, beta);
                bestVal = Math.min(bestVal, val);
                beta = Math.min(beta, bestVal);
                if (this.isAlphaBeta && beta <= alpha) {
                    this.steps.push({ type: 'prune', node: child, alpha, beta });
                    break;
                }
            }
            node.finalValue = bestVal;
            this.steps.push({ type: 'return', node, value: bestVal });
            return bestVal;
        }
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep++];
        this.engine.nodes.forEach(n => n.highlight = false);
        step.node.highlight = true;

        if (step.type === 'visit') {
            this.ui.updateStatus(`Visiting node ${step.node.id}. Alpha: ${step.alpha}, Beta: ${step.beta}`);
        } else if (step.type === 'return') {
            step.node.value = step.value;
            this.ui.updateStatus(`Node ${step.node.id} returned value ${step.value}`);
        } else if (step.type === 'prune') {
            this.ui.updateStatus(`PRUNING remaining branches under node ${step.node.id} becuase beta <= alpha`);
            this._prune(step.node);
        }

        this.engine.draw();
        return true;
    }

    _prune(node) {
        node.pruned = true;
        node.children.forEach(c => this._prune(c));
    }

    draw() {
        if (!this.root) return;
        this._drawConnections(this.root);
        this._drawNodes(this.root);
    }

    _drawConnections(node) {
        node.children.forEach(child => {
            if (node.pruned || child.pruned) {
                this.engine.ctx.setLineDash([5, 5]);
                this.engine.drawArrow(node.x, node.y, child.x, child.y);
                this.engine.ctx.setLineDash([]);
            } else {
                this.engine.drawArrow(node.x, node.y, child.x, child.y);
            }
            this._drawConnections(child);
        });
    }

    _drawNodes(node) {
        const color = node.highlight ? '#ff6b6b' : (node.pruned ? '#ccc' : '#fff');
        this.engine.drawNode(node.x, node.y, node.value !== null ? node.value : '?', node.highlight);
        node.children.forEach(child => this._drawNodes(child));
    }
}

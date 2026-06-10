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

    generateTree(depth = 3, branchFactor = 2) {
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
                pruned: false,
                guessPruned: false,
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
        const depthHeight = 110;

        const computePos = (node, x, y, width) => {
            node.x = x;
            node.y = y;
            if (node.children.length > 0) {
                const childWidth = width / node.children.length;
                node.children.forEach((child, i) => {
                    computePos(child, x - width / 2 + childWidth * i + childWidth / 2, y + depthHeight, childWidth);
                });
            }
        };
        computePos(this.root, canvasWidth / 2, 60, canvasWidth * 0.75);
        this.engine.draw();
    }

    getAllNodes() {
        const list = [];
        const traverse = (n) => {
            if (!n) return;
            list.push(n);
            n.children.forEach(traverse);
        };
        traverse(this.root);
        return list;
    }

    // Runs minimax internally for analysis (returns visited node count)
    analyzeTree(node, isMaximizing, usePruning, alpha, beta, visitedList = []) {
        if (!node) return 0;
        visitedList.push(node.id);

        if (node.children.length === 0) {
            return visitedList.length;
        }

        if (isMaximizing) {
            let bestVal = -Infinity;
            for (let child of node.children) {
                this.analyzeTree(child, false, usePruning, alpha, beta, visitedList);
                bestVal = Math.max(bestVal, child.value !== null ? child.value : 0);
                alpha = Math.max(alpha, bestVal);
                if (usePruning && beta <= alpha) {
                    break;
                }
            }
            return visitedList.length;
        } else {
            let bestVal = Infinity;
            for (let child of node.children) {
                this.analyzeTree(child, true, usePruning, alpha, beta, visitedList);
                bestVal = Math.min(bestVal, child.value !== null ? child.value : 0);
                beta = Math.min(beta, bestVal);
                if (usePruning && beta <= alpha) {
                    break;
                }
            }
            return visitedList.length;
        }
    }

    run(isAlphaBeta) {
        this.isAlphaBeta = isAlphaBeta;
        this.steps = [];
        
        // Reset node pruned states before running
        this.getAllNodes().forEach(n => {
            n.pruned = false;
            n.highlight = false;
            if (n.depth < 3) n.value = null; // Clear intermediate values
        });

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
                    // Find remaining children to prune
                    const idx = node.children.indexOf(child);
                    for (let j = idx + 1; j < node.children.length; j++) {
                        this.steps.push({ type: 'prune', node: node.children[j], alpha, beta });
                    }
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
                    const idx = node.children.indexOf(child);
                    for (let j = idx + 1; j < node.children.length; j++) {
                        this.steps.push({ type: 'prune', node: node.children[j], alpha, beta });
                    }
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
        this.getAllNodes().forEach(n => n.highlight = false);
        step.node.highlight = true;

        if (step.type === 'visit') {
            this.ui.updateStatus(`Visiting node ${step.node.id}. Alpha: ${step.alpha === -Infinity ? '-∞' : step.alpha}, Beta: ${step.beta === Infinity ? '∞' : step.beta}`);
        } else if (step.type === 'return') {
            step.node.value = step.value;
            this.ui.updateStatus(`Node ${step.node.id} evaluated. Selected value: ${step.value}`);
        } else if (step.type === 'prune') {
            this.ui.updateStatus(`PRUNED branch at node ${step.node.id} because beta <= alpha.`);
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
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        node.children.forEach(child => {
            const ctx = this.engine.ctx;
            if (node.pruned || child.pruned) {
                ctx.strokeStyle = '#555';
                ctx.setLineDash([4, 4]);
            } else if (node.guessPruned || child.guessPruned) {
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
                ctx.setLineDash([3, 3]);
            } else {
                ctx.strokeStyle = isDark ? '#666' : '#bbb';
                ctx.setLineDash([]);
            }
            this.engine.drawArrow(node.x, node.y, child.x, child.y);
            ctx.setLineDash([]);
            this._drawConnections(child);
        });
    }

    _drawNodes(node) {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const ctx = this.engine.ctx;
        
        let fillColor = isDark ? '#2d2d44' : '#fff';
        let strokeColor = '#4a90e2';
        let strokeWidth = 3;

        if (node.highlight) {
            fillColor = '#ff6b6b';
            strokeColor = '#ff4d4d';
        } else if (node.pruned) {
            fillColor = isDark ? '#1e1e2d' : '#e0e0e0';
            strokeColor = '#666';
        } else if (node.guessPruned) {
            fillColor = isDark ? '#1f1635' : '#f5eefd';
            strokeColor = '#a855f7';
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = node.highlight ? '#fff' : (isDark ? '#e0e0e0' : '#333');
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        
        const textVal = node.value !== null ? node.value : '?';
        ctx.fillText(textVal, node.x, node.y + 5);

        // Helper text for depths
        if (node.depth === 0) {
            ctx.fillStyle = 'rgba(120, 120, 150, 0.6)';
            ctx.font = 'bold 9px Arial';
            ctx.fillText("MAX (AI)", node.x, node.y - 28);
        } else if (node.depth === 1) {
            ctx.fillStyle = 'rgba(120, 120, 150, 0.6)';
            ctx.font = 'bold 9px Arial';
            ctx.fillText("MIN (OPP)", node.x, node.y - 28);
        } else if (node.depth === 2) {
            ctx.fillStyle = 'rgba(120, 120, 150, 0.6)';
            ctx.font = 'bold 9px Arial';
            ctx.fillText("MAX (AI)", node.x, node.y - 28);
        }

        node.children.forEach(child => this._drawNodes(child));
    }
}

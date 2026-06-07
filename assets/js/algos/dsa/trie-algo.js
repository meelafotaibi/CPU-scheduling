/**
 * trie-algo.js - Prefix Tree (Trie) implementation with step-by-step visualization.
 */
class TrieAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = { children: {}, isEndOfWord: false, char: '' };
        this.steps = [];
        this.currentStep = 0;
    }

    reset() {
        this.root = { children: {}, isEndOfWord: false, char: '' };
        this.steps = [];
        this.currentStep = 0;
        this.drawTrie();
    }

    insert(word) {
        this.steps = [];
        let node = this.root;
        this.steps.push({ type: 'start', word });

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            this.steps.push({ type: 'visit', char, path: word.substring(0, i + 1) });

            if (!node.children[char]) {
                node.children[char] = { children: {}, isEndOfWord: false, char };
                this.steps.push({ type: 'create', char, path: word.substring(0, i + 1) });
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        this.steps.push({ type: 'end', word });
    }

    drawTrie() {
        // We'll use a recursive drawing helper similar to Tree drawing
        const canvas = this.engine.canvas;
        const ctx = this.engine.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawNode = (node, x, y, levelWidth, depth, highlights = {}) => {
            const childrenKeys = Object.keys(node.children);
            const numChildren = childrenKeys.length;

            childrenKeys.forEach((key, i) => {
                const child = node.children[key];
                const cx = x - levelWidth / 2 + (i + 0.5) * (levelWidth / numChildren);
                const cy = y + 70;

                // Draw line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(cx, cy);
                ctx.strokeStyle = '#ddd';
                ctx.stroke();

                drawNode(child, cx, cy, levelWidth / numChildren, depth + 1, highlights);
            });

            // Draw current node
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);

            const isHighlighted = highlights.path && highlights.path === this.getPath(node);
            ctx.fillStyle = node.isEndOfWord ? '#28a745' : (isHighlighted ? '#ffd700' : '#fff');
            ctx.fill();
            ctx.strokeStyle = isHighlighted ? '#f39c12' : '#4a90e2';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = node.isEndOfWord || isHighlighted ? '#fff' : '#333';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.char || 'Root', x, y);
        };

        drawNode(this.root, canvas.width / 2, 50, canvas.width * 0.9, 0);
    }

    getPath(node) {
        // Simple path tracker (could be improved by adding parent refs)
        // For now, this is a placeholder as the engine drawing is simple
        return "";
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        const step = this.steps[this.currentStep];

        // Dynamic re-render logic here
        // For Trie, we might want a simpler Engine or custom drawing
        this.updateTrieDisplay(step);

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }

    updateTrieDisplay(step) {
        // Redraw with highlights based on step
        this.drawTrieWithHighlights(step);
        this.ui.updateStatus(this.getStepMessage(step));
    }

    getStepMessage(step) {
        switch (step.type) {
            case 'start': return `Starting insertion of "${step.word}"...`;
            case 'visit': return `Checking for character '${step.char}'...`;
            case 'create': return `Creating new node for '${step.char}'.`;
            case 'end': return `Word "${step.word}" fully inserted. Marked leaf as end-of-word.`;
            default: return "";
        }
    }

    drawTrieWithHighlights(step) {
        const canvas = this.engine.canvas;
        const ctx = this.engine.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawNode = (node, x, y, levelWidth, currentPath) => {
            const childrenKeys = Object.keys(node.children);
            const numChildren = childrenKeys.length;

            childrenKeys.forEach((key, i) => {
                const child = node.children[key];
                const cx = x - levelWidth / 2 + (i + 0.5) * (levelWidth / numChildren);
                const cy = y + 70;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(cx, cy);
                ctx.strokeStyle = '#ddd';
                ctx.stroke();

                drawNode(child, cx, cy, levelWidth / numChildren, currentPath + key);
            });

            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);

            let bgColor = '#fff';
            let textColor = '#333';

            if (node.isEndOfWord) {
                bgColor = '#28a745';
                textColor = '#fff';
            }

            if (step.path === currentPath || (step.word === currentPath && step.type === 'end')) {
                bgColor = '#ffd700';
                textColor = '#333';
            }

            ctx.fillStyle = bgColor;
            ctx.fill();
            ctx.strokeStyle = '#4a90e2';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = textColor;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.char || 'Root', x, y);
        };

        drawNode(this.root, canvas.width / 2, 50, canvas.width * 0.9, "");
    }
}

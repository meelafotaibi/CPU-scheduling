/**
 * trie-algo.js - Prefix Tree (Trie) implementation with step-by-step visualization and Path Tracer Game.
 */
class TrieAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.root = { children: {}, isEndOfWord: false, char: '' };
        this.steps = [];
        this.currentStep = 0;

        // Challenge Mode state
        this.challengeActive = false;
        this.targetWord = "";
        this.currentLetterIndex = 0;
        this.moves = 0;
        this.nodeCoords = {}; // { path: { x, y, node } }

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
        let clickedPath = null;
        for (let path in this.nodeCoords) {
            const node = this.nodeCoords[path];
            const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
            if (dist <= 22) { // Node radius is 20
                clickedPath = path;
                break;
            }
        }

        if (clickedPath) {
            const expectedPrefix = this.targetWord.substring(0, this.currentLetterIndex + 1);
            if (clickedPath === expectedPrefix) {
                // Correct letter!
                this.nodeCoords[clickedPath].challengeHighlight = 'correct';
                this.currentLetterIndex++;
                this.moves++;

                if (this.currentLetterIndex >= this.targetWord.length) {
                    this.ui.updateStatus(`👑 Word Spelled! You traced "${this.targetWord}" in the Trie correctly!`);
                    if (typeof GamificationSystem !== 'undefined') {
                        GamificationSystem.saveScore('trie', 'prefix_matcher', this.moves, this.targetWord.length);
                        ProgressSystem.complete('dsa', 'Trie Structure');
                    }
                    this.challengeActive = false;
                } else {
                    this.ui.updateStatus(`Correct! Next, find and click the node representing '${this.targetWord[this.currentLetterIndex]}'.`);
                }
            } else {
                this.nodeCoords[clickedPath].challengeHighlight = 'incorrect';
                this.ui.updateStatus(`❌ Incorrect prefix! We are tracing "${this.targetWord}" starting from root.`);
            }
            this.drawTrie();
        }
    }

    startChallenge() {
        this.challengeActive = true;
        this.currentLetterIndex = 0;
        this.moves = 0;

        // Reset and insert some default words
        this.root = { children: {}, isEndOfWord: false, char: '' };
        const words = ["CAT", "CAR", "BAT", "BAG", "TOY"];
        words.forEach(w => this.insertNoSteps(w));

        // Choose one word as the target
        this.targetWord = words[Math.floor(Math.random() * words.length)];

        // Clear previous highlights
        this.nodeCoords = {};
        this.ui.updateStatus(`🎯 Trie Path Tracer! Trace the word: <b>${this.targetWord}</b> in the Trie by clicking the letters from the root.`);
        this.drawTrie();
    }

    stopChallenge() {
        this.challengeActive = false;
        this.reset();
        this.insert("CAT");
        this.insert("CAR");
    }

    reset() {
        this.root = { children: {}, isEndOfWord: false, char: '' };
        this.steps = [];
        this.currentStep = 0;
        this.drawTrie();
    }

    insertNoSteps(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node.children[char]) {
                node.children[char] = { children: {}, isEndOfWord: false, char };
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    insert(word) {
        this.steps = [];
        let node = this.root;
        this.steps.push({ type: 'start', word, path: "", root: this.cloneTree(this.root) });

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const currentPath = word.substring(0, i + 1);

            if (!node.children[char]) {
                node.children[char] = { children: {}, isEndOfWord: false, char };
                this.steps.push({ 
                    type: 'create', 
                    char, 
                    path: currentPath, 
                    root: this.cloneTree(this.root) 
                });
            } else {
                this.steps.push({ 
                    type: 'visit', 
                    char, 
                    path: currentPath, 
                    root: this.cloneTree(this.root) 
                });
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        this.steps.push({ type: 'end', word, path: word, root: this.cloneTree(this.root) });
        this.currentStep = 0;
    }

    cloneTree(node) {
        if (!node) return null;
        const cloned = { children: {}, isEndOfWord: node.isEndOfWord, char: node.char };
        for (let key in node.children) {
            cloned.children[key] = this.cloneTree(node.children[key]);
        }
        return cloned;
    }

    drawTrie(displayRoot = this.root, step = {}) {
        const canvas = this.engine.canvas;
        const ctx = this.engine.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const rootToDraw = displayRoot || this.root;
        if (!rootToDraw) return;

        const isDark = document.body.getAttribute('data-theme') === 'dark';
        this.nodeCoords = {};

        const drawNode = (node, x, y, levelWidth, currentPath) => {
            this.nodeCoords[currentPath] = { x, y, node };

            const childrenKeys = Object.keys(node.children);
            const numChildren = childrenKeys.length;

            childrenKeys.forEach((key, i) => {
                const child = node.children[key];
                const cx = x - levelWidth / 2 + (i + 0.5) * (levelWidth / numChildren);
                const cy = y + 70;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(cx, cy);
                ctx.strokeStyle = isDark ? '#555' : '#ddd';
                ctx.lineWidth = 2;
                ctx.stroke();

                drawNode(child, cx, cy, levelWidth / numChildren, currentPath + key);
            });

            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);

            let bgColor = isDark ? '#2d2d44' : '#fff';
            let textColor = isDark ? '#e0e0e0' : '#333';

            if (node.isEndOfWord) {
                bgColor = '#28a745'; // Green
                textColor = '#fff';
            }

            // Normal highlights during stepping
            if (step.path === currentPath || (step.word === currentPath && step.type === 'end')) {
                bgColor = '#ffd700'; // Yellow
                textColor = '#333';
            }

            // Challenge mode highlights
            const challengeNodeInfo = this.nodeCoords[currentPath];
            if (this.challengeActive && challengeNodeInfo && challengeNodeInfo.challengeHighlight) {
                if (challengeNodeInfo.challengeHighlight === 'correct') {
                    bgColor = '#28a745';
                    textColor = '#fff';
                } else if (challengeNodeInfo.challengeHighlight === 'incorrect') {
                    bgColor = '#dc3545';
                    textColor = '#fff';
                }
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

        drawNode(rootToDraw, canvas.width / 2, 50, canvas.width * 0.9, "");
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        
        const step = this.steps[this.currentStep];
        this.ui.updateStatus(this.getStepMessage(step));
        
        // Redraw based on step state
        this.drawTrie(step.root, step);

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }

    getStepMessage(step) {
        switch (step.type) {
            case 'start': return `Starting insertion of "${step.word}"...`;
            case 'visit': return `Checking for character '${step.char}' in current prefix.`;
            case 'create': return `Creating new Trie node for character '${step.char}'.`;
            case 'end': return `Word "${step.word}" fully inserted. Marked end-of-word node.`;
            default: return "";
        }
    }
}

/**
 * heap-algo.js - Heap implementation (Max/Min) with step-by-step visualization and Heapify Bubble Game.
 */
class HeapAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.isMaxHeap = true;
        this.steps = [];
        this.currentStep = 0;

        // Challenge Mode state
        this.challengeActive = false;
        this.selectedIdx = null;
        this.moves = 0;
        this.optimalMoves = 0;

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

    computeNodeCoords() {
        const coords = {};
        const cw = this.engine.canvas.width;
        const rootX = cw / 2;
        const rootY = 60;
        const levelHeight = 70;
        const levelWidth = cw * 0.8;

        const traverse = (idx, x, y, width) => {
            if (idx >= this.engine.heap.length) return;
            coords[idx] = { x, y };
            traverse(2 * idx + 1, x - width / 4, y + levelHeight, width / 2);
            traverse(2 * idx + 2, x + width / 4, y + levelHeight, width / 2);
        };
        traverse(0, rootX, rootY, levelWidth);
        return coords;
    }

    handleCanvasClick(x, y) {
        const coords = this.computeNodeCoords();
        let clickedIdx = null;

        for (let idx in coords) {
            const node = coords[idx];
            const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
            if (dist <= 25) { // nodeRadius is 22
                clickedIdx = parseInt(idx);
                break;
            }
        }

        if (clickedIdx !== null) {
            if (this.selectedIdx === null) {
                this.selectedIdx = clickedIdx;
                this.engine.highlight(clickedIdx, 'compare');
                this.ui.updateStatus(`Selected index [${clickedIdx}] (${this.engine.heap[clickedIdx]}). Click another node to swap.`);
            } else {
                if (this.selectedIdx === clickedIdx) {
                    this.selectedIdx = null;
                    this.engine.clearHighlights();
                    this.ui.updateStatus(`Selection cancelled.`);
                } else {
                    // Check if adjacent in tree parent-child relation
                    const p1 = Math.floor((clickedIdx - 1) / 2);
                    const p2 = Math.floor((this.selectedIdx - 1) / 2);
                    
                    const isParentChild = (p1 === this.selectedIdx) || (p2 === clickedIdx);
                    if (!isParentChild) {
                        this.ui.updateStatus(`<i class="fas fa-times-circle" style="color: var(--danger);"></i> Swaps are only allowed between direct parent and child nodes!`);
                        this.selectedIdx = null;
                        this.engine.clearHighlights();
                        return;
                    }

                    // Swap
                    const temp = this.engine.heap[this.selectedIdx];
                    this.engine.heap[this.selectedIdx] = this.engine.heap[clickedIdx];
                    this.engine.heap[clickedIdx] = temp;

                    this.moves++;
                    this.selectedIdx = null;
                    this.engine.clearHighlights();
                    this.ui.updateStatus(`Swapped nodes! Checking heap properties...`);
                    this.checkChallengeWin();
                }
            }
        }
    }

    startChallenge() {
        this.challengeActive = true;
        this.selectedIdx = null;
        this.moves = 0;

        // Generate scrambled heap
        const size = 7;
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * 90) + 10);
        }

        // Intentionally scramble the array order so it violates heap property
        // Let's sort it reversed from the heap property
        if (this.isMaxHeap) {
            arr.sort((a, b) => a - b); // ascending = violates MaxHeap
        } else {
            arr.sort((a, b) => b - a); // descending = violates MinHeap
        }

        this.engine.setHeap(arr);
        this.optimalMoves = this.calculateOptimalHeapifySwaps([...arr]);

        this.ui.updateStatus(`<i class="fas fa-crosshairs" style="color: var(--primary);"></i> Heapify Challenge! Swap violating nodes to restore the ${this.isMaxHeap ? 'Max Heap' : 'Min Heap'} property.<br>Click a node to select, then click its parent/child to swap. goal: restore heap!`);
    }

    stopChallenge() {
        this.challengeActive = false;
        this.selectedIdx = null;
        this.ui.updateStatus(`Exited Challenge Mode.`);
    }

    calculateOptimalHeapifySwaps(arr) {
        let swaps = 0;
        const heapify = (i) => {
            let extreme = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;

            if (l < arr.length) {
                const condL = this.isMaxHeap ? (arr[l] > arr[extreme]) : (arr[l] < arr[extreme]);
                if (condL) extreme = l;
            }
            if (r < arr.length) {
                const condR = this.isMaxHeap ? (arr[r] > arr[extreme]) : (arr[r] < arr[extreme]);
                if (condR) extreme = r;
            }
            if (extreme !== i) {
                [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
                swaps++;
                heapify(extreme);
            }
        };

        // Run heapify bottom-up
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            heapify(i);
        }
        return swaps;
    }

    checkChallengeWin() {
        let isCorrect = true;
        const arr = this.engine.heap;
        for (let i = 0; i < arr.length; i++) {
            let l = 2 * i + 1;
            let r = 2 * i + 2;
            if (l < arr.length) {
                const violates = this.isMaxHeap ? (arr[l] > arr[i]) : (arr[l] < arr[i]);
                if (violates) isCorrect = false;
            }
            if (r < arr.length) {
                const violates = this.isMaxHeap ? (arr[r] > arr[i]) : (arr[r] < arr[i]);
                if (violates) isCorrect = false;
            }
        }

        if (isCorrect) {
            this.ui.updateStatus(`<i class="fas fa-crown" style="color: #f59e0b;"></i> Heap restored in <b>${this.moves} swaps</b> (Optimal: ${this.optimalMoves})!`);
            if (typeof GamificationSystem !== 'undefined') {
                GamificationSystem.saveScore('heap', 'heapify_bubble', this.moves, this.optimalMoves);
                ProgressSystem.complete('dsa', 'Binary Heaps');
            }
            this.challengeActive = false;
            // Highlight everything green
            for (let i = 0; i < arr.length; i++) {
                this.engine.highlight(i, 'sorted');
            }
        } else {
            this.ui.updateStatus(`Heap property not satisfied yet. Swaps: ${this.moves}. Keep bubble swapping!`);
        }
    }

    reset() {
        this.engine.clearHighlights();
        this.steps = [];
        this.currentStep = 0;
    }

    setMode(isMax) {
        this.isMaxHeap = isMax;
        if (this.challengeActive) {
            this.startChallenge();
        } else {
            this.reset();
        }
    }

    // Insert with step recording
    insert(val) {
        this.reset();
        const arr = [...this.engine.heap];
        arr.push(val);
        this.steps.push({ type: 'add', arr: [...arr], index: arr.length - 1 });

        let i = arr.length - 1;
        while (i > 0) {
            let p = Math.floor((i - 1) / 2);
            this.steps.push({ type: 'compare', i, p, arr: [...arr] });

            const condition = this.isMaxHeap ? (arr[i] > arr[p]) : (arr[i] < arr[p]);
            if (condition) {
                [arr[i], arr[p]] = [arr[p], arr[i]];
                this.steps.push({ type: 'swap', i, p, arr: [...arr] });
                i = p;
            } else break;
        }
        this.steps.push({ type: 'done', arr: [...arr] });
    }

    // Extract with step recording
    extract() {
        if (this.engine.heap.length === 0) return;
        this.reset();
        const arr = [...this.engine.heap];

        this.steps.push({ type: 'highlight', index: 0, status: 'swap', arr: [...arr] });
        const last = arr.pop();
        if (arr.length > 0) {
            arr[0] = last;
            this.steps.push({ type: 'replace', arr: [...arr] });
            this.heapify(arr, 0);
        } else {
            this.steps.push({ type: 'done', arr: [] });
        }
    }

    heapify(arr, i) {
        let extreme = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < arr.length) {
            this.steps.push({ type: 'compare', i: extreme, p: l, arr: [...arr] });
            const condL = this.isMaxHeap ? (arr[l] > arr[extreme]) : (arr[l] < arr[extreme]);
            if (condL) extreme = l;
        }

        if (r < arr.length) {
            this.steps.push({ type: 'compare', i: extreme, p: r, arr: [...arr] });
            const condR = this.isMaxHeap ? (arr[r] > arr[extreme]) : (arr[r] < arr[extreme]);
            if (condR) extreme = r;
        }

        if (extreme !== i) {
            [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
            this.steps.push({ type: 'swap', i, p: extreme, arr: [...arr] });
            this.heapify(arr, extreme);
        } else {
            this.steps.push({ type: 'done', arr: [...arr] });
        }
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep];
        this.engine.setHeap(step.arr);
        this.engine.clearHighlights();

        if (step.type === 'compare') {
            this.engine.highlight([step.i, step.p], 'compare');
            this.ui.updateStatus(`Comparing parent index ${step.p} and child index ${step.i}`);
        } else if (step.type === 'swap') {
            this.engine.highlight([step.i, step.p], 'swap');
            this.ui.updateStatus(`Swapping violating parent and child at ${step.p} and ${step.i}`);
        } else if (step.type === 'add') {
            this.engine.highlight(step.index, 'sorted');
            this.ui.updateStatus(`Inserted new value ${step.arr[step.index]} at the end.`);
        } else if (step.type === 'replace') {
            this.engine.highlight(0, 'compare');
            this.ui.updateStatus(`Moved last element to the root. Starting Heapify...`);
        } else if (step.type === 'done') {
            this.ui.updateStatus(`Heap property restored.`);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}

/**
 * heap-algo.js - Heap implementation (Max/Min) with step-by-step visualization.
 */
class HeapAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.isMaxHeap = true;
        this.steps = [];
        this.currentStep = 0;
    }

    reset() {
        this.engine.clearHighlights();
        this.steps = [];
        this.currentStep = 0;
    }

    setMode(isMax) {
        this.isMaxHeap = isMax;
        this.reset();
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
            this.ui.updateStatus(`Comparing index ${step.i} and ${step.p}`);
        } else if (step.type === 'swap') {
            this.engine.highlight([step.i, step.p], 'swap');
            this.ui.updateStatus(`Swapping values at ${step.i} and ${step.p}`);
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

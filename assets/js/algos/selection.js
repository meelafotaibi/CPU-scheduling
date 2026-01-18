/**
 * selection.js - Selection Sort implementation.
 */
class SelectionSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.i = 0;
        this.j = 0;
        this.minIdx = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = 0;
    }

    reset() {
        this.i = 0;
        this.j = 0;
        this.minIdx = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = this.engine.array.length;
        this.engine.clearHighlights();
        this.ui.updateStats(0, 0);
        this.ui.updateStatus("Ready to sort with Selection Sort.");
    }

    async nextStep() {
        if (this.complete) return false;
        const arr = this.engine.array;

        if (this.j === 0) {
            this.minIdx = this.i;
            this.j = this.i + 1;
            this.ui.updateStatus(`Starting pass ${this.i + 1}. Current min is index ${this.minIdx} (${arr[this.minIdx]})`);
            this.engine.clearHighlights();
            this.engine.highlight(this.minIdx, 'pivot');
            return true;
        }

        if (this.j < this.n) {
            this.engine.clearHighlights();
            // Keep sorted part green
            for (let k = 0; k < this.i; k++) this.engine.highlight(k, 'sorted');
            this.engine.highlight(this.minIdx, 'pivot');
            this.engine.highlight(this.j, 'compare');

            this.comparisons++;
            this.ui.updateStats(this.comparisons, this.swaps);
            this.ui.updateStatus(`Comparing ${arr[this.j]} with current min ${arr[this.minIdx]}`);

            if (arr[this.j] < arr[this.minIdx]) {
                this.minIdx = this.j;
                this.ui.updateStatus(`New min found: ${arr[this.minIdx]} at index ${this.minIdx}`);
            }
            this.j++;
            return true;
        } else {
            // Swap min with i
            if (this.minIdx !== this.i) {
                this.engine.highlight([this.i, this.minIdx], 'swap');
                this.ui.updateStatus(`Swapping index ${this.i} and index ${this.minIdx}`);
                this.swaps++;
                this.ui.updateStats(this.comparisons, this.swaps);
                await new Promise(r => setTimeout(r, 200));
                this.engine.swap(this.i, this.minIdx);
            }
            this.i++;
            this.j = 0;

            if (this.i >= this.n - 1) {
                this.complete = true;
                for (let k = 0; k < this.n; k++) this.engine.highlight(k, 'sorted');
                this.ui.updateStatus("Selection Sort Complete!");
                return false;
            }
            return true;
        }
    }
}

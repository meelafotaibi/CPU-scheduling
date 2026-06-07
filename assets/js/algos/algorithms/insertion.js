/**
 * insertion.js - Insertion Sort implementation.
 */
class InsertionSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.i = 1;
        this.j = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = 0;
        this.currentVal = null;
    }

    reset() {
        this.i = 1;
        this.j = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = this.engine.array.length;
        this.currentVal = null;
        this.engine.clearHighlights();
        this.ui.updateStats(0, 0);
        this.ui.updateStatus("Ready to sort with Insertion Sort.");
    }

    async nextStep() {
        if (this.complete) return false;
        const arr = this.engine.array;

        if (this.currentVal === null) {
            this.currentVal = arr[this.i];
            this.j = this.i - 1;
            this.ui.updateStatus(`Inserting ${this.currentVal} into the sorted sub-array.`);
            this.engine.clearHighlights();
            this.engine.highlight(this.i, 'pivot');
            return true;
        }

        if (this.j >= 0) {
            this.comparisons++;
            this.ui.updateStats(this.comparisons, this.swaps);
            this.engine.clearHighlights();
            this.engine.highlight(this.j, 'compare');
            this.engine.highlight(this.j + 1, 'pivot');

            if (arr[this.j] > this.currentVal) {
                this.ui.updateStatus(`${arr[this.j]} > ${this.currentVal}, moving ${arr[this.j]} to the right.`);
                this.swaps++;
                this.ui.updateStats(this.comparisons, this.swaps);
                await new Promise(r => setTimeout(r, 100));
                arr[this.j + 1] = arr[this.j];
                this.engine.draw();
                this.j--;
                return true;
            } else {
                this.ui.updateStatus(`${arr[this.j]} <= ${this.currentVal}, insertion point found.`);
            }
        }

        // Place currentVal
        arr[this.j + 1] = this.currentVal;
        this.engine.draw();
        this.i++;
        this.currentVal = null;

        if (this.i >= this.n) {
            this.complete = true;
            for (let k = 0; k < this.n; k++) this.engine.highlight(k, 'sorted');
            this.ui.updateStatus("Insertion Sort Complete!");
            return false;
        }
        return true;
    }
}

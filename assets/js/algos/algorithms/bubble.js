/**
 * bubble.js - Bubble Sort implementation integrated with ArrayEngine.
 */
class BubbleSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateStats

        this.i = 0;
        this.j = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = 0;
    }

    reset() {
        this.i = 0;
        this.j = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = this.engine.array.length;
        this.engine.clearHighlights();
        this.ui.updateStats(0, 0);
        this.ui.updateStatus("Ready to sort.");
        if (window.complexityTracker) {
            window.complexityTracker.reset();
            window.complexityTracker.setComplexity("O(n²)", "O(1)");
        }
    }

    async nextStep() {
        if (this.complete) return false;

        const arr = this.engine.array;

        // Current pair indices
        const idx1 = this.j;
        const idx2 = this.j + 1;

        this.engine.clearHighlights();
        this.engine.highlight([idx1, idx2], 'compare');
        this.comparisons++;
        this.ui.updateStats(this.comparisons, this.swaps);
        if (window.complexityTracker) window.complexityTracker.increment('comparisons');
        this.ui.updateStatus(`Comparing indices ${idx1} and ${idx2}: ${arr[idx1]} vs ${arr[idx2]}`);

        // Compare
        if (arr[idx1] > arr[idx2]) {
            this.engine.highlight([idx1, idx2], 'swap');
            this.ui.updateStatus(`Swapping ${arr[idx1]} and ${arr[idx2]}`);
            this.swaps++;
            this.ui.updateStats(this.comparisons, this.swaps);
            if (window.complexityTracker) window.complexityTracker.increment('swaps');

            // Artificial delay for swap awareness
            await new Promise(r => setTimeout(r, 200));
            this.engine.swap(idx1, idx2);
        }

        // Increment J
        this.j++;
        if (this.j >= this.n - this.i - 1) {
            this.j = 0;
            this.i++;
            // Highlight sorted elements at the end
            for (let k = this.n - this.i; k < this.n; k++) {
                this.engine.highlight(k, 'sorted');
            }
        }

        // Check completion
        if (this.i >= this.n - 1) {
            this.complete = true;
            for (let k = 0; k < this.n; k++) this.engine.highlight(k, 'sorted');
            this.ui.updateStatus("Sorting Complete!");
            return false;
        }

        return true;
    }
}

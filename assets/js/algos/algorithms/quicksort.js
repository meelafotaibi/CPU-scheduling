/**
 * quicksort.js - Quick Sort implementation (Iterative for visualization).
 */
class QuickSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.stack = [];
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.state = 'partition_start';
        this.low = 0;
        this.high = 0;
        this.pivot = 0;
        this.i = 0;
        this.j = 0;
    }

    reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.stack = [[0, this.engine.array.length - 1]];
        this.state = 'partition_start';
        this.engine.clearHighlights();
        this.ui.updateStats(0, 0);
        this.ui.updateStatus("Ready for Quick Sort.");
    }

    async nextStep() {
        if (this.complete) return false;
        const arr = this.engine.array;

        if (this.state === 'partition_start') {
            if (this.stack.length === 0) {
                this.complete = true;
                for (let k = 0; k < arr.length; k++) this.engine.highlight(k, 'sorted');
                this.ui.updateStatus("Quick Sort Complete!");
                return false;
            }
            [this.low, this.high] = this.stack.pop();
            if (this.low < this.high) {
                this.pivot = arr[this.high];
                this.i = this.low - 1;
                this.j = this.low;
                this.state = 'partitioning';
                this.ui.updateStatus(`New partition: ${this.low} to ${this.high}. Pivot: ${this.pivot}`);
                this.engine.clearHighlights();
                this.engine.highlight(this.high, 'pivot');
                return true;
            } else {
                if (this.low >= 0 && this.low < arr.length) this.engine.highlight(this.low, 'sorted');
                return this.nextStep();
            }
        }

        if (this.state === 'partitioning') {
            if (this.j < this.high) {
                this.engine.clearHighlights();
                this.engine.highlight(this.high, 'pivot');
                this.engine.highlight(this.j, 'compare');
                this.comparisons++;
                this.ui.updateStats(this.comparisons, this.swaps);
                this.ui.updateStatus(`Comparing ${arr[this.j]} with pivot ${this.pivot}`);

                if (arr[this.j] < this.pivot) {
                    this.i++;
                    this.swaps++;
                    this.ui.updateStats(this.comparisons, this.swaps);
                    this.engine.highlight([this.i, this.j], 'swap');
                    await new Promise(r => setTimeout(r, 100));
                    this.engine.swap(this.i, this.j);
                }
                this.j++;
                return true;
            } else {
                this.i++;
                this.engine.highlight([this.i, this.high], 'swap');
                this.ui.updateStatus(`Placing pivot ${this.pivot} at index ${this.i}`);
                this.swaps++;
                this.ui.updateStats(this.comparisons, this.swaps);
                await new Promise(r => setTimeout(r, 200));
                this.engine.swap(this.i, this.high);

                // Push right and left sub-arrays to stack
                this.stack.push([this.i + 1, this.high]);
                this.stack.push([this.low, this.i - 1]);
                this.engine.highlight(this.i, 'sorted');
                this.state = 'partition_start';
                return true;
            }
        }
        return false;
    }
}

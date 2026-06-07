/**
 * binary-search.js - Binary Search implementation integrated with ArrayEngine.
 */
class BinarySearchAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateStats

        this.low = 0;
        this.high = 0;
        this.mid = 0;
        this.target = null;
        this.complete = false;
        this.found = false;
    }

    reset() {
        this.low = 0;
        this.high = this.engine.array.length - 1;
        this.complete = false;
        this.found = false;
        this.engine.clearHighlights();
        this.ui.updateStatus("Ready to search (Array must be sorted).");
    }

    setTarget(val) {
        this.target = val;
        this.reset();
    }

    async nextStep() {
        if (this.complete || this.target === null) return false;

        if (this.low > this.high) {
            this.complete = true;
            this.ui.updateStatus(`Target ${this.target} not found.`);
            return false;
        }

        this.mid = Math.floor((this.low + this.high) / 2);
        const arr = this.engine.array;

        this.engine.clearHighlights();
        // Highlight range
        for (let i = this.low; i <= this.high; i++) {
            this.engine.highlight(i, 'default');
        }

        this.engine.highlight(this.mid, 'compare');
        this.ui.updateStatus(`Checking middle index ${this.mid}: ${arr[this.mid]}`);

        if (arr[this.mid] === this.target) {
            this.engine.highlight(this.mid, 'sorted');
            this.ui.updateStatus(`Found ${this.target} at index ${this.mid}!`);
            this.complete = true;
            this.found = true;
            return false;
        }

        if (arr[this.mid] < this.target) {
            this.ui.updateStatus(`${arr[this.mid]} < ${this.target}. Searching right half.`);
            this.low = this.mid + 1;
        } else {
            this.ui.updateStatus(`${arr[this.mid]} > ${this.target}. Searching left half.`);
            this.high = this.mid - 1;
        }

        return true;
    }
}

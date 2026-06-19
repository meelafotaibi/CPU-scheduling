/**
 * linear-search.js - Linear Search implementation integrated with ArrayEngine.
 */
class LinearSearchAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // updateStatus, updateStats

        this.index = 0;
        this.target = null;
        this.complete = false;
        this.found = false;
    }

    reset() {
        this.index = 0;
        this.complete = false;
        this.found = false;
        this.engine.clearHighlights();
        this.ui.updateStatus("Ready to search.");
    }

    setTarget(val) {
        this.target = val;
        this.reset();
    }

    async nextStep() {
        if (this.complete || this.target === null) return false;

        const arr = this.engine.array;
        this.engine.clearHighlights();

        if (this.index >= arr.length) {
            this.complete = true;
            this.ui.updateStatus(`Target ${this.target} not found.`);
            return false;
        }

        this.engine.highlight(this.index, 'compare');
        this.ui.updateStatus(`Checking index ${this.index}: ${arr[this.index]}`);

        if (arr[this.index] === this.target) {
            this.engine.highlight(this.index, 'sorted');
            this.ui.updateStatus(`Found ${this.target} at index ${this.index}!`);
            this.complete = true;
            this.found = true;
            return false;
        }

        this.index++;
        return true;
    }
}

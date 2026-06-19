/**
 * mergesort.js - Merge Sort implementation (Iterative Buffer approach for visualization).
 */
class MergeSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.currSize = 1;
        this.leftStart = 0;
        this.comparisons = 0;
        this.swaps = 0; // In merge sort, we count assignments as swaps for stats
        this.complete = false;
        this.n = 0;
        this.state = 'merging';
    }

    reset() {
        this.currSize = 1;
        this.leftStart = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.complete = false;
        this.n = this.engine.array.length;
        this.engine.clearHighlights();
        this.ui.updateStats(0, 0);
        this.ui.updateStatus("Ready for Merge Sort.");
    }

    async nextStep() {
        if (this.complete) return false;
        const arr = this.engine.array;

        if (this.currSize < this.n) {
            if (this.leftStart < this.n - 1) {
                const mid = Math.min(this.leftStart + this.currSize - 1, this.n - 1);
                const rightEnd = Math.min(this.leftStart + 2 * this.currSize - 1, this.n - 1);

                this.ui.updateStatus(`Merging segments: [${this.leftStart}-${mid}] and [${mid + 1}-${rightEnd}]`);
                await this.merge(arr, this.leftStart, mid, rightEnd);

                this.leftStart += 2 * this.currSize;
                return true;
            } else {
                this.leftStart = 0;
                this.currSize *= 2;
                if (this.currSize >= this.n) {
                    this.complete = true;
                    for (let k = 0; k < this.n; k++) this.engine.highlight(k, 'sorted');
                    this.ui.updateStatus("Merge Sort Complete!");
                    return false;
                }
                return this.nextStep();
            }
        }
        return false;
    }

    async merge(arr, l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;
        const L = [], R = [];

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            this.engine.clearHighlights();
            this.engine.highlight([l + i, m + 1 + j], 'compare');
            this.comparisons++;
            this.ui.updateStats(this.comparisons, this.swaps);

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            this.swaps++;
            this.engine.highlight(k, 'swap');
            this.engine.draw();
            await new Promise(res => setTimeout(res, 100));
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            this.swaps++;
            this.engine.highlight(k, 'swap');
            this.engine.draw();
            await new Promise(res => setTimeout(res, 50));
            i++; k++;
        }
        while (j < n2) {
            arr[k] = R[j];
            this.swaps++;
            this.engine.highlight(k, 'swap');
            this.engine.draw();
            await new Promise(res => setTimeout(res, 50));
            j++; k++;
        }
    }
}

/**
 * page-replacement.js
 * Implements FIFO, LRU, and Optimal algorithms with step-by-step playback.
 */
class PageReplacementAlgo {
    constructor(playback, ui) {
        this.playback = playback;
        this.ui = ui; // { updateStatus, renderFrame, updateStats }
        this.frames = [];
        this.refString = [];
        this.capacity = 3;
        this.algoType = 'FIFO';

        this.currentIndex = 0;
        this.hits = 0;
        this.faults = 0;
        this.history = []; // For LRU
        this.steps = []; // Pre-calculated steps
    }

    reset() {
        this.currentIndex = 0;
        this.hits = 0;
        this.faults = 0;
        this.history = [];
        this.frames = [];
        this.ui.updateStats(0, 0, 0);
        this.ui.clearDisplay();
        this.ui.updateStatus("Ready. Click Play to start.");
    }

    init(algoType, capacity, refStringStr) {
        this.algoType = algoType;
        this.capacity = capacity;
        this.refString = refStringStr.split(',').map(s => s.trim());
        this.reset();

        // Pre-calculate steps for deterministic playback
        this.calculateSteps();
    }

    calculateSteps() {
        let tempFrames = [];
        let tempHistory = [];
        let tempHits = 0;
        let tempFaults = 0;

        this.steps = this.refString.map((page, idx) => {
            let hit = tempFrames.includes(page);
            let actionStr = "";

            if (!hit) {
                tempFaults++;
                actionStr = "Miss";

                if (tempFrames.length < this.capacity) {
                    tempFrames.push(page);
                    actionStr += " (Fill)";
                } else {
                    let victim = -1;
                    if (this.algoType === 'FIFO') {
                        victim = tempFrames.shift();
                        actionStr += ` (Evict ${victim})`;
                    } else if (this.algoType === 'LRU') {
                        const lru = tempFrames.reduce((min, f) => tempHistory.lastIndexOf(f) < tempHistory.lastIndexOf(min) ? f : min);
                        victim = lru;
                        tempFrames.splice(tempFrames.indexOf(lru), 1);
                        actionStr += ` (Evict ${victim})`;
                    } else if (this.algoType === 'Optimal') {
                        const future = this.refString.slice(idx + 1);
                        const opt = tempFrames.reduce((max, f) => {
                            const nextUse = future.indexOf(f);
                            const maxNextUse = future.indexOf(max);
                            return (nextUse === -1 || nextUse > maxNextUse) ? f : max;
                        });
                        victim = opt;
                        tempFrames.splice(tempFrames.indexOf(opt), 1);
                        actionStr += ` (Evict ${victim})`;
                    }
                    tempFrames.push(page);
                }
            } else {
                tempHits++;
                actionStr = "Hit";
            }
            tempHistory.push(page);

            return {
                page,
                frames: [...tempFrames],
                hit,
                hits: tempHits,
                faults: tempFaults,
                action: actionStr
            };
        });
    }

    async nextStep() {
        if (this.currentIndex >= this.steps.length) {
            this.ui.updateStatus("Simulation Complete.");
            return false;
        }

        const step = this.steps[this.currentIndex];

        // Render current step
        this.ui.renderStep(step, this.capacity);
        this.ui.updateStats(step.hits, step.faults, this.refString.length);
        this.ui.updateStatus(`Step ${this.currentIndex + 1}: Page ${step.page} -> ${step.action}`);

        this.currentIndex++;
        return true;
    }
}

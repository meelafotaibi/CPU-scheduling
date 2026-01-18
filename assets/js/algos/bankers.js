/**
 * bankers.js
 * Implementation of Banker's Algorithm for Deadlock Avoidance.
 */

class BankersAlgo {
    constructor(canvasId) {
        // Mock canvas context if needed, but mostly DOM based table updates
        this.processes = 5;
        this.resources = 3;

        // Initial State (Default Example)
        this.allocation = [
            [0, 1, 0], // P0
            [2, 0, 0], // P1
            [3, 0, 2], // P2
            [2, 1, 1], // P3
            [0, 0, 2]  // P4
        ];

        this.max = [
            [7, 5, 3],
            [3, 2, 2],
            [9, 0, 2],
            [2, 2, 2],
            [4, 3, 3]
        ];

        this.available = [3, 3, 2];
        this.need = [];
        this.safeSeq = [];
        this.steps = [];
        this.currentStep = 0;

        this.calcNeed();
    }

    calcNeed() {
        this.need = [];
        for (let i = 0; i < this.processes; i++) {
            let row = [];
            for (let j = 0; j < this.resources; j++) {
                row.push(this.max[i][j] - this.allocation[i][j]);
            }
            this.need.push(row);
        }
    }

    calculateSafety() {
        this.steps = [];
        let work = [...this.available];
        let finish = new Array(this.processes).fill(false);
        let safeSeq = [];
        let log = [];

        let count = 0;
        while (count < this.processes) {
            let found = false;
            for (let p = 0; p < this.processes; p++) {
                if (finish[p] === false) {
                    let j;
                    for (j = 0; j < this.resources; j++) {
                        if (this.need[p][j] > work[j]) break;
                    }

                    if (j === this.resources) {
                        // Found a safe process
                        for (let k = 0; k < this.resources; k++) work[k] += this.allocation[p][k];
                        safeSeq.push(p);
                        finish[p] = true;
                        found = true;
                        count++;

                        this.steps.push({
                            type: 'safe',
                            pid: p,
                            work: [...work], // state after allocation
                            msg: `Process P${p} execution safe. New Available: [${work.join(', ')}]`
                        });
                    }
                }
            }

            if (found === false) {
                this.steps.push({
                    type: 'deadlock',
                    msg: "System is not in a safe state! Deadlock detected."
                });
                return false;
            }
        }

        this.safeSequence = safeSeq;
        this.steps.push({
            type: 'final',
            msg: `System is in SAFE STATE. Sequence: P${safeSeq.join(' -> P')}`
        });
        return true;
    }

    reset() {
        // Reset to default
        this.currentStep = 0;
        this.available = [3, 3, 2];
        // Re-init finishes handled by calculateSafety
    }
}

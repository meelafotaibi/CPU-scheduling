/**
 * recursion-tree.js - Recursive algorithm implementations with step-by-step tree growth.
 */
class RecursionTreeAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;

        this.steps = []; // Queue of actions to perform
        this.isRunning = false;
    }

    reset() {
        this.engine.reset();
        this.steps = [];
        this.isRunning = false;
        this.ui.updateStatus("Ready. Set N and click Start.");
    }

    // Fibonacci(n) with step recording
    generateFibSteps(n) {
        this.steps = [];
        const record = (num, parentId = null) => {
            const id = this.steps.length;
            this.steps.push({ type: 'add', label: `F(${num})`, value: num, parentId });

            if (num <= 1) {
                this.steps.push({ type: 'done', id, result: num });
                return num;
            }

            const left = record(num - 1, id);
            const right = record(num - 2, id);
            const res = left + right;

            this.steps.push({ type: 'done', id, result: res });
            return res;
        };
        record(n);
        this.currentStep = 0;
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep];
        if (step.type === 'add') {
            const actualId = this.engine.addNode(step.label, undefined, step.parentId);
            step.actualId = actualId; // Store for 'done' step
            this.ui.updateStatus(`Calling ${step.label}...`);
        } else if (step.type === 'done') {
            // Find the original 'add' step to get the actual engine ID
            const addStep = this.steps.find(s => s.type === 'add' && s.label === `F(${step.result === 0 || step.result === 1 ? step.result : '?'})`);
            // Better logic: store ID mapping
            const originalAdd = this.steps[step.id];
            this.engine.updateNodeStatus(originalAdd.actualId, 'done');
            this.engine.nodes[originalAdd.actualId].value = step.result;
            this.ui.updateStatus(`${originalAdd.label} returned ${step.result}`);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}

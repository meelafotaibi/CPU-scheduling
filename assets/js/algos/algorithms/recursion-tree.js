/**
 * recursion-tree.js - Recursive Fibonacci visualization with step-by-step tree growth.
 * Uses RecursionEngine (recursion-engine.js) - NOT GraphEngine.
 */
class RecursionTreeAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine; // RecursionEngine instance
        this.playback = playback;
        this.ui = ui; // { updateStatus }

        this.steps = [];    // Recorded actions
        this.currentStep = 0;
        this.idMap = {};    // Map from step index → actual engine node id
    }

    reset() {
        this.engine.reset();
        this.steps = [];
        this.currentStep = 0;
        this.idMap = {};
        this.ui.updateStatus("Ready. Set N and click Start Fibonacci.");
    }

    // Record all steps for Fibonacci(n) before animation
    generateFibSteps(n) {
        this.steps = [];
        this.idMap = {};
        let stepCounter = 0;

        const record = (num, parentStepId = null) => {
            const myStepId = stepCounter++;
            this.steps.push({ type: 'call', stepId: myStepId, n: num, parentStepId });

            if (num <= 1) {
                this.steps.push({ type: 'done', stepId: myStepId, result: num });
                return num;
            }

            const left = record(num - 1, myStepId);
            const right = record(num - 2, myStepId);
            const res = left + right;

            this.steps.push({ type: 'done', stepId: myStepId, result: res });
            return res;
        };

        record(n);
        this.currentStep = 0;
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep];

        if (step.type === 'call') {
            // Get actual engine ID for the parent (if any)
            const parentEngineId = step.parentStepId !== null ? this.idMap[step.parentStepId] : null;
            // Add node to RecursionEngine
            const engineId = this.engine.addNode(`F(${step.n})`, undefined, parentEngineId);
            this.idMap[step.stepId] = engineId;
            this.ui.updateStatus(`Calling F(${step.n})...`);
        } else if (step.type === 'done') {
            const engineId = this.idMap[step.stepId];
            if (engineId !== undefined) {
                // Update value and mark done
                this.engine.nodes[engineId].value = step.result;
                this.engine.updateNodeStatus(engineId, 'done');
            }
            this.ui.updateStatus(`F returned ${step.result}`);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}

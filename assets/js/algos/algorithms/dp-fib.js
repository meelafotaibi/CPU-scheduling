/**
 * dp-fib.js - Fibonacci visualization (Memoization vs Tabulation).
 */
class DPFibAlgo {
    constructor(engine, ui) {
        this.engine = engine; // Custom engine for tables/grids
        this.ui = ui;
        this.steps = [];
        this.currentStep = 0;
        this.mode = 'memo'; // 'memo' or 'tab'
    }

    reset() {
        this.steps = [];
        this.currentStep = 0;
        this.ui.updateStatus(`Ready for ${this.mode === 'memo' ? 'Memoization' : 'Tabulation'}. Click Start.`);
    }

    generateMemoSteps(n) {
        this.steps = [];
        const memo = {};
        const run = (num) => {
            const id = this.steps.length;
            this.steps.push({ type: 'call', n: num, memo: { ...memo } });

            if (num in memo) {
                this.steps.push({ type: 'hit', n: num, val: memo[num], memo: { ...memo } });
                return memo[num];
            }

            if (num <= 1) {
                memo[num] = num;
                this.steps.push({ type: 'write', n: num, val: num, memo: { ...memo } });
                return num;
            }

            const res = run(num - 1) + run(num - 2);
            memo[num] = res;
            this.steps.push({ type: 'write', n: num, val: res, memo: { ...memo } });
            return res;
        };
        run(n);
    }

    generateTabSteps(n) {
        this.steps = [];
        const dp = new Array(n + 1).fill(null);
        this.steps.push({ type: 'init', arr: [...dp] });

        dp[0] = 0;
        this.steps.push({ type: 'fill', idx: 0, val: 0, arr: [...dp] });

        if (n >= 1) {
            dp[1] = 1;
            this.steps.push({ type: 'fill', idx: 1, val: 1, arr: [...dp] });
        }

        for (let i = 2; i <= n; i++) {
            this.steps.push({ type: 'compute', idx: i, arr: [...dp] });
            dp[i] = dp[i - 1] + dp[i - 2];
            this.steps.push({ type: 'fill', idx: i, val: dp[i], arr: [...dp] });
        }
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        const step = this.steps[this.currentStep];

        if (this.mode === 'memo') {
            this.ui.updateMemoTable(step.memo);
            if (step.type === 'call') this.ui.updateStatus(`Calling recursive F(${step.n})...`);
            else if (step.type === 'hit') this.ui.updateStatus(`MEMO HIT! F(${step.n}) found in table: ${step.val}`);
            else if (step.type === 'write') this.ui.updateStatus(`F(${step.n}) calculated as ${step.val}. Saving to memo table.`);
        } else {
            this.ui.updateTabTable(step.arr, step.idx);
            if (step.type === 'fill') this.ui.updateStatus(`Filling DP[${step.idx}] with result ${step.val}`);
            else if (step.type === 'compute') this.ui.updateStatus(`Computing DP[${step.idx}] = DP[${step.idx - 1}] + DP[${step.idx - 2}]`);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}
Riverside

/**
 * radix-bucket-algo.js - Radix and Bucket Sort visualization logic.
 */
class AdvancedSortAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine; // We can use ArrayEngine for the main array
        this.playback = playback;
        this.ui = ui;
        this.steps = [];
        this.currentStep = 0;
    }

    reset() {
        this.steps = [];
        this.currentStep = 0;
    }

    // Radix Sort (LSD)
    generateRadixSteps(arr) {
        this.reset();
        let data = [...arr];
        const max = Math.max(...data);
        let exp = 1;

        while (Math.floor(max / exp) > 0) {
            this.steps.push({ type: 'start_exp', exp, arr: [...data] });

            let buckets = Array.from({ length: 10 }, () => []);

            // Distribution phase
            for (let i = 0; i < data.length; i++) {
                const digit = Math.floor(data[i] / exp) % 10;
                buckets[digit].push(data[i]);
                this.steps.push({
                    type: 'distribute',
                    idx: i,
                    digit,
                    val: data[i],
                    buckets: JSON.parse(JSON.stringify(buckets)),
                    arr: [...data]
                });
            }

            // Collection phase
            let k = 0;
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < buckets[i].length; j++) {
                    data[k++] = buckets[i][j];
                    this.steps.push({
                        type: 'collect',
                        idx: k - 1,
                        digit: i,
                        val: data[k - 1],
                        buckets: JSON.parse(JSON.stringify(buckets)),
                        arr: [...data]
                    });
                }
            }
            exp *= 10;
        }
        this.steps.push({ type: 'done', arr: [...data] });
    }

    // Bucket Sort
    generateBucketSteps(arr) {
        this.reset();
        let data = [...arr];
        const n = data.length;
        if (n <= 0) return;

        const max = Math.max(...data);
        const bucketCount = 5;
        let buckets = Array.from({ length: bucketCount }, () => []);

        this.steps.push({ type: 'start_bucket', arr: [...data] });

        // Distribution
        for (let i = 0; i < n; i++) {
            const bIdx = Math.floor((data[i] / (max + 1)) * bucketCount);
            buckets[bIdx].push(data[i]);
            this.steps.push({
                type: 'distribute',
                idx: i,
                bucketIdx: bIdx,
                val: data[i],
                buckets: JSON.parse(JSON.stringify(buckets)),
                arr: [...data]
            });
        }

        // Sort individual buckets and collect
        let k = 0;
        for (let i = 0; i < bucketCount; i++) {
            this.steps.push({ type: 'sort_bucket', bucketIdx: i, buckets: JSON.parse(JSON.stringify(buckets)), arr: [...data] });
            buckets[i].sort((a, b) => a - b);

            for (let j = 0; j < buckets[i].length; j++) {
                data[k++] = buckets[i][j];
                this.steps.push({
                    type: 'collect',
                    idx: k - 1,
                    bucketIdx: i,
                    val: data[k - 1],
                    buckets: JSON.parse(JSON.stringify(buckets)),
                    arr: [...data]
                });
            }
        }
        this.steps.push({ type: 'done', arr: [...data] });
    }

    async nextStep() {
        if (this.currentStep >= this.steps.length) return false;
        const step = this.steps[this.currentStep];

        // Update ArrayEngine visual
        this.engine.drawFullArray(step.arr);

        // Custom Bucket visualization logic
        this.ui.drawBuckets(step);

        if (step.type === 'distribute') {
            this.ui.updateStatus(`Moving ${step.val} to ${step.digit !== undefined ? 'digit bucket ' + step.digit : 'bucket ' + step.bucketIdx}`);
        } else if (step.type === 'collect') {
            this.ui.updateStatus(`Collecting ${step.val} from bucket ${step.digit !== undefined ? step.digit : step.bucketIdx}`);
        } else if (step.type === 'start_exp') {
            this.ui.updateStatus(`Sorting by digit at 10^${Math.log10(step.exp)} position.`);
        } else if (step.type === 'sort_bucket') {
            this.ui.updateStatus(`Sorting individual bucket ${step.bucketIdx}`);
        } else if (step.type === 'done') {
            this.ui.updateStatus(`Array fully sorted.`);
        }

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }
}
Riverside

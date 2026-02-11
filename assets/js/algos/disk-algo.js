/**
 * disk-algo.js - Disk Scheduling Algorithms logic with Playback support.
 */
class DiskAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui; // { updateStats, updateStatus }

        this.requests = [];
        this.initialHead = 50;
        this.currentAlgorithm = 'FCFS';
        this.path = [];
        this.currentIndex = 0;
        this.totalSeek = 0;
    }

    reset() {
        this.currentIndex = 0;
        this.totalSeek = 0;
        this.path = [];
        this.engine.reset(); // Should clear canvas/head
        this.ui.updateStatus("Ready. Click Play to start.");
        this.ui.updateStats(0, 0);
    }

    init(algo, requests, initialHead) {
        this.currentAlgorithm = algo;
        this.requests = [...requests];
        this.initialHead = initialHead;
        this.reset();

        // Pre-calculate full path
        this.calculatePath();

        // Draw initial state (Step 0)
        // Pass the full path length as maxSteps to lock scale
        this.engine.setData(this.requests, this.initialHead, [this.path[0]], this.path.length);
    }

    calculatePath() {
        // Logic from original disk-algo.js
        let path = [{ cylinder: this.initialHead, seek: 0 }];
        let reqs = [...this.requests];
        let current = this.initialHead;

        // Helper to push step
        const addStep = (target) => {
            const dist = Math.abs(target - current);
            path.push({ cylinder: target, seek: dist });
            current = target;
        };

        switch (this.currentAlgorithm) {
            case 'FCFS':
                reqs.forEach(r => addStep(r));
                break;

            case 'SSTF':
                while (reqs.length > 0) {
                    reqs.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
                    const next = reqs.shift();
                    addStep(next);
                }
                break;

            case 'SCAN':
                // Standard SCAN: usually tailored by user, but let's assume towards 0 if closer? 
                // Or hardcode direction: Left (0) first.
                // Let's assume standard "Left" first like previous implementation
                let left = reqs.filter(r => r < current).sort((a, b) => b - a);
                let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

                left.forEach(r => addStep(r));
                if (left.length > 0 && right.length > 0) addStep(0); // touch 0
                right.forEach(r => addStep(r));
                break;

            case 'C-SCAN':
                let c_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                let c_left = reqs.filter(r => r < current).sort((a, b) => a - b);

                // Assuming "Right" (High) direction for C-SCAN
                c_right.forEach(r => addStep(r));
                if (c_right.length > 0) {
                    addStep(199); // End
                    addStep(0);   // Jump
                }
                c_left.forEach(r => addStep(r));
                break;

            case 'LOOK':
                let l_left = reqs.filter(r => r < current).sort((a, b) => b - a);
                let l_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                // Direction Left
                l_left.forEach(r => addStep(r));
                l_right.forEach(r => addStep(r));
                break;
        }

        this.path = path;
    }

    async nextStep() {
        if (this.currentIndex >= this.path.length - 1) {
            this.ui.updateStatus("Algorithm Complete.");
            return false;
        }

        this.currentIndex++;
        const currentPath = this.path.slice(0, this.currentIndex + 1);

        // Update Engine with partial path, but maintain Total maxSteps for scale
        this.engine.setData(this.requests, this.initialHead, currentPath, this.path.length);

        const step = this.path[this.currentIndex];
        this.totalSeek += step.seek;

        this.ui.updateStats(this.totalSeek, this.currentIndex);
        this.ui.updateStatus(`Visiting cylinder ${step.cylinder}. Seek: ${step.seek}`);

        return true;
    }
}

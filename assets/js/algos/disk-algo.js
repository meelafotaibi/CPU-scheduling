/**
 * disk-algo.js - Disk Scheduling Algorithms logic.
 */
class DiskAlgo {
    constructor(engine, ui) {
        this.engine = engine;
        this.ui = ui;
        this.requests = [];
        this.initialHead = 50;
        this.currentAlgorithm = 'FCFS';
        this.maxCylinders = 200;
    }

    setParams(requests, initialHead) {
        this.requests = [...requests];
        this.initialHead = initialHead;
    }

    calculate(algo) {
        this.currentAlgorithm = algo;
        let path = [{ cylinder: this.initialHead }];
        let totalSeek = 0;
        let reqs = [...this.requests];

        switch (algo) {
            case 'FCFS':
                reqs.forEach(r => {
                    const last = path[path.length - 1].cylinder;
                    totalSeek += Math.abs(r - last);
                    path.push({ cylinder: r });
                });
                break;

            case 'SSTF':
                let current = this.initialHead;
                while (reqs.length > 0) {
                    reqs.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
                    const next = reqs.shift();
                    totalSeek += Math.abs(next - current);
                    path.push({ cylinder: next });
                    current = next;
                }
                break;

            case 'SCAN':
                // Assumes moving towards 0 by default
                let scanHead = this.initialHead;
                let left = reqs.filter(r => r < scanHead).sort((a, b) => b - a);
                let right = reqs.filter(r => r >= scanHead).sort((a, b) => a - b);

                left.forEach(r => {
                    totalSeek += Math.abs(r - scanHead);
                    scanHead = r;
                    path.push({ cylinder: r });
                });

                // Hit boundary 0
                totalSeek += Math.abs(0 - scanHead);
                path.push({ cylinder: 0 });
                scanHead = 0;

                right.forEach(r => {
                    totalSeek += Math.abs(r - scanHead);
                    scanHead = r;
                    path.push({ cylinder: r });
                });
                break;

            case 'C-SCAN':
                let cscanHead = this.initialHead;
                let c_right = reqs.filter(r => r >= cscanHead).sort((a, b) => a - b);
                let c_left = reqs.filter(r => r < cscanHead).sort((a, b) => a - b);

                c_right.forEach(r => {
                    totalSeek += Math.abs(r - cscanHead);
                    cscanHead = r;
                    path.push({ cylinder: r });
                });

                // Wrap around via 199 and 0
                totalSeek += Math.abs(199 - cscanHead);
                path.push({ cylinder: 199 });
                path.push({ cylinder: 0 });
                cscanHead = 0;

                c_left.forEach(r => {
                    totalSeek += Math.abs(r - cscanHead);
                    cscanHead = r;
                    path.push({ cylinder: r });
                });
                break;

            case 'LOOK':
                let lookHead = this.initialHead;
                let l_left = reqs.filter(r => r < lookHead).sort((a, b) => b - a);
                let l_right = reqs.filter(r => r >= lookHead).sort((a, b) => a - b);

                l_left.forEach(r => {
                    totalSeek += Math.abs(r - lookHead);
                    lookHead = r;
                    path.push({ cylinder: r });
                });

                l_right.forEach(r => {
                    totalSeek += Math.abs(r - lookHead);
                    lookHead = r;
                    path.push({ cylinder: r });
                });
                break;
        }

        this.engine.setData(this.requests, this.initialHead, path);
        this.ui.updateStats(totalSeek, path.length - 1);
        return path;
    }
}
Riverside

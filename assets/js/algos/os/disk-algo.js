// disk-algo.js - Upgraded Disk Scheduling Engine
// Implementing FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK, dynamic injections, comparisons, and the Disk Captain game.

class DiskAlgo {
    constructor(engine, playback, ui) {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;

        this.requests = [];
        this.initialHead = 50;
        this.currentAlgorithm = 'FCFS';
        this.path = []; // [{cylinder, seek}]
        this.currentIndex = 0;
        this.totalSeek = 0;

        // Game mode state
        this.gameMode = false;
        this.gameScore = 0;
        this.gameHead = 50;
        this.gameRequests = [];
        this.gameFulfilled = [];
        this.gameSeekDistance = 0;
        this.gameTargetSeek = 0; // The optimal seek calculated by SSTF/LOOK
        this.gameDifficulty = 'easy';
    }

    reset() {
        this.currentIndex = 0;
        this.totalSeek = 0;
        this.path = [];
        this.engine.reset();
        this.ui.updateStatus("Ready. Click Run to begin.");
        this.ui.updateStats(0, 0);
    }

    init(algo, requests, initialHead) {
        this.currentAlgorithm = algo;
        this.requests = [...requests];
        this.initialHead = initialHead;
        this.reset();

        this.calculatePath();
        this.engine.setData(this.requests, this.initialHead, [this.path[0]], this.path.length);
        
        // Generate static comparisons for the table/chart
        generateComparisons(this.requests, this.initialHead);
    }

    // Recalculates seek path
    calculatePath() {
        let path = [{ cylinder: this.initialHead, seek: 0 }];
        let reqs = [...this.requests];
        let current = this.initialHead;

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
                // Move left first
                let left = reqs.filter(r => r < current).sort((a, b) => b - a);
                let right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                left.forEach(r => addStep(r));
                if (left.length > 0 && right.length > 0) addStep(0); // Touch end
                right.forEach(r => addStep(r));
                break;

            case 'C-SCAN':
                // Move right, jump to 0
                let cs_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                let cs_left = reqs.filter(r => r < current).sort((a, b) => a - b);
                cs_right.forEach(r => addStep(r));
                if (cs_right.length > 0 || cs_left.length > 0) {
                    addStep(199);
                    addStep(0);
                }
                cs_left.forEach(r => addStep(r));
                break;

            case 'LOOK':
                // Move left, reverse, no boundary touch
                let l_left = reqs.filter(r => r < current).sort((a, b) => b - a);
                let l_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                l_left.forEach(r => addStep(r));
                l_right.forEach(r => addStep(r));
                break;

            case 'C-LOOK':
                // Move right, jump to lowest request, do not touch boundary
                let cl_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
                let cl_left = reqs.filter(r => r < current).sort((a, b) => a - b);
                cl_right.forEach(r => addStep(r));
                cl_left.forEach(r => addStep(r));
                break;
        }

        this.path = path;
    }

    // Dynamic queue injection during runtime
    injectRequest(cylinder) {
        if (cylinder < 0 || cylinder > 199) return;
        this.requests.push(cylinder);
        
        // If simulation hasn't run/initialized path, just re-init and return
        if (!this.path || this.path.length === 0) {
            this.init(this.currentAlgorithm, this.requests, this.initialHead);
            return;
        }

        // Recalculate remaining path from the current active disk head position onwards
        const currentHead = this.path[this.currentIndex].cylinder;
        const processedPath = this.path.slice(0, this.currentIndex + 1);

        // Find remaining requests that are not yet visited
        const visitedCylinders = processedPath.slice(1).map(p => p.cylinder);
        
        // Compute unvisited requests
        let unvisited = this.requests.filter((_, idx) => {
            // Compare by index/matching to prevent filtering identical duplicates too aggressively
            const occurrenceInPath = processedPath.filter(p => p.cylinder === _).length;
            const occurrenceInAll = this.requests.slice(0, idx + 1).filter(r => r === _).length;
            return occurrenceInAll > occurrenceInPath;
        });

        // Recalculate suffix path from current position
        let suffixPath = [];
        let current = currentHead;
        
        const addSuffixStep = (target) => {
            const dist = Math.abs(target - current);
            suffixPath.push({ cylinder: target, seek: dist });
            current = target;
        };

        switch (this.currentAlgorithm) {
            case 'FCFS':
                unvisited.forEach(r => addSuffixStep(r));
                break;
            case 'SSTF':
                while (unvisited.length > 0) {
                    unvisited.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
                    const next = unvisited.shift();
                    addSuffixStep(next);
                }
                break;
            case 'SCAN':
                let left = unvisited.filter(r => r < current).sort((a, b) => b - a);
                let right = unvisited.filter(r => r >= current).sort((a, b) => a - b);
                left.forEach(r => addSuffixStep(r));
                if (left.length > 0 && right.length > 0) addSuffixStep(0);
                right.forEach(r => addSuffixStep(r));
                break;
            case 'C-SCAN':
                let cs_right = unvisited.filter(r => r >= current).sort((a, b) => a - b);
                let cs_left = unvisited.filter(r => r < current).sort((a, b) => a - b);
                cs_right.forEach(r => addSuffixStep(r));
                if (cs_right.length > 0 || cs_left.length > 0) {
                    addSuffixStep(199);
                    addSuffixStep(0);
                }
                cs_left.forEach(r => addSuffixStep(r));
                break;
            case 'LOOK':
                let l_left = unvisited.filter(r => r < current).sort((a, b) => b - a);
                let l_right = unvisited.filter(r => r >= current).sort((a, b) => a - b);
                l_left.forEach(r => addSuffixStep(r));
                l_right.forEach(r => addSuffixStep(r));
                break;
            case 'C-LOOK':
                let cl_right = unvisited.filter(r => r >= current).sort((a, b) => a - b);
                let cl_left = unvisited.filter(r => r < current).sort((a, b) => a - b);
                cl_right.forEach(r => addSuffixStep(r));
                cl_left.forEach(r => addSuffixStep(r));
                break;
        }

        this.path = [...processedPath, ...suffixPath];
        this.engine.setData(this.requests, this.initialHead, this.path.slice(0, this.currentIndex + 1), this.path.length);
        
        generateComparisons(this.requests, this.initialHead);
        this.ui.updateStatus(`Injected cylinder request: ${cylinder}. Recalculated path.`);
    }

    async nextStep() {
        if (this.currentIndex >= this.path.length - 1) {
            this.ui.updateStatus("Disk sweep complete.");
            return false;
        }

        this.currentIndex++;
        const currentPath = this.path.slice(0, this.currentIndex + 1);

        this.engine.setData(this.requests, this.initialHead, currentPath, this.path.length);

        const step = this.path[this.currentIndex];
        this.totalSeek += step.seek;

        this.ui.updateStats(this.totalSeek, this.currentIndex);
        this.ui.updateStatus(`Moving disk head to cylinder ${step.cylinder}. (Seek distance: ${step.seek})`);

        return true;
    }

    // ==========================================
    // GAME MODE: DISK CAPTAIN CHALLENGE
    // ==========================================

    toggleGameMode() {
        const gamePanel = document.getElementById('game-panel');
        const standardPanel = document.getElementById('standard-controls');
        
        if (this.gameMode) {
            this.gameMode = false;
            if (gamePanel) gamePanel.style.display = 'none';
            if (standardPanel) standardPanel.style.display = 'flex';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Disk Captain Game';
            this.reset();
        } else {
            this.gameMode = true;
            if (gamePanel) gamePanel.style.display = 'block';
            if (standardPanel) standardPanel.style.display = 'none';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Exit Game';
            this.startNewGameLevel('easy');
        }
    }

    startNewGameLevel(diff) {
        this.gameDifficulty = diff;
        this.gameHead = 50;
        this.gameSeekDistance = 0;
        this.gameFulfilled = [];
        
        document.querySelectorAll('.game-diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === diff);
        });

        let count = 5;
        if (diff === 'medium') count = 8;
        if (diff === 'hard') count = 12;

        this.gameRequests = [];
        for (let i = 0; i < count; i++) {
            this.gameRequests.push(Math.floor(Math.random() * 200));
        }

        // Calculate theoretical optimal (using LOOK)
        let reqs = [...this.gameRequests];
        let current = this.gameHead;
        let optSeek = 0;
        let l_left = reqs.filter(r => r < current).sort((a, b) => b - a);
        let l_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
        
        l_left.forEach(r => { optSeek += Math.abs(r - current); current = r; });
        l_right.forEach(r => { optSeek += Math.abs(r - current); current = r; });
        this.gameTargetSeek = optSeek;

        updateGameUI();
        this.renderGameCanvas();
    }

    moveHeadTo(cylinder) {
        if (!this.gameMode) return;
        if (cylinder < 0 || cylinder > 199) return;

        const distance = Math.abs(cylinder - this.gameHead);
        this.gameSeekDistance += distance;
        this.gameHead = cylinder;

        // Check if head landed on any unfulfilled request
        const reqIdx = this.gameRequests.indexOf(cylinder);
        if (reqIdx !== -1) {
            this.gameRequests.splice(reqIdx, 1);
            this.gameFulfilled.push(cylinder);
        }

        updateGameUI();
        this.renderGameCanvas();

        if (this.gameRequests.length === 0) {
            // Level complete
            const ratio = this.gameTargetSeek / Math.max(1, this.gameSeekDistance);
            const score = Math.round(ratio * 100);
            this.gameScore += score;
            
            alert(`Level Complete!\n\nYour Seek Distance: ${this.gameSeekDistance}\nOptimal Target Seek: ${this.gameTargetSeek}\nScore earned: ${score} points!`);
            
            // Check High Score
            const hsKey = `disk_highscore_${this.gameDifficulty}`;
            const prevHs = localStorage.getItem(hsKey) || 0;
            if (this.gameScore > prevHs) {
                localStorage.setItem(hsKey, this.gameScore);
                alert(`New Personal High Score for ${this.gameDifficulty.toUpperCase()} difficulty: ${this.gameScore}!`);
            }
            
            this.startNewGameLevel(this.gameDifficulty);
        }
    }

    renderGameCanvas() {
        const canvas = document.getElementById('disk-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const cw = canvas.width;
        const ch = canvas.height;
        const padding = 40;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        ctx.clearRect(0, 0, cw, ch);

        // Draw track slider bar
        ctx.strokeStyle = isDark ? '#333' : '#eee';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(padding, ch / 2);
        ctx.lineTo(cw - padding, ch / 2);
        ctx.stroke();

        const scaleX = (cw - 2 * padding) / 199;

        // Draw scale ticks
        ctx.fillStyle = isDark ? '#999' : '#666';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i <= 200; i += 20) {
            const x = padding + i * scaleX;
            ctx.beginPath();
            ctx.arc(x, ch / 2, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.fillText(i, x, ch / 2 + 18);
        }

        // Draw Pending Requests (glowing red points)
        this.gameRequests.forEach(req => {
            const x = padding + req * scaleX;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ef4444';
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(x, ch / 2, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Arial';
            ctx.fillText(req, x, ch / 2 - 14);
        });

        // Draw head index slider node (blue handle)
        const headX = padding + this.gameHead * scaleX;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'var(--primary)';
        ctx.fillStyle = 'var(--primary)';
        ctx.beginPath();
        ctx.arc(headX, ch / 2, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(this.gameHead, headX, ch / 2 + 3);
    }
}

// Compare algorithms and populate metrics table
function generateComparisons(requests, initialHead) {
    if (requests.length === 0) return;
    
    const algos = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'];
    const results = {};

    algos.forEach(algo => {
        let current = initialHead;
        let path = [{ cylinder: initialHead, seek: 0 }];
        let reqs = [...requests];
        
        const addStep = (target) => {
            const dist = Math.abs(target - current);
            path.push({ cylinder: target, seek: dist });
            current = target;
        };

        if (algo === 'FCFS') {
            reqs.forEach(r => addStep(r));
        } else if (algo === 'SSTF') {
            while (reqs.length > 0) {
                reqs.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
                const next = reqs.shift();
                addStep(next);
            }
        } else if (algo === 'SCAN') {
            let left = reqs.filter(r => r < current).sort((a, b) => b - a);
            let right = reqs.filter(r => r >= current).sort((a, b) => a - b);
            left.forEach(r => addStep(r));
            if (left.length > 0 && right.length > 0) addStep(0);
            right.forEach(r => addStep(r));
        } else if (algo === 'C-SCAN') {
            let cs_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
            let cs_left = reqs.filter(r => r < current).sort((a, b) => a - b);
            cs_right.forEach(r => addStep(r));
            if (cs_right.length > 0 || cs_left.length > 0) { addStep(199); addStep(0); }
            cs_left.forEach(r => addStep(r));
        } else if (algo === 'LOOK') {
            let l_left = reqs.filter(r => r < current).sort((a, b) => b - a);
            let l_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
            l_left.forEach(r => addStep(r));
            l_right.forEach(r => addStep(r));
        } else if (algo === 'C-LOOK') {
            let cl_right = reqs.filter(r => r >= current).sort((a, b) => a - b);
            let cl_left = reqs.filter(r => r < current).sort((a, b) => a - b);
            cl_right.forEach(r => addStep(r));
            cl_left.forEach(r => addStep(r));
        }

        const totalSeek = path.reduce((sum, p) => sum + p.seek, 0);
        results[algo] = totalSeek;
    });

    // Update Comparison Pane HTML
    const compBody = document.getElementById('comparison-tbody');
    if (compBody) {
        compBody.innerHTML = algos.map(algo => {
            const seek = results[algo];
            const isMin = seek === Math.min(...Object.values(results));
            return `<tr>
                <td><strong>${algo}</strong></td>
                <td><span style="${isMin ? 'color: var(--success); font-weight: 800;' : 'color: var(--text);'}">${seek} cylinders</span></td>
                <td>${isMin ? '<i class="fas fa-trophy"></i> Optimal' : 'Sub-optimal'}</td>
            </tr>`;
        }).join('');
    }

    // Render comparison chart
    renderComparisonChart(results);
}

let comparisonChartInstance = null;
function renderComparisonChart(results) {
    const ctxCanvas = document.getElementById('comparison-chart');
    if (!ctxCanvas) return;

    if (comparisonChartInstance) {
        comparisonChartInstance.destroy();
    }

    const labels = Object.keys(results);
    const data = Object.values(results);
    const colors = labels.map(l => l === 'C-LOOK' ? '#f59e0b' : '#3b82f6');

    comparisonChartInstance = new Chart(ctxCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Seek Operations (Cylinders)',
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function updateGameUI() {
    const algo = window.algo;
    document.getElementById('game-score-val').innerText = algo.gameScore;
    document.getElementById('game-seek-val').innerText = algo.gameSeekDistance;
    document.getElementById('game-target-val').innerText = algo.gameTargetSeek;

    const reqsDiv = document.getElementById('game-pending-requests');
    if (reqsDiv) {
        reqsDiv.innerHTML = algo.gameRequests.map(req => `
            <span class="status-badge" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; font-size: 0.9rem; padding: 5px 12px; border-radius: 8px;">
                ${req}
            </span>
        `).join('');
    }
}

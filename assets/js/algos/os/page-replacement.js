// page-replacement.js - Upgraded Page Replacement Engine
// Implementing FIFO, LRU, Optimal, MRU, LRU-2, Belady's Anomaly Plotter, and the Page Eviction Game.

class PageReplacementAlgo {
    constructor(playback, ui) {
        this.playback = playback;
        this.ui = ui;
        
        this.frames = [];
        this.refString = [];
        this.capacity = 3;
        this.algoType = 'FIFO';

        this.currentIndex = 0;
        this.hits = 0;
        this.faults = 0;
        this.steps = []; // Precalculated sequence of steps

        // Game State
        this.gameMode = false;
        this.gameScore = 0;
        this.gameIndex = 0;
        this.gameFrames = [];
        this.gameHits = 0;
        this.gameFaults = 0;
        this.gameHistory = [];
        this.gameOptimalFaults = 0;
    }

    reset() {
        this.currentIndex = 0;
        this.hits = 0;
        this.faults = 0;
        this.frames = [];
        this.ui.updateStats(0, 0, 0);
        this.ui.clearDisplay();
        this.ui.updateStatus("Ready. Click Run or Step to start.");
    }

    init(algoType, capacity, refStringStr) {
        this.algoType = algoType;
        this.capacity = capacity;
        this.refString = refStringStr.split(',').map(s => s.trim()).filter(s => s !== '');
        this.reset();
        
        this.calculateSteps();
        
        // Render Belady's Anomaly Plot
        generateBeladyPlot(this.refString);
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
                    } else if (this.algoType === 'MRU') {
                        const mru = tempFrames.reduce((max, f) => tempHistory.lastIndexOf(f) > tempHistory.lastIndexOf(max) ? f : max);
                        victim = mru;
                        tempFrames.splice(tempFrames.indexOf(mru), 1);
                        actionStr += ` (Evict ${victim})`;
                    } else if (this.algoType === 'LRU-K') {
                        // LRU-2 (K=2): Find 2nd backward distance
                        const K = 2;
                        const lruk = tempFrames.reduce((maxVictim, f) => {
                            const occurrences = [];
                            for (let i = tempHistory.length - 1; i >= 0; i--) {
                                if (tempHistory[i] === f) {
                                    occurrences.push(i);
                                    if (occurrences.length === K) break;
                                }
                            }
                            const fDist = occurrences.length === K ? tempHistory.length - occurrences[K-1] : Infinity;

                            const maxOccurrences = [];
                            for (let i = tempHistory.length - 1; i >= 0; i--) {
                                if (tempHistory[i] === maxVictim) {
                                    maxOccurrences.push(i);
                                    if (maxOccurrences.length === K) break;
                                }
                            }
                            const maxDist = maxOccurrences.length === K ? tempHistory.length - maxOccurrences[K-1] : Infinity;

                            // If distance is infinite, fall back to FIFO/Least recently used
                            if (fDist === Infinity && maxDist === Infinity) {
                                return tempHistory.lastIndexOf(f) < tempHistory.lastIndexOf(maxVictim) ? f : maxVictim;
                            }
                            return fDist > maxDist ? f : maxVictim;
                        });
                        
                        victim = lruk;
                        tempFrames.splice(tempFrames.indexOf(lruk), 1);
                        actionStr += ` (Evict ${victim})`;
                    } else if (this.algoType === 'Optimal') {
                        const future = this.refString.slice(idx + 1);
                        const opt = tempFrames.reduce((max, f) => {
                            const nextUse = future.indexOf(f);
                            const maxNextUse = future.indexOf(max);
                            if (nextUse === -1) return f; // If never used in future, evict immediately
                            if (maxNextUse === -1) return max;
                            return nextUse > maxNextUse ? f : max;
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
        this.ui.renderStep(step, this.capacity);
        this.ui.updateStats(step.hits, step.faults, this.refString.length);
        this.ui.updateStatus(`Step ${this.currentIndex + 1}: Reference Page ${step.page} ➔ ${step.action}`);

        this.currentIndex++;
        return true;
    }

    // ==========================================
    // GAME MODE: PAGE EVICTION CHALLENGE
    // ==========================================

    toggleGameMode() {
        const gamePanel = document.getElementById('game-panel');
        const standardPanel = document.getElementById('standard-controls');
        
        if (this.gameMode) {
            this.gameMode = false;
            if (gamePanel) gamePanel.style.display = 'none';
            if (standardPanel) standardPanel.style.display = 'flex';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Page Eviction Game';
            this.reset();
        } else {
            this.gameMode = true;
            if (gamePanel) gamePanel.style.display = 'block';
            if (standardPanel) standardPanel.style.display = 'none';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Exit Game';
            
            this.startNewGame();
        }
    }

    startNewGame() {
        this.gameIndex = 0;
        this.gameFrames = [];
        this.gameHits = 0;
        this.gameFaults = 0;
        this.gameHistory = [];
        this.gameScore = 0;

        // Load reference string from UI or random
        const uiRefString = document.getElementById('ref-string').value;
        this.refString = uiRefString.split(',').map(s => s.trim()).filter(s => s !== '');
        this.capacity = parseInt(document.getElementById('frame-size').value);

        // Precalculate optimal faults for scoring ratio comparison
        const optSweep = runSingleAlgorithmSweep(this.refString, this.capacity, 'Optimal');
        this.gameOptimalFaults = optSweep.faults;

        updateGameUI();
        this.renderGameStep();
    }

    renderGameStep() {
        const stepContainer = document.getElementById('game-step-renderer');
        if (!stepContainer) return;

        if (this.gameIndex >= this.refString.length) {
            // End Game
            const ratio = this.gameOptimalFaults / Math.max(1, this.gameFaults);
            this.gameScore = Math.round(ratio * 100);
            
            const hs = localStorage.getItem('page_highscore') || 0;
            let scoreMsg = '';
            if (this.gameScore > hs) {
                localStorage.setItem('page_highscore', this.gameScore);
                scoreMsg = `🏆 NEW HIGH SCORE!`;
            } else {
                scoreMsg = `High Score: ${hs}`;
            }

            alert(`Challenge Complete!\n\nYour Page Faults: ${this.gameFaults}\nOptimal Page Faults: ${this.gameOptimalFaults}\nScore: ${this.gameScore}%\n${scoreMsg}`);
            this.toggleGameMode();
            return;
        }

        const nextPage = this.refString[this.gameIndex];
        const isHit = this.gameFrames.includes(nextPage);

        let html = `
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 0.9rem; color: var(--text-muted); display: block;">Next Page Requested:</span>
                <strong style="font-size: 2.2rem; color: var(--primary);">${nextPage}</strong>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 20px;">
        `;

        for (let i = 0; i < this.capacity; i++) {
            const val = this.gameFrames[i] !== undefined ? this.gameFrames[i] : 'Empty';
            const isFull = this.gameFrames[i] !== undefined;
            const clickAction = (!isHit && this.gameFrames.length === this.capacity) ? `onclick="window.algo.handleGameEvictionClick('${val}')"` : '';
            const pointerStyle = (!isHit && this.gameFrames.length === this.capacity) ? 'cursor: pointer; border-color: var(--accent);' : '';

            html += `
                <div class="frame-box" ${clickAction} style="width: 65px; height: 65px; font-size: 1.2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.25); border-color: var(--glass-border); ${pointerStyle}">
                    <span style="font-weight:bold;">${val}</span>
                    ${(!isHit && this.gameFrames.length === this.capacity) ? '<span style="font-size:0.6rem; color: var(--accent); margin-top:2px;">EVICT</span>' : ''}
                </div>
            `;
        }

        html += `</div>`;

        // If it's a Hit or we have space, give a button to auto-advance
        if (isHit || this.gameFrames.length < this.capacity) {
            html += `
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="window.algo.handleGameAutoAdvance()">${isHit ? 'Register HIT' : 'Fill Free Frame'}</button>
                </div>
            `;
        } else {
            html += `
                <div style="text-align: center; font-size: 0.85rem; color: var(--accent); font-weight: bold;">
                    ⚠️ Page Fault! Click a frame box above to evict that page.
                </div>
            `;
        }

        stepContainer.innerHTML = html;
        this.gameHistory.push(nextPage);
    }

    handleGameAutoAdvance() {
        const page = this.refString[this.gameIndex];
        const isHit = this.gameFrames.includes(page);

        if (isHit) {
            this.gameHits++;
            logGameMessage(`Page ${page} was a HIT!`);
        } else {
            this.gameFaults++;
            this.gameFrames.push(page);
            logGameMessage(`Page ${page} was a MISS. Filled free frame.`);
        }

        this.gameIndex++;
        updateGameUI();
        this.renderGameStep();
    }

    handleGameEvictionClick(pageToEvict) {
        const page = this.refString[this.gameIndex];
        const evictIdx = this.gameFrames.indexOf(pageToEvict);
        
        if (evictIdx !== -1) {
            this.gameFaults++;
            this.gameFrames.splice(evictIdx, 1, page);
            logGameMessage(`Page Fault! Evicted Page ${pageToEvict} and loaded Page ${page}.`);
            
            this.gameIndex++;
            updateGameUI();
            this.renderGameStep();
        }
    }
}

// Logging for Game Mode
function logGameMessage(msg) {
    const box = document.getElementById('status-text');
    if (box) box.innerText = msg;
}

// Single algorithm sweep helper
function runSingleAlgorithmSweep(refString, capacity, algo) {
    let frames = [];
    let history = [];
    let hits = 0;
    let faults = 0;

    refString.forEach((page, idx) => {
        let hit = frames.includes(page);

        if (!hit) {
            faults++;
            if (frames.length < capacity) {
                frames.push(page);
            } else {
                let victim = -1;
                if (algo === 'FIFO') {
                    frames.shift();
                } else if (algo === 'LRU') {
                    const lru = frames.reduce((min, f) => history.lastIndexOf(f) < history.lastIndexOf(min) ? f : min);
                    frames.splice(frames.indexOf(lru), 1);
                } else if (algo === 'MRU') {
                    const mru = frames.reduce((max, f) => history.lastIndexOf(f) > history.lastIndexOf(max) ? f : max);
                    frames.splice(frames.indexOf(mru), 1);
                } else if (algo === 'Optimal') {
                    const future = refString.slice(idx + 1);
                    const opt = frames.reduce((max, f) => {
                        const nextUse = future.indexOf(f);
                        const maxNextUse = future.indexOf(max);
                        if (nextUse === -1) return f;
                        if (maxNextUse === -1) return max;
                        return nextUse > maxNextUse ? f : max;
                    });
                    frames.splice(frames.indexOf(opt), 1);
                }
                frames.push(page);
            }
        } else {
            hits++;
        }
        history.push(page);
    });

    return { hits, faults };
}

// Belady's Anomaly Plotter Sweep
function generateBeladyPlot(refString) {
    const capacities = [1, 2, 3, 4, 5, 6];
    
    // Sweeps for FIFO, LRU, Optimal
    const fifoFaults = capacities.map(c => runSingleAlgorithmSweep(refString, c, 'FIFO').faults);
    const lruFaults = capacities.map(c => runSingleAlgorithmSweep(refString, c, 'LRU').faults);
    const optimalFaults = capacities.map(c => runSingleAlgorithmSweep(refString, c, 'Optimal').faults);

    // Plot with Chart.js
    renderBeladyChart(capacities, fifoFaults, lruFaults, optimalFaults);
    
    // Check if Belady's Anomaly occurred in FIFO
    let anomalyDetected = false;
    let anomalyFrames = 0;
    for (let i = 0; i < fifoFaults.length - 1; i++) {
        if (fifoFaults[i + 1] > fifoFaults[i]) {
            anomalyDetected = true;
            anomalyFrames = capacities[i + 1];
            break;
        }
    }

    const reportBox = document.getElementById('anomaly-report');
    if (reportBox) {
        if (anomalyDetected) {
            reportBox.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 15px; border-radius: 12px; font-size: 0.85rem;">
                    <strong>⚠️ Belady's Anomaly Detected!</strong><br>
                    FIFO Page faults increased from ${fifoFaults[anomalyFrames - 2]} to ${fifoFaults[anomalyFrames - 1]} when frame size increased from ${anomalyFrames - 1} to ${anomalyFrames}.
                </div>
            `;
        } else {
            reportBox.innerHTML = `
                <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; padding: 15px; border-radius: 12px; font-size: 0.85rem;">
                    <strong>✅ No Belady's Anomaly Detected</strong><br>
                    For the current reference string, FIFO page faults decreased or remained steady across all frame sizes.
                </div>
            `;
        }
    }
}

let beladyChartInstance = null;
function renderBeladyChart(labels, fifo, lru, optimal) {
    const canvas = document.getElementById('belady-chart');
    if (!canvas) return;

    if (beladyChartInstance) {
        beladyChartInstance.destroy();
    }

    beladyChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'FIFO Faults',
                    data: fifo,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'LRU Faults',
                    data: lru,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'Optimal Faults',
                    data: optimal,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8' }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Number of Frames', color: '#94a3b8' },
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    title: { display: true, text: 'Page Faults', color: '#94a3b8' },
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function updateGameUI() {
    const algo = window.algo;
    document.getElementById('game-hits-val').innerText = algo.gameHits;
    document.getElementById('game-faults-val').innerText = algo.gameFaults;
    
    const processed = algo.gameHits + algo.gameFaults;
    const ratio = processed > 0 ? ((algo.gameHits / processed) * 100).toFixed(1) : 0;
    document.getElementById('game-ratio-val').innerText = ratio + "%";

    const stringDiv = document.getElementById('game-reference-string-progression');
    if (stringDiv) {
        stringDiv.innerHTML = algo.refString.map((val, idx) => {
            let borderStyle = '';
            if (idx === algo.gameIndex) borderStyle = 'border: 2px solid var(--primary); background: rgba(99,102,241,0.25); font-weight:800;';
            else if (idx < algo.gameIndex) borderStyle = 'color: var(--text-muted); opacity: 0.5;';
            
            return `<span style="padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.05); ${borderStyle}">${val}</span>`;
        }).join(' ➔ ');
    }
}

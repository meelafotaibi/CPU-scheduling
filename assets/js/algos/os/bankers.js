// bankers.js - Upgraded Banker's Safety & RAG Engine

class BankersAlgo {
    constructor() {
        this.processes = 5;
        this.resources = 3;

        // Default initial matrices
        this.allocation = [
            [0, 1, 0], // P0
            [2, 0, 0], // P1
            [3, 0, 2], // P2
            [2, 1, 1], // P3
            [0, 0, 2]  // P4
        ];

        this.max = [
            [7, 5, 3], // P0
            [3, 2, 2], // P1
            [9, 0, 2], // P2
            [2, 2, 2], // P3
            [4, 3, 3]  // P4
        ];

        this.available = [3, 3, 2];
        this.initialAvailable = [...this.available];
        this.need = [];
        this.steps = [];
        this.canvas = null;
        this.ctx = null;
        
        // Interactive Request Mode states
        this.activeRequestPid = 0;
        this.activeRequestVector = [0, 0, 0];

        // Game State
        this.gameMode = false;
        this.gameScore = 0;
        this.gameLives = 3;
        this.gameTimer = null;
        this.gameTimeRemaining = 60;
        this.incomingRequestsQueue = [];

        this.calcNeed();
    }

    setCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.initResize();
        }
    }

    initResize() {
        const resize = () => {
            if (!this.canvas) return;
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight || 320;
            this.drawRAG();
        };
        window.addEventListener('resize', resize);
        resize();
    }

    calcNeed() {
        this.need = [];
        for (let i = 0; i < this.processes; i++) {
            let row = [];
            for (let j = 0; j < this.resources; j++) {
                row.push(Math.max(0, this.max[i][j] - this.allocation[i][j]));
            }
            this.need.push(row);
        }
    }

    calculateSafety() {
        this.steps = [];
        let work = [...this.available];
        let finish = new Array(this.processes).fill(false);
        let safeSeq = [];

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
                        for (let k = 0; k < this.resources; k++) {
                            work[k] += this.allocation[p][k];
                        }
                        safeSeq.push(p);
                        finish[p] = true;
                        found = true;
                        count++;

                        this.steps.push({
                            type: 'safe',
                            pid: p,
                            work: [...work],
                            msg: `Process P${p} need fits. Executed. Available becomes Work + Allocation: [${work.join(', ')}]`
                        });
                    }
                }
            }

            if (found === false) {
                this.steps.push({
                    type: 'deadlock',
                    msg: "System is in an UNSAFE STATE! Possible deadlock."
                });
                return false;
            }
        }

        this.steps.push({
            type: 'final',
            msg: `Safe state confirmed. Safe Sequence: P${safeSeq.join(' ➔ P')}`
        });
        return true;
    }

    // Try requesting resources dynamically
    requestResources(pid, requestVector) {
        // Step 1: Check if Request <= Need
        for (let j = 0; j < this.resources; j++) {
            if (requestVector[j] > this.need[pid][j]) {
                return { success: false, msg: `Error: Process P${pid} requested more than its max need.` };
            }
        }

        // Step 2: Check if Request <= Available
        for (let j = 0; j < this.resources; j++) {
            if (requestVector[j] > this.available[j]) {
                return { success: false, msg: `P${pid} must wait. Resources are currently unavailable.` };
            }
        }

        // Step 3: Speculatively allocate
        for (let j = 0; j < this.resources; j++) {
            this.available[j] -= requestVector[j];
            this.allocation[pid][j] += requestVector[j];
            this.need[pid][j] -= requestVector[j];
        }

        // Check if new state is safe
        const safe = this.calculateSafety();

        if (safe) {
            this.drawRAG();
            return { success: true, msg: `Request APPROVED! System remains safe.` };
        } else {
            // Rollback
            for (let j = 0; j < this.resources; j++) {
                this.available[j] += requestVector[j];
                this.allocation[pid][j] -= requestVector[j];
                this.need[pid][j] += requestVector[j];
            }
            this.calcNeed();
            this.drawRAG();
            return { success: false, msg: `Request DENIED! Approving this would lead to an unsafe state.` };
        }
    }

    // Cycle detection in Resource Allocation Graph using DFS
    detectRAGCycles() {
        const adj = {};
        const V = this.processes + this.resources; // P0..P(n-1) are 0..n-1, R0..R(m-1) are n..n+m-1

        for (let i = 0; i < V; i++) adj[i] = [];

        // Allocation edges: Resource R_j to Process P_i (index: processes + j ➔ i)
        for (let i = 0; i < this.processes; i++) {
            for (let j = 0; j < this.resources; j++) {
                if (this.allocation[i][j] > 0) {
                    adj[this.processes + j].push(i);
                }
            }
        }

        // Request/Need edges: Process P_i to Resource R_j (index: i ➔ processes + j)
        for (let i = 0; i < this.processes; i++) {
            for (let j = 0; j < this.resources; j++) {
                if (this.need[i][j] > 0) {
                    adj[i].push(this.processes + j);
                }
            }
        }

        // DFS to find cycle
        const visited = new Array(V).fill(false);
        const recStack = new Array(V).fill(false);
        const cycleEdges = [];
        let hasCycle = false;

        const dfs = (v, parentMap = {}) => {
            visited[v] = true;
            recStack[v] = true;

            for (const neighbor of adj[v]) {
                if (!visited[neighbor]) {
                    parentMap[neighbor] = v;
                    if (dfs(neighbor, parentMap)) return true;
                } else if (recStack[neighbor]) {
                    // Cycle detected, trace back
                    let curr = v;
                    cycleEdges.push({ from: curr, to: neighbor });
                    while (curr !== neighbor && parentMap[curr] !== undefined) {
                        const p = parentMap[curr];
                        cycleEdges.push({ from: p, to: curr });
                        curr = p;
                    }
                    hasCycle = true;
                    return true;
                }
            }

            recStack[v] = false;
            return false;
        };

        for (let i = 0; i < V; i++) {
            if (!visited[i]) {
                if (dfs(i)) break;
            }
        }

        return { hasCycle, cycleEdges };
    }

    // Draw the Resource Allocation Graph on canvas
    drawRAG() {
        if (!this.canvas || !this.ctx) return;

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const isDark = document.body.getAttribute('data-theme') === 'dark';

        this.ctx.clearRect(0, 0, cw, ch);

        const procCount = this.processes;
        const resCount = this.resources;

        // Position nodes
        const procNodes = [];
        const resNodes = [];

        const leftX = cw * 0.25;
        const rightX = cw * 0.75;

        // Space out processes
        for (let i = 0; i < procCount; i++) {
            procNodes.push({
                x: leftX,
                y: ch * 0.15 + (i * (ch * 0.7)) / Math.max(1, procCount - 1),
                label: `P${i}`,
                id: i
            });
        }

        // Space out resources
        for (let j = 0; j < resCount; j++) {
            resNodes.push({
                x: rightX,
                y: ch * 0.2 + (j * (ch * 0.6)) / Math.max(1, resCount - 1),
                label: `R${String.fromCharCode(65 + j)}`,
                id: procCount + j,
                instances: this.allocation.reduce((sum, row) => sum + row[j], 0) + this.available[j]
            });
        }

        // Draw edges
        const cycleInfo = this.detectRAGCycles();

        const drawArrow = (fromX, fromY, toX, toY, color, isDashed = false, isGlow = false) => {
            this.ctx.strokeStyle = color;
            this.ctx.fillStyle = color;
            this.ctx.lineWidth = isGlow ? 3.5 : 1.5;
            this.ctx.setLineDash(isDashed ? [6, 4] : []);

            if (isGlow) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = color;
            } else {
                this.ctx.shadowBlur = 0;
            }

            // Draw line
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(toY - fromY, toX - fromX);
            this.ctx.beginPath();
            this.ctx.moveTo(toX, toY);
            this.ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
            this.ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
            this.ctx.closePath();
            this.ctx.fill();

            // Reset styles
            this.ctx.shadowBlur = 0;
            this.ctx.setLineDash([]);
        };

        // Draw Allocation Edges: Resource ➔ Process
        for (let i = 0; i < procCount; i++) {
            for (let j = 0; j < resCount; j++) {
                if (this.allocation[i][j] > 0) {
                    const rNode = resNodes[j];
                    const pNode = procNodes[i];
                    
                    // Adjust edge anchor points to avoid overlapping node bounds
                    const dx = pNode.x - rNode.x;
                    const dy = pNode.y - rNode.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    const fromX = rNode.x + (dx / dist) * 20;
                    const fromY = rNode.y + (dy / dist) * 20;
                    const toX = pNode.x - (dx / dist) * 20;
                    const toY = pNode.y - (dy / dist) * 20;

                    // Check if part of detected cycle
                    const isCycle = cycleInfo.hasCycle && cycleInfo.cycleEdges.some(edge => edge.from === rNode.id && edge.to === pNode.id);
                    const color = isCycle ? '#ef4444' : '#22c55e'; // Red if cycle, Green if standard allocation

                    drawArrow(fromX, fromY, toX, toY, color, false, isCycle);
                }
            }
        }

        // Draw Request/Need Edges: Process ➔ Resource
        for (let i = 0; i < procCount; i++) {
            for (let j = 0; j < resCount; j++) {
                if (this.need[i][j] > 0) {
                    const pNode = procNodes[i];
                    const rNode = resNodes[j];

                    const dx = rNode.x - pNode.x;
                    const dy = rNode.y - pNode.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    const fromX = pNode.x + (dx / dist) * 20;
                    const fromY = pNode.y + (dy / dist) * 20;
                    const toX = rNode.x - (dx / dist) * 20;
                    const toY = rNode.y - (dy / dist) * 20;

                    const isCycle = cycleInfo.hasCycle && cycleInfo.cycleEdges.some(edge => edge.from === pNode.id && edge.to === rNode.id);
                    const color = isCycle ? '#ef4444' : '#eab308'; // Red if cycle, Yellow if request

                    drawArrow(fromX, fromY, toX, toY, color, true, isCycle);
                }
            }
        }

        // Draw Process Nodes
        procNodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            this.ctx.fillStyle = isDark ? '#1e1b4b' : '#dbeafe';
            this.ctx.strokeStyle = '#3b82f6';
            this.ctx.lineWidth = 2.5;
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = isDark ? '#f8fafc' : '#1e3a8a';
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label, node.x, node.y);
        });

        // Draw Resource Nodes
        resNodes.forEach(node => {
            const size = 34;
            this.ctx.fillStyle = isDark ? '#2e1507' : '#ffedd5';
            this.ctx.strokeStyle = '#f97316';
            this.ctx.lineWidth = 2.5;
            
            // Draw square
            this.ctx.fillRect(node.x - size/2, node.y - size/2, size, size);
            this.ctx.strokeRect(node.x - size/2, node.y - size/2, size, size);

            this.ctx.fillStyle = isDark ? '#f8fafc' : '#7c2d12';
            this.ctx.font = 'bold 12px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label, node.x, node.y - 6);

            // Draw available/total instances dots
            this.ctx.font = '9px Arial';
            this.ctx.fillStyle = isDark ? '#f97316' : '#ea580c';
            this.ctx.fillText(`[${node.instances}]`, node.x, node.y + 8);
        });

        // Draw deadlock status text
        if (cycleInfo.hasCycle) {
            this.ctx.fillStyle = '#ef4444';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⚠️ DEADLOCK DETECTED (RAG CYCLE)', cw / 2, ch - 15);
        }
    }

    // ==========================================
    // GAME MODE: DEADLOCK DISPATCHER
    // ==========================================

    toggleGameMode() {
        const gamePanel = document.getElementById('game-panel');
        const standardPanel = document.getElementById('standard-controls');
        
        if (this.gameMode) {
            // Deactivate
            this.gameMode = false;
            clearInterval(this.gameTimer);
            if (gamePanel) gamePanel.style.display = 'none';
            if (standardPanel) standardPanel.style.display = 'flex';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Deadlock Dispatcher Game';
            this.resetState();
        } else {
            // Activate
            this.gameMode = true;
            this.gameScore = 0;
            this.gameLives = 3;
            this.gameTimeRemaining = 60;
            this.incomingRequestsQueue = [];
            
            if (gamePanel) gamePanel.style.display = 'block';
            if (standardPanel) standardPanel.style.display = 'none';
            document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Exit Game';

            // Generate initial state
            this.allocation = [
                [0, 1, 0],
                [1, 0, 0],
                [1, 0, 1],
                [0, 1, 1],
                [0, 0, 1]
            ];
            this.max = [
                [2, 1, 1],
                [3, 2, 2],
                [2, 1, 2],
                [2, 2, 1],
                [1, 3, 2]
            ];
            this.available = [3, 2, 2];
            this.calcNeed();
            
            generateIncomingRequest();
            generateIncomingRequest();
            
            if (this.gameTimer) clearInterval(this.gameTimer);
            this.gameTimer = setInterval(() => this.gameTimerTick(), 1000);
            
            renderTables();
            this.drawRAG();
            updateGameUI();
        }
    }

    gameTimerTick() {
        this.gameTimeRemaining--;
        if (this.gameTimeRemaining <= 0) {
            this.endGame(true);
        }
        updateGameUI();
    }

    dispatchRequest(approve) {
        if (this.incomingRequestsQueue.length === 0) return;
        const req = this.incomingRequestsQueue.shift();
        
        const logBox = document.getElementById('log-display');

        if (approve) {
            // Check if resources are actually available for speculative check
            let fits = true;
            for (let j = 0; j < this.resources; j++) {
                if (req.vector[j] > this.available[j]) {
                    fits = false;
                    break;
                }
            }

            if (!fits) {
                this.gameLives--;
                logBox.innerHTML = `<span style="color:var(--accent);">OOPS!</span> Approved request for P${req.pid} failed. Available resources were insufficient.`;
                if (this.gameLives <= 0) this.endGame(false);
            } else {
                // Test safety
                for (let j = 0; j < this.resources; j++) {
                    this.available[j] -= req.vector[j];
                    this.allocation[req.pid][j] += req.vector[j];
                    this.need[req.pid][j] = Math.max(0, this.need[req.pid][j] - req.vector[j]);
                }

                const safe = this.calculateSafety();
                if (safe) {
                    this.gameScore += 15;
                    logBox.innerHTML = `<span style="color:var(--success);">SAFE DISPATCH!</span> Approved P${req.pid}'s request. System remains safe.`;
                } else {
                    // unsafe approval leads to deadlock game loss
                    this.gameLives = 0;
                    logBox.innerHTML = `<span style="color:var(--accent);">CRITICAL ERROR!</span> Allocating these resources led to an unsafe state. System deadlocked.`;
                    this.endGame(false);
                    return;
                }
            }
        } else {
            // Verify if rejecting was the correct choice (i.e. approving would have been unsafe OR resources are unavailable)
            let wouldBeUnsafe = false;
            let fits = true;
            for (let j = 0; j < this.resources; j++) {
                if (req.vector[j] > this.available[j]) fits = false;
            }

            if (fits) {
                // Test if it would have been safe
                for (let j = 0; j < this.resources; j++) {
                    this.available[j] -= req.vector[j];
                    this.allocation[req.pid][j] += req.vector[j];
                    this.need[req.pid][j] = Math.max(0, this.need[req.pid][j] - req.vector[j]);
                }
                const safe = this.calculateSafety();
                
                // Rollback
                for (let j = 0; j < this.resources; j++) {
                    this.available[j] += req.vector[j];
                    this.allocation[req.pid][j] -= req.vector[j];
                    this.need[req.pid][j] += req.vector[j];
                }
                this.calcNeed();

                if (safe) wouldBeUnsafe = false;
                else wouldBeUnsafe = true;
            } else {
                wouldBeUnsafe = true; // Rejecting is right if they don't fit
            }

            if (wouldBeUnsafe) {
                this.gameScore += 10;
                logBox.innerHTML = `<span style="color:var(--success);">GOOD CALL!</span> Rejected unsafe request from P${req.pid}.`;
            } else {
                this.gameLives--;
                logBox.innerHTML = `<span style="color:var(--accent);">INCORRECT!</span> Rejected a completely safe request from P${req.pid}.`;
                if (this.gameLives <= 0) this.endGame(false);
            }
        }

        // Spawn next request
        generateIncomingRequest();
        renderTables();
        this.drawRAG();
        updateGameUI();
    }

    endGame(timeOut) {
        this.gameMode = false;
        clearInterval(this.gameTimer);
        
        const gamePanel = document.getElementById('game-panel');
        const standardPanel = document.getElementById('standard-controls');
        if (gamePanel) gamePanel.style.display = 'none';
        if (standardPanel) standardPanel.style.display = 'flex';
        document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Deadlock Dispatcher Game';

        const highscore = localStorage.getItem('bankers_highscore') || 0;
        let scoreMessage = '';
        if (this.gameScore > highscore) {
            localStorage.setItem('bankers_highscore', this.gameScore);
            scoreMessage = `🏆 NEW HIGH SCORE!`;
        } else {
            scoreMessage = `High Score: ${highscore}`;
        }

        alert(`Game Over! ${timeOut ? "Time's up!" : "System crashed/Out of lives."}\n\nYour Score: ${this.gameScore}\n${scoreMessage}`);
        this.resetState();
    }

    resetState() {
        this.allocation = [
            [0, 1, 0],
            [2, 0, 0],
            [3, 0, 2],
            [2, 1, 1],
            [0, 0, 2]
        ];
        this.max = [
            [7, 5, 3],
            [3, 2, 2],
            [9, 0, 2],
            [2, 2, 2],
            [4, 3, 3]
        ];
        this.available = [3, 3, 2];
        this.calcNeed();
        renderTables();
        this.drawRAG();
        
        const logBox = document.getElementById('log-display');
        if (logBox) logBox.innerText = "System reset. Available: [3, 3, 2]";
    }
}

// Global script helpers
function generateIncomingRequest() {
    const algo = window.algo;
    const pid = Math.floor(Math.random() * algo.processes);
    
    // Request must be <= Process's Need vector
    const vector = [];
    for (let j = 0; j < algo.resources; j++) {
        const maxLimit = Math.max(0, algo.need[pid][j]);
        vector.push(Math.floor(Math.random() * (maxLimit + 1)));
    }
    
    // Ensure request is not completely empty
    if (vector.every(v => v === 0)) {
        vector[Math.floor(Math.random() * algo.resources)] = 1;
    }
    
    algo.incomingRequestsQueue.push({ pid, vector });
}

function updateGameUI() {
    const algo = window.algo;
    document.getElementById('game-score').innerText = algo.gameScore;
    document.getElementById('game-lives').innerText = '❤️'.repeat(algo.gameLives);
    document.getElementById('game-timer').innerText = algo.gameTimeRemaining + 's';

    const queueDiv = document.getElementById('incoming-requests-queue');
    if (queueDiv) {
        queueDiv.innerHTML = algo.incomingRequestsQueue.map((req, index) => `
            <div class="glass-card" style="padding: 10px; border: 1px solid var(--accent); background: rgba(239, 68, 68, 0.05); min-width: 120px; text-align: center; ${index === 0 ? 'border-color: var(--primary); background: rgba(99,102,241,0.15); font-weight:bold;' : ''}">
                <span style="font-size: 0.8rem; color: var(--text-muted);">Process P${req.pid}</span>
                <div style="font-size: 1.1rem; color: var(--primary); margin-top: 5px;">[${req.vector.join(', ')}]</div>
            </div>
        `).join('');
    }
}

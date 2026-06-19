// memory-allocation.js - Upgraded Memory Management Engine
// Incorporating First, Best, Worst, Next Fit, Buddy System, Defragmentation, Deallocation, and the Memory Manager Game.

let activeMode = 'compare'; // 'compare' or 'interactive'
let currentStrategy = 'first'; // 'first', 'best', 'worst', 'next', 'buddy'
let nextFitPointer = 0; // Tracks the search start block index for Next Fit

// Memory engine config
let partitions = [100, 500, 200, 300, 600];
let initialPartitions = [...partitions];
let blocks = []; // Current state: [{ id, startAddress, size, free, processId, processSize }]
let processes = [
    { id: 1, size: 212, status: 'waiting' },
    { id: 2, size: 417, status: 'waiting' },
    { id: 3, size: 112, status: 'waiting' },
    { id: 4, size: 426, status: 'waiting' }
];

// Game State
let gameState = {
    active: false,
    score: 0,
    lives: 3,
    level: 'easy',
    timeRemaining: 60,
    timerId: null,
    queue: []
};

// Canvas references
let canvas = null;
let ctx = null;

// Initialize
window.onload = () => {
    canvas = document.getElementById('memory-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.addEventListener('click', handleCanvasClick);
    }
    
    // Set up responsive canvas resize
    initCanvasResize();
    
    // Initial UI render
    renderPartitions();
    updateUI();
    resetSimulation();
};

function initCanvasResize() {
    if (!canvas) return;
    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawMemory();
    };
    window.addEventListener('resize', resize);
    resize();
}

// Generate the initial blocks list
function resetSimulation() {
    const strategy = document.getElementById('strategy-select').value;
    currentStrategy = strategy;
    nextFitPointer = 0;
    
    if (strategy === 'buddy') {
        // Buddy System starts with one large block of memory (e.g. 1024K)
        blocks = [{
            id: 1,
            startAddress: 0,
            size: 1024,
            free: true,
            processId: null,
            processSize: 0
        }];
        document.getElementById('partition-container-wrapper').style.display = 'none';
    } else {
        document.getElementById('partition-container-wrapper').style.display = 'block';
        let currentAddr = 0;
        blocks = partitions.map((size, idx) => {
            const block = {
                id: idx + 1,
                startAddress: currentAddr,
                size: size,
                free: true,
                processId: null,
                processSize: 0
            };
            currentAddr += size;
            return block;
        });
    }

    processes.forEach(p => p.status = 'waiting');
    
    updateUI();
    drawMemory();
    logMessage("Memory reset. Strategy set to: " + strategy.toUpperCase());
}

function renderPartitions() {
    const container = document.getElementById('partition-container');
    if (!container) return;
    container.innerHTML = partitions.map((size, i) => `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; position: relative;">
            <input type="number" value="${size}" onchange="updatePartition(${i}, this.value)" style="width: 70px; padding: 5px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; text-align: center; background: rgba(0,0,0,0.2); color: var(--text);">
            <button onclick="removePartition(${i})" style="border: none; background: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; line-height: 1;">&times;</button>
        </div>
    `).join('');
}

function updatePartition(index, value) {
    const val = parseInt(value);
    if (!isNaN(val) && val > 0) {
        partitions[index] = val;
        resetSimulation();
    }
}

function addPartition() {
    partitions.push(200);
    renderPartitions();
    resetSimulation();
}

function removePartition(index) {
    if (partitions.length > 1) {
        partitions.splice(index, 1);
        renderPartitions();
        resetSimulation();
    }
}

function updateUI() {
    // Render process list
    const list = document.getElementById('process-list');
    if (!list) return;
    list.innerHTML = processes.map((p, index) => `
        <li class="process-item" style="border-left: 4px solid ${p.status === 'allocated' ? 'var(--success)' : p.status === 'fail' ? 'var(--accent)' : 'var(--text-muted)'}; margin-bottom: 8px; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.02); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 0.9rem;">P${p.id} (${p.size}K)</span>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span class="status-badge status-${p.status}">${p.status.toUpperCase()}</span>
                ${p.status === 'allocated' ? `
                    <button onclick="deallocateProcess(${p.id})" class="btn" style="padding: 2px 8px; font-size: 0.75rem; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">
                        Free
                    </button>
                ` : ''}
                <button onclick="deleteProcess(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');

    // Update challenge stats if active
    if (gameState.active) {
        document.getElementById('game-score').innerText = gameState.score;
        document.getElementById('game-lives').innerText = '❤️'.repeat(gameState.lives);
        document.getElementById('game-timer').innerText = gameState.timeRemaining + 's';
        
        const qContainer = document.getElementById('game-request-queue');
        if (qContainer) {
            qContainer.innerHTML = gameState.queue.map(req => `
                <div class="glass-card" style="padding: 10px 15px; text-align: center; border: 1px solid var(--primary); background: rgba(99, 102, 241, 0.15); min-width: 90px; border-radius: 12px; animation: pulse 1.5s infinite;">
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Process ${req.id}</span>
                    <strong style="font-size: 1.1rem; color: var(--primary);">${req.size}K</strong>
                </div>
            `).join('');
        }
    }
}

function addProcess() {
    const size = prompt("Enter process size (K):", "150");
    if (size && !isNaN(parseInt(size)) && parseInt(size) > 0) {
        processes.push({ id: processes.length + 1, size: parseInt(size), status: 'waiting' });
        updateUI();
    }
}

function deleteProcess(index) {
    const proc = processes[index];
    if (proc.status === 'allocated') {
        deallocateProcess(proc.id);
    }
    processes.splice(index, 1);
    updateUI();
}

function logMessage(msg) {
    const logBox = document.getElementById('explanation-text');
    if (logBox) {
        logBox.innerHTML = `<div>${msg}</div>` + logBox.innerHTML;
    }
}

// Click to Deallocate from Canvas
function handleCanvasClick(event) {
    if (gameState.active) return; // Disable interactive click-free in game mode
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const cw = canvas.width;
    const ch = canvas.height;
    const margin = 40;
    const availableWidth = cw - 2 * margin;
    const barHeight = 85;
    const y = ch / 2 - barHeight / 2;
    
    if (clickY >= y && clickY <= y + barHeight && clickX >= margin && clickX <= cw - margin) {
        // Find which block was clicked
        const totalMemory = blocks.reduce((sum, b) => sum + b.size, 0);
        let currentX = margin;
        
        for (let i = 0; i < blocks.length; i++) {
            const blockWidth = (blocks[i].size / totalMemory) * availableWidth;
            if (clickX >= currentX && clickX <= currentX + blockWidth) {
                if (!blocks[i].free) {
                    logMessage(`Clicked on block ${blocks[i].id} occupied by P${blocks[i].processId}. Deallocating...`);
                    deallocateProcess(blocks[i].processId);
                } else {
                    logMessage(`Clicked on free block of size ${blocks[i].size}K`);
                }
                break;
            }
            currentX += blockWidth;
        }
    }
}

// Memory Allocation Action Loop
async function runAllocation() {
    if (gameState.active) return;
    
    logMessage("Starting allocation cycle...");
    let anyAllocated = false;
    
    for (let p of processes) {
        if (p.status !== 'waiting') continue;
        
        let allocIndex = -1;
        
        if (currentStrategy === 'first') {
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].free && blocks[i].size >= p.size) {
                    allocIndex = i;
                    break;
                }
            }
        } else if (currentStrategy === 'best') {
            let minGap = Infinity;
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].free && blocks[i].size >= p.size) {
                    let gap = blocks[i].size - p.size;
                    if (gap < minGap) {
                        minGap = gap;
                        allocIndex = i;
                    }
                }
            }
        } else if (currentStrategy === 'worst') {
            let maxGap = -1;
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].free && blocks[i].size >= p.size) {
                    let gap = blocks[i].size - p.size;
                    if (gap > maxGap) {
                        maxGap = gap;
                        allocIndex = i;
                    }
                }
            }
        } else if (currentStrategy === 'next') {
            const n = blocks.length;
            let count = 0;
            let i = nextFitPointer;
            while (count < n) {
                if (blocks[i].free && blocks[i].size >= p.size) {
                    allocIndex = i;
                    nextFitPointer = (i + 1) % n;
                    break;
                }
                i = (i + 1) % n;
                count++;
            }
        } else if (currentStrategy === 'buddy') {
            allocIndex = findBuddyIndexForSize(p.size);
            if (allocIndex !== -1) {
                // Perform dynamic buddy splits
                splitBuddyBlock(allocIndex, p.size);
                // Search again after splits to get the exact leaf block
                allocIndex = blocks.findIndex(b => b.free && b.size >= p.size && b.size / 2 < p.size);
            }
        }
        
        if (allocIndex !== -1) {
            blocks[allocIndex].free = false;
            blocks[allocIndex].processId = p.id;
            blocks[allocIndex].processSize = p.size;
            p.status = 'allocated';
            anyAllocated = true;
            logMessage(`<span style="color:var(--success);">SUCCESS:</span> Allocated P${p.id} (${p.size}K) into Block ${blocks[allocIndex].id}`);
            
            drawMemory();
            updateUI();
            await new Promise(r => setTimeout(r, 600));
        } else {
            p.status = 'fail';
            logMessage(`<span style="color:var(--accent);">FAILED:</span> Insufficient contiguous memory for P${p.id} (${p.size}K)`);
            updateUI();
        }
    }
    
    if (anyAllocated) {
        logMessage("Allocation cycle complete.");
    } else {
        logMessage("No waiting processes could be allocated.");
    }
}

// Buddy System Splitting Calculations
function findBuddyIndexForSize(size) {
    // Find a free block that can accommodate the request
    // If multiple, pick the smallest power of 2 size block that fits
    let bestIndex = -1;
    let minFitSize = Infinity;
    
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].free && blocks[i].size >= size) {
            if (blocks[i].size < minFitSize) {
                minFitSize = blocks[i].size;
                bestIndex = i;
            }
        }
    }
    return bestIndex;
}

function splitBuddyBlock(index, reqSize) {
    let block = blocks[index];
    // Keep splitting until the block is the smallest power-of-2 size that can fit the request
    while (block.size / 2 >= reqSize) {
        const halfSize = block.size / 2;
        const buddy1 = {
            id: blocks.length + 1,
            startAddress: block.startAddress,
            size: halfSize,
            free: true,
            processId: null,
            processSize: 0
        };
        const buddy2 = {
            id: blocks.length + 2,
            startAddress: block.startAddress + halfSize,
            size: halfSize,
            free: true,
            processId: null,
            processSize: 0
        };
        
        // Replace original block with the two buddies
        blocks.splice(index, 1, buddy1, buddy2);
        logMessage(`Split Buddy Block of size ${halfSize * 2}K into two buddies of ${halfSize}K`);
        block = buddy1; // Continue check on the left buddy
    }
}

// Deallocate process and trigger coalescing
function deallocateProcess(processId) {
    let found = false;
    blocks.forEach(b => {
        if (b.processId === processId) {
            b.free = true;
            b.processId = null;
            b.processSize = 0;
            found = true;
            logMessage(`Deallocated Process P${processId}`);
        }
    });

    if (found) {
        const p = processes.find(proc => proc.id === processId);
        if (p) p.status = 'waiting';
        
        if (currentStrategy === 'buddy') {
            coalesceBuddyBlocks();
        } else {
            coalesceContiguousFreeBlocks();
        }
        
        drawMemory();
        updateUI();
    }
}

// Coalesce standard adjacent partition blocks
function coalesceContiguousFreeBlocks() {
    // Only merges adjacent blocks that were dynamically split, or merges standard ones?
    // In typical fixed-partitioning we don't coalesce unless it's a dynamic allocation system.
    // However, if defragmented or if dynamic block splitting is enabled:
    // Let's implement coalescing for dynamic partitions if we do allocation partitioning.
    // For general simplicity, we do standard partition visualizer where partitions remain fixed.
    // Let's leave standard partitions fixed and let Defragmentation slide allocations.
}

// Coalesce Buddy System Blocks
function coalesceBuddyBlocks() {
    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < blocks.length - 1; i++) {
            const b1 = blocks[i];
            const b2 = blocks[i + 1];
            
            // Checking if they are buddies:
            // 1. Both free
            // 2. Same size
            // 3. b1 starts at a multiple of 2 * size
            if (b1.free && b2.free && b1.size === b2.size && (b1.startAddress % (2 * b1.size) === 0)) {
                // Merge them
                const mergedBlock = {
                    id: blocks.length + 1,
                    startAddress: b1.startAddress,
                    size: b1.size * 2,
                    free: true,
                    processId: null,
                    processSize: 0
                };
                blocks.splice(i, 2, mergedBlock);
                logMessage(`Coalesced two buddies of size ${b1.size}K into a single ${mergedBlock.size}K block`);
                changed = true;
                break;
            }
        }
    }
}

// Compaction (Defragmentation)
function compactMemory() {
    if (gameState.active) return;
    if (currentStrategy === 'buddy') {
        logMessage("Buddy system does not support slide compaction (defragmentation) due to power-of-2 hierarchy constraint.");
        return;
    }

    logMessage("Performing memory defragmentation (compaction)...");
    
    // Separate active allocations from free blocks
    const activeAllocations = blocks.filter(b => !b.free).map(b => ({
        processId: b.processId,
        processSize: b.processSize
    }));
    
    // Re-create the memory layout with same partitions
    let currentAddr = 0;
    blocks = partitions.map((size, idx) => ({
        id: idx + 1,
        startAddress: currentAddr,
        size: size,
        free: true,
        processId: null,
        processSize: 0
    }));
    
    // Place active allocations sequentially to the left
    let allocIdx = 0;
    activeAllocations.forEach(alloc => {
        while (allocIdx < blocks.length) {
            if (blocks[allocIdx].size >= alloc.processSize) {
                blocks[allocIdx].free = false;
                blocks[allocIdx].processId = alloc.processId;
                blocks[allocIdx].processSize = alloc.processSize;
                allocIdx++;
                break;
            }
            allocIdx++;
        }
    });

    logMessage("<span style='color:var(--success);'>COMPACTION COMPLETE:</span> All allocated blocks shifted left, free block spaces consolidated.");
    
    drawMemory();
    updateUI();
}

// Draw the blocks on canvas
function drawMemory() {
    if (!canvas || !ctx) return;
    
    const cw = canvas.width;
    const ch = canvas.height;
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    ctx.clearRect(0, 0, cw, ch);
    
    if (blocks.length === 0) return;
    
    const totalMemory = blocks.reduce((sum, b) => sum + b.size, 0);
    const margin = 40;
    const availableWidth = cw - 2 * margin;
    const barHeight = 85;
    const y = ch / 2 - barHeight / 2;
    
    // Theme details
    const colors = {
        free: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
        busy: '#3b82f6',
        text: isDark ? '#f8fafc' : '#0f172a',
        border: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
        nextPointer: 'var(--accent)'
    };
    
    let currentX = margin;
    
    blocks.forEach((block, idx) => {
        const blockWidth = (block.size / totalMemory) * availableWidth;
        
        // Draw Block Box
        ctx.fillStyle = block.free ? colors.free : colors.busy;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1.5;
        
        ctx.fillRect(currentX, y, blockWidth, barHeight);
        ctx.strokeRect(currentX, y, blockWidth, barHeight);
        
        // Next Fit Pointer indicator
        if (currentStrategy === 'next' && idx === nextFitPointer) {
            ctx.fillStyle = colors.nextPointer;
            ctx.beginPath();
            ctx.moveTo(currentX + blockWidth / 2 - 8, y - 10);
            ctx.lineTo(currentX + blockWidth / 2 + 8, y - 10);
            ctx.lineTo(currentX + blockWidth / 2, y - 2);
            ctx.closePath();
            ctx.fill();
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('NEXT', currentX + blockWidth / 2, y - 14);
        }
        
        // Render labels
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        
        // Size Label (below block)
        ctx.fillText(`${block.size}K`, currentX + blockWidth / 2, y + barHeight + 18);
        
        // Address label (start of block)
        ctx.font = '9px monospace';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.textAlign = 'left';
        ctx.fillText(`${block.startAddress}K`, currentX, y - 5);
        
        if (idx === blocks.length - 1) {
            ctx.textAlign = 'right';
            ctx.fillText(`${block.startAddress + block.size}K`, currentX + blockWidth, y - 5);
        }
        
        // Process name / Info
        if (!block.free) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`P${block.processId}`, currentX + blockWidth / 2, y + barHeight / 2 + 2);
            ctx.font = '10px Arial';
            ctx.fillText(`(${block.processSize}K)`, currentX + blockWidth / 2, y + barHeight / 2 + 16);
        } else {
            ctx.fillStyle = isDark ? 'rgba(255,255,255,0.4)' : '#64748b';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Free', currentX + blockWidth / 2, y + barHeight / 2 + 5);
        }
        
        currentX += blockWidth;
    });
}

// ==========================================
// GAME MODE: MEMORY MANAGER CHALLENGE
// ==========================================

function toggleGameMode() {
    const panel = document.getElementById('game-panel');
    const visualizerControls = document.getElementById('standard-controls');
    
    if (gameState.active) {
        // Deactivate Game Mode
        gameState.active = false;
        clearInterval(gameState.timerId);
        if (panel) panel.style.display = 'none';
        if (visualizerControls) visualizerControls.style.display = 'flex';
        document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Memory Manager Challenge';
        resetSimulation();
    } else {
        // Activate Game Mode
        gameState.active = true;
        gameState.score = 0;
        gameState.lives = 3;
        gameState.queue = [];
        if (panel) panel.style.display = 'block';
        if (visualizerControls) visualizerControls.style.display = 'none';
        document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Exit Challenge';
        
        // Setup fixed partition array for standard challenge
        partitions = [150, 450, 200, 300, 600];
        initialPartitions = [...partitions];
        renderPartitions();
        
        startGameDifficulty('easy');
    }
}

function startGameDifficulty(level) {
    gameState.level = level;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.queue = [];
    
    document.querySelectorAll('.game-diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });

    if (level === 'easy') {
        gameState.timeRemaining = 60;
    } else if (level === 'medium') {
        gameState.timeRemaining = 45;
    } else {
        gameState.timeRemaining = 30;
    }
    
    // Set fixed partitions representation
    let currentAddr = 0;
    blocks = partitions.map((size, idx) => ({
        id: idx + 1,
        startAddress: currentAddr,
        size: size,
        free: true,
        processId: null,
        processSize: 0
    }));
    
    processes = [];
    
    // Clear logs
    document.getElementById('explanation-text').innerHTML = "Welcome to Memory Manager Challenge! Allocate the incoming queue of processes.";

    generateGameRequest();
    generateGameRequest();
    
    if (gameState.timerId) clearInterval(gameState.timerId);
    gameState.timerId = setInterval(gameTimerTick, 1000);
    
    updateUI();
    drawMemory();
}

function gameTimerTick() {
    gameState.timeRemaining--;
    if (gameState.timeRemaining <= 0) {
        endGame(true);
    }
    updateUI();
}

function generateGameRequest() {
    const id = processes.length + 1;
    // Generate logical process sizes
    let size = 50 + Math.floor(Math.random() * 450);
    const req = { id, size };
    gameState.queue.push(req);
    processes.push({ id, size, status: 'waiting' });
}

function playStrategyStep(targetStrategy) {
    if (!gameState.active) return;
    if (gameState.queue.length === 0) return;
    
    const p = gameState.queue[0];
    let allocIndex = -1;
    
    if (targetStrategy === 'first') {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].free && blocks[i].size >= p.size) {
                allocIndex = i;
                break;
            }
        }
    } else if (targetStrategy === 'best') {
        let minGap = Infinity;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].free && blocks[i].size >= p.size) {
                let gap = blocks[i].size - p.size;
                if (gap < minGap) {
                    minGap = gap;
                    allocIndex = i;
                }
            }
        }
    } else if (targetStrategy === 'worst') {
        let maxGap = -1;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].free && blocks[i].size >= p.size) {
                let gap = blocks[i].size - p.size;
                if (gap > maxGap) {
                    maxGap = gap;
                    allocIndex = i;
                }
            }
        }
    }
    
    if (allocIndex !== -1) {
        // Success
        blocks[allocIndex].free = false;
        blocks[allocIndex].processId = p.id;
        blocks[allocIndex].processSize = p.size;
        
        // Mark as allocated in processes list
        const pState = processes.find(proc => proc.id === p.id);
        if (pState) pState.status = 'allocated';
        
        gameState.queue.shift(); // Remove from queue
        gameState.score += 10;
        logMessage(`<span style="color:var(--success);">SCORE!</span> Allocated P${p.id} successfully.`);
        
        // Spawn next request
        generateGameRequest();
    } else {
        // Unsuccessful allocation due to fragmentation or size
        gameState.lives--;
        logMessage(`<span style="color:var(--accent);">OOF!</span> No partition fits Process P${p.id} (${p.size}K). Try deallocating space or compacting.`);
        if (gameState.lives <= 0) {
            endGame(false);
        }
    }
    
    updateUI();
    drawMemory();
}

function gameDeallocate(pId) {
    if (!gameState.active) return;
    deallocateProcess(pId);
}

function gameCompact() {
    if (!gameState.active) return;
    
    // shift allocated blocks left
    const active = blocks.filter(b => !b.free).map(b => ({
        processId: b.processId,
        processSize: b.processSize
    }));
    
    let currentAddr = 0;
    blocks = partitions.map((size, idx) => ({
        id: idx + 1,
        startAddress: currentAddr,
        size: size,
        free: true,
        processId: null,
        processSize: 0
    }));
    
    let allocIdx = 0;
    active.forEach(alloc => {
        while (allocIdx < blocks.length) {
            if (blocks[allocIdx].size >= alloc.processSize) {
                blocks[allocIdx].free = false;
                blocks[allocIdx].processId = alloc.processId;
                blocks[allocIdx].processSize = alloc.processSize;
                allocIdx++;
                break;
            }
            allocIdx++;
        }
    });
    
    logMessage("Memory compacted in Game Mode.");
    drawMemory();
    updateUI();
}

function endGame(timeOut) {
    gameState.active = false;
    clearInterval(gameState.timerId);
    
    const panel = document.getElementById('game-panel');
    const visualizerControls = document.getElementById('standard-controls');
    if (panel) panel.style.display = 'none';
    if (visualizerControls) visualizerControls.style.display = 'flex';
    document.getElementById('game-mode-btn').innerHTML = '<i class="fas fa-gamepad"></i> Memory Manager Challenge';
    
    const highscoreKey = `memory_highscore_${gameState.level}`;
    const previousHighscore = localStorage.getItem(highscoreKey) || 0;
    let highscoreMessage = '';
    
    if (gameState.score > previousHighscore) {
        localStorage.setItem(highscoreKey, gameState.score);
        highscoreMessage = `🏆 NEW HIGH SCORE for ${gameState.level.toUpperCase()}!`;
    } else {
        highscoreMessage = `High Score: ${previousHighscore}`;
    }
    
    alert(`Game Over! ${timeOut ? "Time's up!" : "Out of lives!"}\n\nYour Score: ${gameState.score}\n${highscoreMessage}`);
    resetSimulation();
}

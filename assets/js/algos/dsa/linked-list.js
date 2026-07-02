/**
 * linked-list.js - Singly, Doubly, and Circular Linked List logic with trace steps.
 */
class LinkedListAlgo {
    constructor(engine, playback, ui, listMode = 'singly') {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.listMode = listMode; // 'singly', 'doubly', or 'circular'
        this.head = null;
        this.nodeCount = 0;

        // Trace state
        this.steps = [];
        this.currentStep = 0;

        // Challenge mode state
        this.challengeActive = false;
        this.challengeNodes = []; // [{ value, x, y, next }]
        this.selectedSourceNode = null;
        this.targetSequence = [];
        this.moves = 0;

        this.initEvents();
    }

    initEvents() {
        if (this.engine.hasListListener) return;
        this.engine.hasListListener = true;
        this.engine.canvas.addEventListener('mousedown', (e) => {
            if (!window.algo || !window.algo.challengeActive) return;
            const rect = window.algo.engine.canvas.getBoundingClientRect();
            const scaleX = window.algo.engine.canvas.width / rect.width;
            const scaleY = window.algo.engine.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            window.algo.handleCanvasClick(x, y);
        });
    }

    handleCanvasClick(x, y) {
        const w = 100;
        const h = 50;

        let clicked = null;
        for (let node of this.challengeNodes) {
            const dx = x - node.x;
            const dy = y - node.y;
            if (Math.abs(dx) <= w / 2 && Math.abs(dy) <= h / 2) {
                clicked = node;
                if (dx > 0) {
                    node.clickedRight = true;
                } else {
                    node.clickedRight = false;
                }
                break;
            }
        }

        if (clicked) {
            if (this.selectedSourceNode === null) {
                if (clicked.clickedRight) {
                    this.selectedSourceNode = clicked;
                    this.ui.updateStatus(`Selected node ${clicked.value}. Now click the target node to link it, or click NULL (empty canvas area) to unlink.`);
                } else {
                    this.ui.updateStatus(`Click on the RIGHT half of a node (the pointer field) to start a link.`);
                }
            } else {
                if (this.selectedSourceNode === clicked) {
                    this.selectedSourceNode = null;
                    this.ui.updateStatus(`Selection cancelled.`);
                } else {
                    this.selectedSourceNode.next = clicked;
                    this.moves++;
                    this.selectedSourceNode = null;
                    this.ui.updateStatus(`Linked nodes! Checking correctness...`);
                    this.checkChallengeWin();
                }
            }
        } else {
            if (this.selectedSourceNode) {
                this.selectedSourceNode.next = null;
                this.moves++;
                this.selectedSourceNode = null;
                this.ui.updateStatus(`Pointer set to NULL. Checking correctness...`);
                this.checkChallengeWin();
            }
        }
        this.engine.draw();
    }

    startChallenge() {
        this.challengeActive = true;
        this.selectedSourceNode = null;
        this.moves = 0;

        const vals = [];
        while (vals.length < 4) {
            const r = Math.floor(Math.random() * 90) + 10;
            if (!vals.includes(r)) vals.push(r);
        }
        
        this.targetSequence = [...vals].sort((a, b) => a - b);
        this.challengeNodes = [];
        const cw = this.engine.canvas.width;
        const ch = this.engine.canvas.height;
        const w = 100;
        const h = 50;

        vals.forEach((val) => {
            let placed = false;
            let attempts = 0;
            let x = 0, y = 0;
            while (!placed && attempts < 100) {
                x = Math.random() * (cw - 2 * w) + w;
                y = Math.random() * (ch - 2 * h) + h;
                attempts++;
                
                let overlap = false;
                for (let other of this.challengeNodes) {
                    const dist = Math.sqrt((other.x - x) ** 2 + (other.y - y) ** 2);
                    if (dist < 150) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) placed = true;
            }
            this.challengeNodes.push({ value: val, x, y, next: null });
        });

        this.ui.updateStatus(`<i class="fas fa-crosshairs" style="color: var(--primary);"></i> Pointer Repair Challenge! Link the nodes to create the list: <b>${this.targetSequence.join(' ➔ ')}</b>.<br>Click a node's RIGHT half to link from, then click target node. Click empty space to set to NULL.`);
        this.engine.draw();
    }

    stopChallenge() {
        this.challengeActive = false;
        this.challengeNodes = [];
        this.selectedSourceNode = null;
        this.ui.updateStatus(`Exited Challenge Mode.`);
        this.engine.draw();
    }

    checkChallengeWin() {
        let current = this.challengeNodes.find(n => n.value === this.targetSequence[0]);
        if (!current) return;

        const traversed = [];
        let visited = new Set();
        while (current && !visited.has(current)) {
            traversed.push(current.value);
            visited.add(current);
            current = current.next;
        }

        const matches = traversed.length === this.targetSequence.length &&
                        traversed.every((v, idx) => v === this.targetSequence[idx]);

        if (matches) {
            this.ui.updateStatus(`<i class="fas fa-crown" style="color: #f59e0b;"></i> Match Complete! You repaired the list in <b>${this.moves} operations</b>.`);
            if (typeof GamificationSystem !== 'undefined') {
                GamificationSystem.saveScore('linked-list', 'manual_repair', this.moves, 4);
                ProgressSystem.complete('dsa', 'Linked List');
            }
            this.challengeActive = false;
        } else {
            this.ui.updateStatus(`Current List: ${traversed.length > 0 ? traversed.join(' ➔ ') : 'Empty'}<br>Keep linking! Target: <b>${this.targetSequence.join(' ➔ ')}</b>.`);
        }
    }

    resetSteps() {
        this.playback.reset();
        this.steps = [];
        this.currentStep = 0;
    }

    // Missing functions needed by linked-list.html
    insertHead(value) {
        this.insertAt(0, value);
    }

    insertTail(value) {
        this.insertAt(this.nodeCount, value);
    }

    deleteNode(value) {
        const listState = this.serializeList();
        const idx = listState.findIndex(n => n.value === value);
        if (idx !== -1) {
            this.removeAt(idx);
        } else {
            this.ui.updateStatus(`Value ${value} not found in the list.`);
        }
    }

    search(value) {
        this.resetSteps();
        const listState = this.serializeList();
        
        let foundIdx = -1;
        for (let i = 0; i < listState.length; i++) {
            const temp = listState.map((n, idx) => ({ ...n, highlight: idx === i }));
            this.steps.push({
                type: 'traverse',
                msg: `Checking node ${listState[i].value} at index ${i} for value ${value}`,
                nodes: temp
            });
            if (listState[i].value === value) {
                foundIdx = i;
                break;
            }
        }

        if (foundIdx !== -1) {
            const temp = listState.map((n, idx) => ({ ...n, highlight: idx === foundIdx }));
            this.steps.push({
                type: 'done',
                msg: `Found value ${value} at index ${foundIdx}!`,
                nodes: temp
            });
        } else {
            this.steps.push({
                type: 'done',
                msg: `Value ${value} not found in the list.`,
                nodes: listState.map(n => ({ ...n, highlight: false }))
            });
        }

        this.currentStep = 0;
    }

    add(value) {
        this.resetSteps();
        const listState = this.serializeList();
        
        if (listState.length === 0) {
            this.steps.push({
                type: 'create',
                msg: `Creating head node with value ${value}`,
                nodes: [{ value, highlight: true }]
            });
            this.steps.push({
                type: 'done',
                msg: `Node added as head.`,
                nodes: [{ value, highlight: false }]
            });
        } else {
            for (let i = 0; i < listState.length; i++) {
                const temp = listState.map((n, idx) => ({ ...n, highlight: idx === i }));
                this.steps.push({
                    type: 'traverse',
                    msg: `Traversing node ${listState[i].value} at index ${i}`,
                    nodes: temp
                });
            }

            const tempWithNew = listState.map(n => ({ ...n, highlight: false }));
            tempWithNew.push({ value, highlight: true, x: 0, y: 0 });
            this.steps.push({
                type: 'create',
                msg: `Creating new node with value ${value}`,
                nodes: JSON.parse(JSON.stringify(tempWithNew))
            });

            const tempLinked = listState.map(n => ({ ...n, highlight: false }));
            tempLinked.push({ value, highlight: false });
            this.steps.push({
                type: 'link',
                msg: `Linking last node to the new node`,
                nodes: JSON.parse(JSON.stringify(tempLinked))
            });

            this.steps.push({
                type: 'done',
                msg: `Node successfully appended.`,
                nodes: tempLinked.map(n => ({ ...n, highlight: false }))
            });
        }

        this.head = this.executeState(this.steps[this.steps.length - 1].nodes);
        this.nodeCount = this.steps[this.steps.length - 1].nodes.length;
        this.layout();
        
        this.currentStep = 0;
    }

    insertAt(index, value) {
        if (index < 0 || index > this.nodeCount) {
            this.ui.updateStatus(`Index ${index} out of bounds!`);
            return;
        }
        this.resetSteps();
        const listState = this.serializeList();

        if (index === 0) {
            const tempWithNew = [{ value, highlight: true }, ...listState.map(n => ({ ...n, highlight: false }))];
            this.steps.push({
                type: 'create',
                msg: `Creating new node with value ${value} to insert at head`,
                nodes: JSON.parse(JSON.stringify(tempWithNew))
            });
            this.steps.push({
                type: 'link',
                msg: `Pointing new node next to the old head`,
                nodes: JSON.parse(JSON.stringify(tempWithNew))
            });
            this.steps.push({
                type: 'done',
                msg: `Inserted ${value} at head.`,
                nodes: tempWithNew.map(n => ({ ...n, highlight: false }))
            });
        } else {
            for (let i = 0; i < index; i++) {
                const temp = listState.map((n, idx) => ({ ...n, highlight: idx === i }));
                this.steps.push({
                    type: 'traverse',
                    msg: `Traversing: checking index ${i}`,
                    nodes: temp
                });
            }

            const tempWithNew = [];
            for (let i = 0; i < listState.length; i++) {
                if (i === index) {
                    tempWithNew.push({ value, highlight: true, isNew: true });
                }
                tempWithNew.push({ ...listState[i], highlight: false });
            }
            if (index === listState.length) {
                tempWithNew.push({ value, highlight: true, isNew: true });
            }

            this.steps.push({
                type: 'create',
                msg: `Creating new node with value ${value}`,
                nodes: JSON.parse(JSON.stringify(tempWithNew))
            });

            this.steps.push({
                type: 'link',
                msg: `Setting next pointer of the new node, and relinking previous node`,
                nodes: JSON.parse(JSON.stringify(tempWithNew))
            });

            this.steps.push({
                type: 'done',
                msg: `Successfully inserted ${value} at index ${index}`,
                nodes: tempWithNew.map(n => ({ ...n, highlight: false, isNew: false }))
            });
        }

        this.head = this.executeState(this.steps[this.steps.length - 1].nodes);
        this.nodeCount = this.steps[this.steps.length - 1].nodes.length;
        this.layout();

        this.currentStep = 0;
    }

    remove() {
        this.removeAt(0);
    }

    removeAt(index) {
        if (index < 0 || index >= this.nodeCount) {
            this.ui.updateStatus(`Index ${index} out of bounds!`);
            return;
        }
        this.resetSteps();
        const listState = this.serializeList();

        if (index === 0) {
            const temp = listState.map((n, idx) => ({ ...n, highlight: idx === 0 }));
            this.steps.push({
                type: 'traverse',
                msg: `Targeting head node for removal`,
                nodes: temp
            });
            const remaining = listState.slice(1).map(n => ({ ...n, highlight: false }));
            this.steps.push({
                type: 'done',
                msg: `Removed head node. Next node is the new head.`,
                nodes: remaining
            });
        } else {
            for (let i = 0; i <= index; i++) {
                const temp = listState.map((n, idx) => ({ ...n, highlight: idx === i }));
                this.steps.push({
                    type: 'traverse',
                    msg: `Traversing list to locate target index ${index}`,
                    nodes: temp
                });
            }

            const tempRemoved = listState.filter((_, idx) => idx !== index).map(n => ({ ...n, highlight: false }));
            this.steps.push({
                type: 'link',
                msg: `Bypassing node at index ${index} and pointing previous to next`,
                nodes: JSON.parse(JSON.stringify(tempRemoved))
            });

            this.steps.push({
                type: 'done',
                msg: `Node at index ${index} removed.`,
                nodes: tempRemoved
            });
        }

        this.head = this.executeState(this.steps[this.steps.length - 1].nodes);
        this.nodeCount = this.steps[this.steps.length - 1].nodes.length;
        this.layout();

        this.currentStep = 0;
    }

    reverse() {
        this.resetSteps();
        const listState = this.serializeList();
        if (listState.length <= 1) {
            this.ui.updateStatus(`List has 1 or fewer elements. Nothing to reverse.`);
            return;
        }

        const currentListValues = listState.map(n => n.value);

        this.steps.push({
            type: 'traverse',
            msg: `Starting list reversal. Set prev = NULL.`,
            nodes: listState.map(n => ({ ...n, highlight: false }))
        });

        for (let i = 0; i < currentListValues.length; i++) {
            const stepNodes = currentListValues.map((val, idx) => ({
                value: val,
                highlight: idx === i,
                reversedLinkUpTo: i
            }));

            this.steps.push({
                type: 'link',
                msg: `Reversing pointer of node ${currentListValues[i]}`,
                nodes: stepNodes
            });
        }

        const reversedState = [...listState].reverse().map(n => ({ ...n, highlight: false }));
        this.steps.push({
            type: 'done',
            msg: `Reversal complete. Head is now node ${reversedState[0].value}.`,
            nodes: reversedState
        });

        this.head = this.executeState(reversedState);
        this.layout();

        this.currentStep = 0;
    }

    serializeList() {
        const arr = [];
        let curr = this.head;
        let visited = new Set();
        while (curr && !visited.has(curr)) {
            arr.push({ value: curr.value });
            visited.add(curr);
            curr = curr.next;
        }
        return arr;
    }

    executeState(nodesArr) {
        if (nodesArr.length === 0) return null;
        const head = { value: nodesArr[0].value, x: 0, y: 0, next: null, prev: null };
        let curr = head;
        for (let i = 1; i < nodesArr.length; i++) {
            const newNode = { value: nodesArr[i].value, x: 0, y: 0, next: null, prev: curr };
            curr.next = newNode;
            curr = newNode;
        }
        if (this.listMode === 'circular') {
            curr.next = head;
            head.prev = curr;
        }
        return head;
    }

    nextStep() {
        if (this.steps.length === 0 || this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep];
        this.head = this.executeState(step.nodes);
        this.nodeCount = step.nodes.length;
        
        this.layout();
        
        let curr = this.head;
        let i = 0;
        let visited = new Set();
        while (curr && !visited.has(curr)) {
            visited.add(curr);
            if (step.nodes[i]) {
                curr.highlight = step.nodes[i].highlight;
                curr.isNew = step.nodes[i].isNew;
            }
            curr = curr.next;
            i++;
        }

        this.ui.updateStatus(step.msg);
        this.engine.draw();

        this.currentStep++;
        return this.currentStep < this.steps.length;
    }

    layout() {
        if (this.challengeActive) return;

        let curr = this.head;
        let prevNode = null;
        let i = 0;
        const startX = 100;
        const spacing = 150;
        const y = this.engine.canvas.height / 2;

        let visited = new Set();
        while (curr && !visited.has(curr)) {
            visited.add(curr);
            curr.x = startX + i * spacing;
            curr.y = y;
            curr.prev = prevNode; // dynamically assign prev node for doubly mode
            prevNode = curr;
            curr = curr.next;
            i++;
        }
        this.engine.draw();
    }

    draw() {
        const ctx = this.engine.ctx;
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const stroke = '#4a90e2';
        const bg = isDark ? '#2d2d44' : '#fff';
        const text = isDark ? '#fff' : '#333';
        const w = 100;
        const h = 50;

        if (this.challengeActive) {
            ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Target: ${this.targetSequence.join(' ➔ ')}`, 20, 30);
            ctx.fillText(`Moves: ${this.moves}`, this.engine.canvas.width - 120, 30);

            this.challengeNodes.forEach(node => {
                const x = node.x - w / 2;
                const y = node.y - h / 2;

                const isSelected = this.selectedSourceNode === node;
                ctx.strokeStyle = isSelected ? '#ffd700' : stroke;
                ctx.lineWidth = isSelected ? 4 : 2;
                ctx.fillStyle = bg;
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);

                ctx.beginPath();
                ctx.moveTo(x + w / 2, y);
                ctx.lineTo(x + w / 2, y + h);
                ctx.stroke();

                ctx.fillStyle = text;
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.value, x + w / 4, y + h / 2);

                if (node.next) {
                    ctx.fillStyle = stroke;
                    const px = x + 3 * w / 4;
                    const py = y + h / 2;
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fill();
                    this.drawLinkArrow(px, py, node.next.x - w / 2, node.next.y);
                } else {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = text;
                    ctx.beginPath();
                    ctx.moveTo(x + w / 2, y + h);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                }
            });
            return;
        }

        let curr = this.head;
        let visited = new Set();
        while (curr && !visited.has(curr)) {
            visited.add(curr);
            const x = curr.x - w / 2;
            const y = curr.y - h / 2;

            ctx.strokeStyle = curr.highlight ? '#ffd700' : (curr.isNew ? '#2ecc71' : stroke);
            ctx.lineWidth = curr.highlight || curr.isNew ? 4 : 2;
            ctx.fillStyle = curr.highlight ? 'rgba(255, 215, 0, 0.15)' : bg;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);

            ctx.beginPath();
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();

            ctx.fillStyle = text;
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(curr.value, x + w / 4, y + h / 2);

            if (curr.next && !visited.has(curr.next)) {
                ctx.fillStyle = stroke;
                const px = x + 3 * w / 4;
                const py = y + h / 2;
                ctx.beginPath();
                ctx.arc(px, py, 4, 0, Math.PI * 2);
                ctx.fill();

                if (this.listMode === 'doubly') {
                    // Offset arrows: Forward shifted up
                    this.drawLinkArrow(px, py - 6, curr.next.x - w / 2, curr.next.y - 6);
                    // Backward shifted down
                    this.drawLinkArrow(curr.next.x - w / 2, curr.next.y + 6, px, py + 6);
                } else {
                    this.drawLinkArrow(px, py, curr.next.x - w / 2, curr.next.y);
                }
            } else {
                if (this.listMode === 'circular' && this.head) {
                    ctx.fillStyle = stroke;
                    const px = x + 3 * w / 4;
                    const py = y + h / 2;
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fill();
                    this.drawCurvedArrow(px, py, this.head.x - w / 2, this.head.y);
                } else {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = text;
                    ctx.beginPath();
                    ctx.moveTo(x + w / 2, y + h);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                }
            }

            curr = curr.next;
        }
    }

    drawLinkArrow(x1, y1, x2, y2) {
        const ctx = this.engine.ctx;
        const headlen = 10;
        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }

    drawCurvedArrow(x1, y1, x2, y2) {
        const ctx = this.engine.ctx;
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        
        const midX = (x1 + x2) / 2;
        const ctrlY = y1 + 75; // Curve downward under the node boxes
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, ctrlY, x2, y2);
        ctx.stroke();

        const headlen = 10;
        const dx = x2 - midX;
        const dy = y2 - ctrlY;
        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
}

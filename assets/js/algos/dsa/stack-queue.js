/**
 * stack-queue.js - Stack and Queue visualization with playback trace and Sequence Matcher Game.
 */
class StackQueueAlgo {
    constructor(engine, playback, ui, type = 'stack') {
        this.engine = engine;
        this.playback = playback;
        this.ui = ui;
        this.type = type; // 'stack' or 'queue'
        this.items = [];

        // Trace state
        this.steps = [];
        this.currentStep = 0;

        // Challenge mode state
        this.challengeActive = false;
        this.inputStream = [];
        this.targetSequence = [];
        this.outputList = [];
        this.moves = 0;
    }

    resetSteps() {
        this.playback.reset();
        this.steps = [];
        this.currentStep = 0;
    }

    push(val) {
        this.resetSteps();
        
        const stateBefore = [...this.items];
        const stateAfter = [...this.items, val];

        // Step 1: Element created at entrance
        this.steps.push({
            type: 'create',
            msg: this.type === 'stack' ? `Creating value ${val} to push onto stack.` : `Creating value ${val} to enqueue.`,
            items: stateBefore,
            newItem: { val, state: 'entering' }
        });

        // Step 2: Element placed in stack/queue
        this.steps.push({
            type: 'done',
            msg: this.type === 'stack' ? `Pushed ${val} onto top of stack.` : `Enqueued ${val} to rear of queue.`,
            items: stateAfter,
            newItem: null
        });

        this.items = stateAfter;
        this.currentStep = 0;
    }

    pop() {
        if (this.items.length === 0) {
            this.ui.updateStatus("Buffer is empty. Underflow!");
            return;
        }
        this.resetSteps();

        const stateBefore = [...this.items];
        let poppedVal = null;
        let stateAfter = [];

        if (this.type === 'stack') {
            poppedVal = stateBefore[stateBefore.length - 1];
            stateAfter = stateBefore.slice(0, stateBefore.length - 1);
            
            // Step 1: Highlight top element
            this.steps.push({
                type: 'highlight',
                msg: `Targeting TOP element (${poppedVal}) for removal.`,
                items: stateBefore.map((v, i) => ({ val: v, highlight: i === stateBefore.length - 1 }))
            });

            // Step 2: Remove and animate out
            this.steps.push({
                type: 'remove',
                msg: `Popped ${poppedVal} from stack.`,
                items: stateAfter
            });
        } else {
            poppedVal = stateBefore[0];
            stateAfter = stateBefore.slice(1);

            // Step 1: Highlight front element
            this.steps.push({
                type: 'highlight',
                msg: `Targeting FRONT element (${poppedVal}) for removal.`,
                items: stateBefore.map((v, i) => ({ val: v, highlight: i === 0 }))
            });

            // Step 2: Remove and animate out
            this.steps.push({
                type: 'remove',
                msg: `Dequeued ${poppedVal} from queue.`,
                items: stateAfter
            });
        }

        this.items = stateAfter;
        this.currentStep = 0;
    }

    nextStep() {
        if (this.steps.length === 0 || this.currentStep >= this.steps.length) return false;

        const step = this.steps[this.currentStep];
        this.ui.updateStatus(step.msg);

        // Map items
        this.items = step.items.map(item => typeof item === 'object' ? item.val : item);
        this.activeHighlights = step.items.map((item, idx) => typeof item === 'object' ? item.highlight : false);
        this.newItem = step.newItem || null;

        this.engine.draw();
        this.currentStep++;
        return this.currentStep < this.steps.length;
    }

    startChallenge() {
        this.challengeActive = true;
        this.items = [];
        this.outputList = [];
        this.moves = 0;

        // Generate input stream
        this.inputStream = [];
        for (let i = 0; i < 5; i++) {
            this.inputStream.push(Math.floor(Math.random() * 9) * 10 + 10);
        }

        // Generate target output sequence by simulating valid stack/queue ops
        const tempBuffer = [];
        const simInput = [...this.inputStream];
        const simOutput = [];

        if (this.type === 'stack') {
            // Mix pushes and pops to generate valid stack-realizable permutation
            while (simInput.length > 0 || tempBuffer.length > 0) {
                if (tempBuffer.length === 0 || (simInput.length > 0 && Math.random() > 0.4)) {
                    tempBuffer.push(simInput.shift());
                } else {
                    simOutput.push(tempBuffer.pop());
                }
            }
        } else {
            // Queue outputs elements in same order (FIFO), let's just reverse or shuffle a subset
            while (simInput.length > 0 || tempBuffer.length > 0) {
                if (tempBuffer.length === 0 || (simInput.length > 0 && Math.random() > 0.4)) {
                    tempBuffer.push(simInput.shift());
                } else {
                    simOutput.push(tempBuffer.shift());
                }
            }
        }

        this.targetSequence = simOutput;
        this.ui.updateStatus(`🎯 Match Challenge! Use the buffer to output: <b>${this.targetSequence.join(', ')}</b>.`);
        this.engine.draw();
    }

    stopChallenge() {
        this.challengeActive = false;
        this.inputStream = [];
        this.targetSequence = [];
        this.outputList = [];
        this.items = [10, 20];
        this.ui.updateStatus(`Exited Challenge Mode.`);
        this.engine.draw();
    }

    challengePush() {
        if (this.inputStream.length === 0) {
            this.ui.updateStatus(`No more elements in input stream!`);
            return;
        }
        const val = this.inputStream.shift();
        this.items.push(val);
        this.moves++;
        this.ui.updateStatus(`Shifted ${val} from stream into buffer.`);
        this.engine.draw();
    }

    challengePop() {
        if (this.items.length === 0) {
            this.ui.updateStatus(`Buffer underflow! Nothing to pop.`);
            return;
        }
        let val;
        if (this.type === 'stack') {
            val = this.items.pop();
        } else {
            val = this.items.shift();
        }
        this.outputList.push(val);
        this.moves++;
        this.ui.updateStatus(`Moved ${val} from buffer to output list.`);
        this.checkChallengeWin();
        this.engine.draw();
    }

    checkChallengeWin() {
        const matches = this.outputList.length === this.targetSequence.length &&
                        this.outputList.every((v, i) => v === this.targetSequence[i]);

        if (matches) {
            this.ui.updateStatus(`👑 Challenge Met! Output matched target successfully in <b>${this.moves} operations</b>.`);
            if (typeof GamificationSystem !== 'undefined') {
                GamificationSystem.saveScore('stack-queue', 'manual_flow', this.moves, 10);
                ProgressSystem.complete('dsa', 'Stack & Queue');
            }
            this.challengeActive = false;
        } else {
            // If output exceeded size or mismatched, notify
            const isMismatched = this.outputList.some((v, idx) => v !== this.targetSequence[idx]);
            if (isMismatched || this.outputList.length > this.targetSequence.length) {
                this.ui.updateStatus(`⚠️ Mismatched output sequence! Restarting challenge...`);
                setTimeout(() => this.startChallenge(), 2000);
            }
        }
    }

    draw() {
        const ctx = this.engine.ctx;
        const cw = this.engine.canvas.width;
        const ch = this.engine.canvas.height;
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        
        ctx.clearRect(0, 0, cw, ch);

        if (this.challengeActive) {
            // Draw Challenge header & sequences
            ctx.fillStyle = isDark ? '#e0e0e0' : '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Stream: [${this.inputStream.join(', ')}]`, 20, 40);
            ctx.fillText(`Target: [${this.targetSequence.join(', ')}]`, 20, 70);
            ctx.fillText(`Output: [${this.outputList.join(', ')}]`, 20, 100);
            ctx.fillText(`Moves: ${this.moves}`, cw - 120, 40);
        }

        const startX = 150;
        const spacing = 70;
        const y = ch / 2;

        // Draw items currently in stack/queue
        this.items.forEach((val, i) => {
            const x = startX + i * spacing;
            const highlighted = this.activeHighlights && this.activeHighlights[i];

            ctx.fillStyle = highlighted ? '#ff6b6b' : '#4a90e2';
            ctx.strokeStyle = highlighted ? '#ffd700' : '#333';
            ctx.lineWidth = 2;
            
            // Draw square
            ctx.fillRect(x - 25, y - 25, 50, 50);
            ctx.strokeRect(x - 25, y - 25, 50, 50);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, x, y);

            // Labels
            if (this.type === 'stack' && i === this.items.length - 1) {
                ctx.fillStyle = '#ff6b6b';
                ctx.font = 'bold 12px Arial';
                ctx.fillText('TOP', x, y - 35);
            } else if (this.type === 'queue') {
                ctx.font = 'bold 11px Arial';
                if (i === 0) {
                    ctx.fillStyle = '#ff6b6b';
                    ctx.fillText('FRONT', x, y - 35);
                }
                if (i === this.items.length - 1) {
                    ctx.fillStyle = '#2ecc71';
                    ctx.fillText('REAR', x, y + 40);
                }
            }
        });

        // Draw entering node if exists in trace steps
        if (this.newItem) {
            let nx = startX + this.items.length * spacing;
            let ny = y - 80; // Slide from top
            
            ctx.fillStyle = '#2ecc71'; // Green for new node
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.fillRect(nx - 25, ny - 25, 50, 50);
            ctx.strokeRect(nx - 25, ny - 25, 50, 50);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(this.newItem.val, nx, ny);
        }
    }
}

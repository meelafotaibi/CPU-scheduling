/**
 * Playback.js - Controls the flow of animations (Step, Play, Speed).
 */
class Playback {
    constructor(onStep) {
        this.delay = 1000;
        this.isRunning = false;
        this.isPaused = false;
        this.onStep = onStep; // Async function to execute one step
        this.isExecuting = false; // Lock flag to prevent concurrency desyncs
    }

    setSpeed(val) {
        // val 1-100, invert to ms delay
        this.delay = 2000 - (val * 19);
    }

    updatePlayBtn() {
        const btn = document.getElementById('play-btn');
        if (btn) {
            if (this.isRunning && !this.isPaused) {
                btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            } else {
                btn.innerHTML = '<i class="fas fa-play"></i> Play';
            }
        }
    }

    async play() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        this.updatePlayBtn();

        while (this.isRunning && !this.isPaused) {
            if (this.isExecuting) {
                await new Promise(r => setTimeout(r, 50));
                continue;
            }
            this.isExecuting = true;
            const hasMore = await this.onStep();
            this.isExecuting = false;
            
            if (!hasMore) {
                this.isRunning = false;
                this.updatePlayBtn();
                break;
            }
            await new Promise(r => setTimeout(r, this.delay));
        }
    }

    pause() {
        this.isPaused = true;
        this.isRunning = false;
        this.updatePlayBtn();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.isExecuting = false;
        this.updatePlayBtn();
    }

    stop() {
        this.reset();
    }

    async step() {
        if (this.isExecuting) return;
        this.isExecuting = true;
        this.isRunning = false;
        this.isPaused = true;
        this.updatePlayBtn();
        await this.onStep();
        this.isExecuting = false;
    }
}

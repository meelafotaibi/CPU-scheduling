/**
 * Playback.js - Controls the flow of animations (Step, Play, Speed).
 */
class Playback {
    constructor(onStep) {
        this.delay = 1000;
        this.isRunning = false;
        this.isPaused = false;
        this.onStep = onStep; // Async function to execute one step
    }

    setSpeed(val) {
        // val 1-100, invert to ms delay
        this.delay = 2000 - (val * 19);
    }

    async play() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;

        while (this.isRunning && !this.isPaused) {
            const hasMore = await this.onStep();
            if (!hasMore) {
                this.isRunning = false;
                break;
            }
            await new Promise(r => setTimeout(r, this.delay));
        }
    }

    pause() {
        this.isPaused = true;
        this.isRunning = false;
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
    }

    async step() {
        this.isRunning = false;
        this.isPaused = true;
        await this.onStep();
    }
}

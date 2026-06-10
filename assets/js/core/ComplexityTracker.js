/**
 * ComplexityTracker.js - Tracks and displays algorithm complexity and operation counts.
 */
class ComplexityTracker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.counters = {
            comparisons: 0,
            swaps: 0,
            writes: 0,
            access: 0,
            recursion: 0
        };
        this.complexity = {
            time: 'O(?)',
            space: 'O(?)'
        };
        this.render();
    }

    reset() {
        for (let key in this.counters) {
            this.counters[key] = 0;
        }
        this.updateUI();
    }

    increment(type, amount = 1) {
        if (this.counters.hasOwnProperty(type)) {
            this.counters[type] += amount;
            this.updateUI();
        }
    }

    setRecursion(depth) {
        this.counters.recursion = Math.max(this.counters.recursion, depth);
        this.updateUI();
    }

    setComplexity(time, space) {
        this.complexity.time = time;
        this.complexity.space = space;
        this.updateUI();
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="complexity-panel glass-card">
                <div class="complexity-header">
                    <i class="fas fa-graduation-cap"></i> Interview Prep Mode
                </div>
                <div class="complexity-stats">
                    <div class="stat-row">
                        <span>Time Complexity:</span>
                        <span class="complexity-val" id="time-comp">${this.complexity.time}</span>
                    </div>
                    <div class="stat-row">
                        <span>Space Complexity:</span>
                        <span class="complexity-val" id="space-comp">${this.complexity.space}</span>
                    </div>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div class="stat-grid">
                        <div class="counter-item">
                            <small>Comparisons</small>
                            <div id="count-comparisons">0</div>
                        </div>
                        <div class="counter-item">
                            <small>Writes/Swaps</small>
                            <div id="count-swaps">0</div>
                        </div>
                        <div class="counter-item item-recursion hide">
                            <small>Max Depth</small>
                            <div id="count-recursion">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateUI() {
        if (!this.container) return;
        const timeEl = document.getElementById('time-comp');
        const spaceEl = document.getElementById('space-comp');
        const compEl = document.getElementById('count-comparisons');
        const swapEl = document.getElementById('count-swaps');
        const recEl = document.getElementById('count-recursion');

        if (timeEl) timeEl.innerText = this.complexity.time;
        if (spaceEl) spaceEl.innerText = this.complexity.space;
        if (compEl) compEl.innerText = this.counters.comparisons;
        if (swapEl) swapEl.innerText = this.counters.swaps + this.counters.writes;
        if (recEl) {
            recEl.innerText = this.counters.recursion;
            if (this.counters.recursion > 0) {
                recEl.parentElement.classList.remove('hide');
            }
        }
    }

    show() {
        if (this.container) this.container.style.display = 'block';
    }

    hide() {
        if (this.container) this.container.style.display = 'none';
    }
}


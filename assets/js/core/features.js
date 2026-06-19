/**
 * features.js - Core Platform Systems
 * Implements URL-based Sharing, Progress Tracking, and Gamification Achievements.
 */

// Global Systems
class SharingSystem {
    static serialize(params) {
        const url = new URL(window.location.href);
        url.search = '';
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value.toString());
            }
        });
        return url.toString();
    }

    static deserialize() {
        const searchParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    static async copyLink(params, btnElement = null) {
        const link = this.serialize(params);
        const originalText = btnElement ? btnElement.innerHTML : 'Share';
        try {
            await navigator.clipboard.writeText(link);
            if (btnElement) {
                btnElement.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
                btnElement.classList.add('glow-success');
                setTimeout(() => {
                    btnElement.innerHTML = originalText;
                    btnElement.classList.remove('glow-success');
                }, 2000);
            } else {
                alert('Session share link copied to clipboard!');
            }
        } catch (err) {
            console.error('Failed to copy share link:', err);
            const input = document.createElement('input');
            input.value = link;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            if (btnElement) {
                btnElement.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
                setTimeout(() => btnElement.innerHTML = originalText, 2000);
            }
        }
    }
}

class PlatformCatalog {
    static categories = {
        dsa: {
            id: 'dsa-progress',
            label: 'Data Structures',
            total: 6
        },
        sorting: {
            id: 'sorting-progress',
            label: 'Sorting & Searching',
            total: 4
        },
        os: {
            id: 'os-progress',
            label: 'Operating Systems',
            total: 5
        },
        ai: {
            id: 'ai-progress',
            label: 'AI & Machine Learning',
            total: 5
        },
        cg: {
            id: 'cg-progress',
            label: 'Computer Graphics',
            total: 6
        }
    };

    static getCategoryEntries() {
        return Object.entries(this.categories);
    }

    static getCategoryTotal(categoryKey) {
        return this.categories[categoryKey]?.total || 0;
    }
}

class LearningPathRegistry {
    static paths = {
        dsa: {
            title: 'Data Structures Path',
            description: 'Progress through foundational structures before advanced graph topics.',
            steps: [
                'arrays',
                'linked-list',
                'stack-queue',
                'bst',
                'avl',
                'heap',
                'trie',
                'graphs'
            ]
        },
        os: {
            title: 'Operating Systems Path',
            description: 'Build OS intuition from CPU scheduling to memory and storage management.',
            steps: [
                'cpu-scheduling',
                'memory-allocation',
                'page-replacement',
                'disk',
                'bankers'
            ]
        },
        sorting: {
            title: 'Sorting Path',
            description: 'Learn comparison and non-comparison sorting with increasing difficulty.',
            steps: [
                'bubble-sort',
                'selection',
                'insertion',
                'merge-sort',
                'quick-sort',
                'heap',
                'binary-search'
            ]
        },
        ai: {
            title: 'AI & Machine Learning Path',
            description: 'Explore classic ML algorithms and game-search decision making.',
            steps: [
                'kmeans',
                'knn',
                'linear-regression',
                'perceptron',
                'minimax'
            ]
        },
        cg: {
            title: 'Computer Graphics Path',
            description: 'Move from rasterization basics to rendering and advanced visual techniques.',
            steps: [
                'cg-fundamentals',
                'cg-transformations',
                'cg-camera',
                'cg-rendering',
                'cg-advanced'
            ]
        }
    };

    static getPathKeys() {
        return Object.keys(this.paths);
    }

    static getPath(pathKey) {
        return this.paths[pathKey] || null;
    }
}

class KnowledgeCheckRegistry {
    static checks = {
        'cpu-scheduling': [
            {
                question: 'What decides the next process in FCFS?',
                choices: ['Burst time', 'Arrival time', 'Priority', 'CPU temperature'],
                answer: 'Arrival time'
            },
            {
                question: 'What is the main goal of Round Robin?',
                choices: ['Maximize memory', 'Fair time sharing', 'Remove deadlocks', 'Sort processes'],
                answer: 'Fair time sharing'
            }
        ],
        'bubble-sort': [
            {
                question: 'When does Bubble Sort stop early?',
                choices: ['When the array is reversed', 'When no swaps occur', 'When pivot is chosen', 'When recursion ends'],
                answer: 'When no swaps occur'
            },
            {
                question: 'Bubble Sort average time complexity?',
                choices: ['O(log n)', 'O(n)', 'O(n²)', 'O(n log n)'],
                answer: 'O(n²)'
            }
        ],
        'page-replacement': [
            {
                question: 'What does FIFO replace first?',
                choices: ['Newest page', 'Least recently used page', 'Oldest loaded page', 'Largest page'],
                answer: 'Oldest loaded page'
            },
            {
                question: 'Why do page faults matter?',
                choices: ['They improve speed', 'They trigger memory access delays', 'They remove code duplication', 'They sort pages'],
                answer: 'They trigger memory access delays'
            }
        ]
    };

    static getChecks(algoKey) {
        return this.checks[algoKey] || [];
    }

    static hasChecks(algoKey) {
        return this.getChecks(algoKey).length > 0;
    }
}

class ProgressSystem {
    static STORAGE_KEY = 'algovisual_progress';

    static getProgress() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {
                completed: {}
            };
        } catch (e) {
            return { completed: {} };
        }
    }

    static saveProgress(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        this.updateDOMProgress();
    }

    static complete(category, algoName) {
        const progress = this.getProgress();
        if (!progress.completed[category]) {
            progress.completed[category] = [];
        }
        if (!progress.completed[category].includes(algoName)) {
            progress.completed[category].push(algoName);
            this.saveProgress(progress);

            GamificationSystem.checkProgressAchievements();

            this.showToast(`✨ Completed: ${algoName}! Category progress updated.`);
        }
    }

    static isCompleted(category, algoName) {
        const progress = this.getProgress();
        return progress.completed[category] && progress.completed[category].includes(algoName);
    }

    static showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'features-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid var(--primary);
            border-radius: 12px;
            padding: 16px 24px;
            color: white;
            font-weight: 600;
            box-shadow: var(--glow-primary), var(--glass-shadow);
            z-index: 99999;
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        toast.innerHTML = `<span>🎉</span> <span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    static updateDOMProgress() {
        const progress = this.getProgress();
        const categories = PlatformCatalog.getCategoryEntries();

        let totalCompleted = 0;
        let totalAlgos = 0;

        categories.forEach(([key, value]) => {
            const completedList = progress.completed[key] || [];
            const count = completedList.length;
            const total = PlatformCatalog.getCategoryTotal(key) || 1;
            totalCompleted += count;
            totalAlgos += total;

            const el = document.getElementById(value.id);
            if (el) {
                const percent = Math.min(100, Math.round((count / total) * 100));
                el.innerText = `${count}/${total} Live (${percent}%)`;
            }
        });

        const globalProgressEl = document.getElementById('global-progress-indicator');
        if (globalProgressEl) {
            const overallPercent = totalAlgos > 0 ? Math.round((totalCompleted / totalAlgos) * 100) : 0;
            globalProgressEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${overallPercent}%; height: 100%; background: var(--gradient-tri-tone);"></div>
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">${overallPercent}%</span>
                </div>
            `;
        }
    }
}

class GamificationSystem {
    static ACHIEVEMENTS_KEY = 'algovisual_achievements';
    static CHALLENGES_KEY = 'algovisual_challenges';

    static getAchievements() {
        try {
            const data = localStorage.getItem(this.ACHIEVEMENTS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    static unlock(id, title, desc, icon = '🏆') {
        const unlocked = this.getAchievements();
        if (unlocked.some(a => a.id === id)) return;

        unlocked.push({ id, title, desc, icon, date: new Date().toLocaleDateString() });
        localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(unlocked));

        this.showAchievementUnlockBanner(title, desc, icon);
    }

    static saveScore(algoName, challengeType, score, optimalScore) {
        try {
            const key = `${this.CHALLENGES_KEY}_${algoName}_${challengeType}`;
            const currentBest = localStorage.getItem(key);
            const isBetter = !currentBest || score < parseInt(currentBest, 10);

            if (isBetter) {
                localStorage.setItem(key, score.toString());
            }

            if (score <= optimalScore) {
                this.unlock('algo_master_' + algoName, `Beat ${algoName}!`, `Succeeded with optimal or better moves than the standard algorithm.`, '👑');
            } else {
                this.unlock('algo_challenger_' + algoName, `Challenged ${algoName}!`, `Completed the manual challenge and learned the mechanics.`, '🥋');
            }

            return { isBest: isBetter, best: isBetter ? score : parseInt(currentBest, 10) };
        } catch (e) {
            console.error(e);
            return { isBest: false, best: score };
        }
    }

    static checkProgressAchievements() {
        const progress = ProgressSystem.getProgress();

        let completedCount = 0;
        Object.values(progress.completed).forEach(arr => completedCount += arr.length);

        if (completedCount >= 1) {
            this.unlock('first_step', 'First Step Taken', 'Completed your very first algorithm visualization!', '👣');
        }
        if (completedCount >= 5) {
            this.unlock('algo_explorer', 'Algorithm Explorer', 'Successfully completed 5 different algorithm visualizers!', '🧭');
        }
        if (progress.completed['sorting'] && progress.completed['sorting'].length >= 3) {
            this.unlock('sorting_wizard', 'Sorting Wizard', 'Completed Bubble, Quick, and Merge Sort!', '🧙‍♂️');
        }
        if (progress.completed['os'] && progress.completed['os'].length >= 3) {
            this.unlock('scheduler_pro', 'Kernel Scheduler', 'Completed FCFS, SJF, and Round Robin simulations!', '⚙️');
        }
    }

    static showAchievementUnlockBanner(title, desc, icon) {
        const banner = document.createElement('div');
        banner.className = 'achievement-banner';
        banner.style.cssText = `
            position: fixed;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
            border: 2px solid;
            border-image: var(--gradient-tri-tone) 1;
            border-radius: 16px;
            padding: 24px;
            color: white;
            box-shadow: 0 0 35px rgba(168, 85, 247, 0.4), var(--glass-shadow);
            z-index: 100000;
            backdrop-filter: blur(15px);
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 20px;
            max-width: 450px;
            width: calc(100% - 40px);
        `;

        banner.innerHTML = `
            <div style="font-size: 2.8rem; background: var(--gradient-tri-tone); -webkit-background-clip: text; background-clip: text; padding: 5px;">${icon}</div>
            <div style="flex: 1;">
                <h4 style="margin: 0; font-size: 1.2rem; font-weight: 800; text-transform: uppercase; background: var(--gradient-tri-tone); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🏆 Achievement Unlocked!</h4>
                <h5 style="margin: 4px 0; font-size: 1.1rem; color: #fff; font-weight: 700;">${title}</h5>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${desc}</p>
            </div>
            <button onclick="this.closest('.achievement-banner').remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; opacity: 0.6; hover: opacity: 1;">✕</button>
        `;

        document.body.appendChild(banner);

        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, context.currentTime);
            osc.frequency.setValueAtTime(659.25, context.currentTime + 0.1);
            osc.frequency.setValueAtTime(783.99, context.currentTime + 0.2);
            osc.frequency.setValueAtTime(1046.50, context.currentTime + 0.3);

            gain.gain.setValueAtTime(0.08, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);
            osc.start();
            osc.stop(context.currentTime + 0.6);
        } catch (e) {}

        setTimeout(() => {
            banner.style.animation = 'scaleIn 0.3s reverse cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
            setTimeout(() => banner.remove(), 350);
        }, 5000);
    }
}

// Auto init DOM states
document.addEventListener('DOMContentLoaded', () => {
    ProgressSystem.updateDOMProgress();

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .features-toast {
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});

// Gamified Challenge Mode for Sorting
class SortingChallengeGame {
    constructor(engine, algoName, onUpdateStats, onWin) {
        this.engine = engine;
        this.algoName = algoName;
        this.onUpdateStats = onUpdateStats;
        this.onWin = onWin;
        this.active = false;
        this.playerSwaps = 0;
        this.selectedIdx = null;
        this.optimalSwaps = 0;
        this.originalArray = [];

        this.initEvents();
    }

    start() {
        this.active = true;
        this.playerSwaps = 0;
        this.selectedIdx = null;
        this.originalArray = [...this.engine.array];
        this.engine.clearHighlights();
        this.calculateOptimalSwaps();
        this.onUpdateStats(this.playerSwaps, this.optimalSwaps);
    }

    stop() {
        this.active = false;
        this.selectedIdx = null;
        this.engine.clearHighlights();
    }

    calculateOptimalSwaps() {
        const temp = [...this.originalArray];
        let swaps = 0;
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < temp.length - i - 1; j++) {
                if (temp[j] > temp[j + 1]) {
                    const t = temp[j];
                    temp[j] = temp[j + 1];
                    temp[j + 1] = t;
                    swaps++;
                }
            }
        }
        this.optimalSwaps = swaps || Math.floor(Math.random() * 5) + 3;
    }

    initEvents() {
        this.engine.canvas.addEventListener('click', (e) => {
            if (!this.active) return;
            const rect = this.engine.canvas.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const clickX = (clientX / rect.width) * this.engine.canvas.width;

            const cw = this.engine.canvas.width;
            const barTotalWidth = cw / this.engine.array.length;
            const idx = Math.floor(clickX / barTotalWidth);

            if (idx >= 0 && idx < this.engine.array.length) {
                this.handleBarClick(idx);
            }
        });
    }

    handleBarClick(idx) {
        if (this.selectedIdx === null) {
            this.selectedIdx = idx;
            this.engine.highlight(idx, 'pivot');
        } else {
            if (this.selectedIdx === idx) {
                this.selectedIdx = null;
                this.engine.clearHighlights();
            } else {
                this.engine.swap(this.selectedIdx, idx);
                this.playerSwaps++;
                this.selectedIdx = null;
                this.engine.clearHighlights();
                this.onUpdateStats(this.playerSwaps, this.optimalSwaps);

                const isSorted = this.engine.array.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
                if (isSorted) {
                    this.active = false;
                    for (let k = 0; k < this.engine.array.length; k++) {
                        this.engine.highlight(k, 'sorted');
                    }
                    this.onWin(this.playerSwaps, this.optimalSwaps);
                }
            }
        }
    }
}

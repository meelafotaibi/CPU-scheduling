// UI Extras System - Phase 0 Foundation
class UIExtrasSystem {
    constructor() {
        window.UIExtrasInstance = this;
        this.contentSystem = new AlgoContentSystem();
        this.currentAlgo = null;
        this.init();
        this.injectGlobalFeatures();
        this.injectCSS();
        this.injectGuideButton();
    }

    init() {
        // Get algorithm from page attribute
        this.currentAlgo = document.documentElement.getAttribute('data-algo');
        if (this.currentAlgo) {
            this.injectStandardLayout();
        }
    }

    injectGlobalFeatures() {
        const getPrefix = () => {
            const path = window.location.pathname;
            if (path.includes('/visualizers/os/') || 
                path.includes('/visualizers/algorithms/') || 
                path.includes('/visualizers/dsa/') || 
                path.includes('/visualizers/ai/') || 
                path.includes('/visualizers/cg/')) {
                return '../../';
            }
            if (path.includes('/visualizers/') || 
                path.includes('/guide/') || 
                path.includes('/guides/')) {
                return '../';
            }
            return '';
        };
        const prefix = getPrefix();

        // 1. Dynamically load features.js if not present
        if (typeof SharingSystem === 'undefined') {
            const script = document.createElement('script');
            script.src = prefix + 'assets/js/core/features.js';
            script.onload = () => {
                if (window.ProgressSystem) window.ProgressSystem.updateDOMProgress();
            };
            document.head.appendChild(script);
        }

        // 1b. Dynamically load guide-content.js if not present
        if (typeof AlgoGuidesDatabase === 'undefined') {
            const script = document.createElement('script');
            script.src = prefix + 'assets/js/core/guide-content.js';
            document.head.appendChild(script);
        }
 
        // 2. Inject sleek progress tracker and Support Development button in Navigation Bar
        const injectNav = () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && !document.getElementById('nav-support-btn')) {
                // A. Progress Tracker container
                const progressDiv = document.createElement('div');
                progressDiv.id = 'global-progress-indicator';
                progressDiv.style.marginRight = '10px';
                progressDiv.style.display = 'inline-flex';
                progressDiv.style.alignItems = 'center';
                navLinks.insertBefore(progressDiv, navLinks.firstChild);

                // B. Support Development Button
                const supportBtn = document.createElement('a');
                supportBtn.id = 'nav-support-btn';
                supportBtn.href = prefix + 'support.html';
                supportBtn.className = 'btn';
                supportBtn.style.cssText = `
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    border: 1px solid var(--accent) !important;
                    color: var(--accent) !important;
                    background: transparent !important;
                    margin-left: 10px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 700;
                    box-shadow: 0 0 10px rgba(236, 72, 153, 0.15);
                    animation: none !important;
                    margin-bottom: 0 !important;
                    text-decoration: none;
                    transition: all 0.3s ease;
                `;
                supportBtn.innerHTML = `<i class="fas fa-heart" style="color: var(--accent);"></i> Support`;
                supportBtn.onmouseover = () => {
                    supportBtn.style.background = 'var(--accent)';
                    supportBtn.style.color = '#fff';
                    supportBtn.style.boxShadow = '0 0 20px rgba(236, 72, 153, 0.5)';
                };
                supportBtn.onmouseout = () => {
                    supportBtn.style.background = 'transparent';
                    supportBtn.style.color = 'var(--accent)';
                    supportBtn.style.boxShadow = '0 0 10px rgba(236, 72, 153, 0.15)';
                };
                navLinks.appendChild(supportBtn);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectNav);
        } else {
            injectNav();
        }
    }

    injectStandardLayout() {
        const content = this.contentSystem.getContent(this.currentAlgo);
        if (!content) return;

        // Find main container
        const main = document.querySelector('main') || document.body;

        // Create standard layout
        const layoutHTML = `
            <div class="algo-header">
                <div class="container">
                    <h1>${content.title}</h1>
                    <p class="algo-intro">${content.definition}</p>
                </div>
            </div>
            
            <div class="algo-content">
                <div class="container">
                    <div class="grid grid-2" style="margin-bottom: 40px;">
                        <div class="info-section"></div>
                        <div class="complexity-section"></div>
                    </div>
                    
                    <div class="visualizer-section">
                        <div class="glass-card">
                            <h3>Interactive Visualizer</h3>
                            <div id="visualizer-container"></div>
                            <div id="controls-container"></div>
                        </div>
                    </div>
                    
                    <div class="log-section">
                        <div class="glass-card">
                            <h3>Execution Log</h3>
                            <div id="live-log"></div>
                        </div>
                    </div>
                    
                    <div class="code-section"></div>
                    
                    <div class="navigation-section">
                        <div class="algo-navigation">
                            <a href="#" class="btn btn-secondary">← Previous Algorithm</a>
                            <a href="#" class="btn btn-secondary">Next Algorithm →</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        main.innerHTML = layoutHTML;

        // Inject content into sections
        this.injectInfoCard();
        this.injectComplexityCard();
        this.injectCodeCard();
        this.enhanceLiveLog();
    }

    injectInfoCard() {
        const content = this.contentSystem.getContent(this.currentAlgo);
        const infoSection = document.querySelector('.info-section');

        const prosHTML = content.proscons.pros.map(pro => `<li>${pro}</li>`).join('');
        const consHTML = content.proscons.cons.map(con => `<li>${con}</li>`).join('');

        infoSection.innerHTML = `
            <div class="glass-card">
                <h3>Definition & Usage</h3>
                <p><strong>What it does:</strong> ${content.definition}</p>
                <p><strong>Common uses:</strong> ${content.usage}</p>
                
                <div style="margin-top: 24px;">
                    <h4 style="color: var(--success); margin-bottom: 12px;">✅ Advantages</h4>
                    <ul style="margin-left: 20px; color: var(--text-muted);">
                        ${prosHTML}
                    </ul>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4 style="color: var(--warning); margin-bottom: 12px;">⚠️ Limitations</h4>
                    <ul style="margin-left: 20px; color: var(--text-muted);">
                        ${consHTML}
                    </ul>
                </div>
            </div>
        `;
    }

    injectComplexityCard() {
        const content = this.contentSystem.getContent(this.currentAlgo);
        const complexitySection = document.querySelector('.complexity-section');

        complexitySection.innerHTML = `
            <div class="glass-card">
                <h3>Complexity Analysis</h3>
                <div class="complexity-table">
                    <div class="complexity-row">
                        <span class="complexity-label">Time Complexity:</span>
                        <span class="complexity-value">${content.complexity.time}</span>
                    </div>
                    <div class="complexity-row">
                        <span class="complexity-label">Space Complexity:</span>
                        <span class="complexity-value">${content.complexity.space}</span>
                    </div>
                    ${content.complexity.stable !== 'N/A' ? `
                    <div class="complexity-row">
                        <span class="complexity-label">Stable:</span>
                        <span class="complexity-value">${content.complexity.stable}</span>
                    </div>
                    ` : ''}
                    ${content.complexity.inPlace !== 'N/A' ? `
                    <div class="complexity-row">
                        <span class="complexity-label">In-place:</span>
                        <span class="complexity-value">${content.complexity.inPlace}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    injectCodeCard() {
        const content = this.contentSystem.getContent(this.currentAlgo);
        const codeSection = document.querySelector('.code-section');

        codeSection.innerHTML = `
            <div class="code-card">
                <div class="code-header">
                    <h4>Implementation</h4>
                    <div class="code-tabs">
                        <button class="code-tab active" data-lang="python">Python</button>
                        <button class="code-tab" data-lang="cpp">C++</button>
                        <button class="code-tab" data-lang="java">Java</button>
                        <button class="copy-btn">📋 Copy</button>
                    </div>
                </div>
                <div class="code-viewer">
                    <pre><code id="code-content">${content.code.python}</code></pre>
                </div>
            </div>
        `;

        this.setupCodeTabs();
    }

    setupCodeTabs() {
        const content = this.contentSystem.getContent(this.currentAlgo);
        const tabs = document.querySelectorAll('.code-tab');
        const codeContent = document.getElementById('code-content');
        const copyBtn = document.querySelector('.copy-btn');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const lang = tab.getAttribute('data-lang');
                codeContent.textContent = content.code[lang];
            });
        });

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeContent.textContent);
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy';
            }, 2000);
        });
    }

    enhanceLiveLog() {
        const logContainer = document.getElementById('live-log');
        if (!logContainer) return;

        logContainer.innerHTML = `
            <div class="log-controls">
                <button class="btn btn-secondary" onclick="this.clearLog()">Clear Log</button>
                <span class="log-counter">Steps: <span id="step-counter">0</span></span>
            </div>
            <div class="log-history" id="log-history">
                <div class="log-entry">Ready to start visualization...</div>
            </div>
        `;

        // Add log methods to window for global access
        window.logStep = (message, type = 'info') => {
            const logHistory = document.getElementById('log-history');
            const stepCounter = document.getElementById('step-counter');

            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.innerHTML = `
                <span class="log-time">${new Date().toLocaleTimeString()}</span>
                <span class="log-message">${message}</span>
            `;

            logHistory.appendChild(entry);
            logHistory.scrollTop = logHistory.scrollHeight;

            const currentSteps = parseInt(stepCounter.textContent) + 1;
            stepCounter.textContent = currentSteps;
        };

        window.clearLog = () => {
            const logHistory = document.getElementById('log-history');
            const stepCounter = document.getElementById('step-counter');
            logHistory.innerHTML = '<div class="log-entry">Log cleared. Ready to start...</div>';
            stepCounter.textContent = '0';
        };
    }

    standardizeButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (!btn.classList.contains('btn-primary') && !btn.classList.contains('btn-secondary')) {
                btn.classList.add('btn-secondary');
            }
        });
    }

    injectCSS() {
        const styleId = 'algovis-guide-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Guide Panel Slide-Over Styling */
            .algovis-guide-panel {
                position: fixed;
                top: 0;
                right: -480px;
                width: 450px;
                height: 100vh;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(25px);
                -webkit-backdrop-filter: blur(25px);
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                padding: 30px;
                box-sizing: border-box;
                overflow-y: auto;
                color: var(--text);
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .algovis-guide-panel.open {
                right: 0;
            }
            .algovis-guide-close {
                position: absolute;
                top: 25px;
                right: 25px;
                background: transparent;
                border: none;
                color: var(--text-muted);
                font-size: 1.5rem;
                cursor: pointer;
                transition: color 0.2s;
                line-height: 1;
            }
            .algovis-guide-close:hover {
                color: var(--accent);
            }
            .algovis-guide-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 9998;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .algovis-guide-backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }
            .algovis-guide-btn {
                border: 1px solid var(--primary) !important;
                color: var(--primary) !important;
                background: transparent !important;
                padding: 10px 20px;
                border-radius: 12px;
                font-weight: bold;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            .algovis-guide-btn:hover {
                background: var(--primary) !important;
                color: #fff !important;
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
            }
            .guide-sub-heading {
                color: var(--primary);
                font-size: 1.1rem;
                font-weight: 800;
                margin-top: 15px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                padding-bottom: 6px;
            }
            .guide-control-item {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 8px;
                font-size: 0.85rem;
            }
            .guide-control-name {
                font-weight: bold;
                color: var(--accent);
                margin-bottom: 3px;
            }
            @media (max-width: 480px) {
                .algovis-guide-panel {
                    width: 100%;
                    right: -100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    injectGuideButton() {
        const path = window.location.pathname.toLowerCase();
        if (!path.includes('/visualizers/')) return;

        // Detect algorithm key
        let algoKey = "";
        if (path.includes('disk.html')) algoKey = "disk";
        else if (path.includes('cpu-scheduling.html')) algoKey = "cpu-scheduling";
        else if (path.includes('semaphores.html')) algoKey = "semaphores";
        else if (path.includes('bankers.html')) algoKey = "bankers";
        else if (path.includes('page-replacement.html')) algoKey = "page-replacement";
        else if (path.includes('memory-allocation.html')) algoKey = "memory-allocation";
        else if (path.includes('deadlock-detection.html')) algoKey = "deadlock-detection";
        else if (path.includes('process-sync.html')) algoKey = "process-sync";
        else if (path.includes('bubble.html')) algoKey = "bubble";
        else if (path.includes('selection.html')) algoKey = "selection";
        else if (path.includes('insertion.html')) algoKey = "insertion";
        else if (path.includes('merge.html')) algoKey = "merge";
        else if (path.includes('quick.html')) algoKey = "quick";
        else if (path.includes('advanced-sorting.html') || path.includes('radix')) algoKey = "radix-bucket";
        else if (path.includes('bfs.html')) algoKey = "bfs";
        else if (path.includes('dfs.html')) algoKey = "dfs";
        else if (path.includes('dijkstra.html')) algoKey = "dijkstra";
        else if (path.includes('astar.html')) algoKey = "astar";
        else if (path.includes('bellman-ford.html')) algoKey = "bellman-ford";
        else if (path.includes('mst.html')) algoKey = "mst";
        else if (path.includes('topo.html')) algoKey = "topo";
        else if (path.includes('cycle-detection.html')) algoKey = "cycle-detection";
        else if (path.includes('recursion.html')) algoKey = "recursion";
        else if (path.includes('dp.html')) algoKey = "dp";
        else if (path.includes('trie.html')) algoKey = "trie";
        else if (path.includes('heap.html')) algoKey = "heap";
        else if (path.includes('avl.html')) algoKey = "avl";
        else if (path.includes('bst.html')) algoKey = "bst";
        else if (path.includes('stack-queue.html')) algoKey = "stack-queue";
        else if (path.includes('linked-list.html')) algoKey = "linked-list";
        else if (path.includes('minimax.html')) algoKey = "minimax";
        else if (path.includes('linear-regression.html')) algoKey = "linear-regression";
        else if (path.includes('knn.html')) algoKey = "knn";
        else if (path.includes('kmeans.html')) algoKey = "kmeans";
        else if (path.includes('perceptron.html')) algoKey = "perceptron";
        else if (path.includes('binary-search.html') || path.includes('search.html')) algoKey = "binary-search";

        if (!algoKey) return;

        const performInjection = () => {
            const hero = document.querySelector('.page-hero') || document.querySelector('main.container > header') || document.querySelector('header');
            if (!hero) return;

            if (document.getElementById('open-guide-btn')) return;

            const btn = document.createElement('button');
            btn.id = 'open-guide-btn';
            btn.className = 'algovis-guide-btn';
            btn.innerHTML = `<i class="fas fa-book-open"></i> Read Guide`;
            btn.onclick = () => this.openGuide(algoKey);

            btn.style.marginTop = '10px';
            btn.style.marginBottom = '10px';

            const gameBtn = hero.querySelector('#game-mode-btn') || hero.querySelector('.btn') || hero.querySelector('button');
            if (gameBtn) {
                gameBtn.parentNode.insertBefore(btn, gameBtn);
                btn.style.marginRight = '10px';
            } else {
                hero.appendChild(btn);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', performInjection);
        } else {
            performInjection();
        }
    }

    injectPanelHTML() {
        if (document.getElementById('algovis-guide-panel')) return;

        const backdrop = document.createElement('div');
        backdrop.id = 'algovis-guide-backdrop';
        backdrop.className = 'algovis-guide-backdrop';
        backdrop.onclick = () => this.closeGuide();
        document.body.appendChild(backdrop);

        const panel = document.createElement('div');
        panel.id = 'algovis-guide-panel';
        panel.className = 'algovis-guide-panel';
        panel.innerHTML = `
            <button class="algovis-guide-close" onclick="window.UIExtrasInstance.closeGuide()">&times;</button>
            <h2 id="guide-title" style="margin-bottom: 10px; background: var(--gradient-tri-tone); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;">Algorithm Guide</h2>
            <div id="guide-content-area" style="display: flex; flex-direction: column; gap: 20px;"></div>
        `;
        document.body.appendChild(panel);
    }

    openGuide(algoKey) {
        this.injectPanelHTML();

        if (typeof AlgoGuidesDatabase === 'undefined') {
            console.error("AlgoGuidesDatabase is not loaded yet.");
            alert("Guide database is still loading, please try again in a second.");
            return;
        }

        const guide = AlgoGuidesDatabase[algoKey];
        if (!guide) {
            console.error(`No guide content found for key: ${algoKey}`);
            return;
        }

        document.getElementById('guide-title').textContent = guide.title;

        let controlsHTML = "";
        for (const [name, desc] of Object.entries(guide.controls)) {
            controlsHTML += `
                <div class="guide-control-item">
                    <div class="guide-control-name">${name}</div>
                    <div style="color: var(--text-muted); line-height: 1.4;">${desc}</div>
                </div>
            `;
        }

        let gameHTML = "";
        if (guide.game) {
            gameHTML = `
                <div>
                    <div class="guide-sub-heading"><i class="fas fa-gamepad"></i> Interactive Challenge Game</div>
                    <div style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.15); border-radius: 12px; padding: 15px;">
                        <h4 style="color: var(--accent); margin-bottom: 8px;"><i class="fas fa-trophy"></i> ${guide.game.name}</h4>
                        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 8px; line-height: 1.4;"><strong>Objective:</strong> ${guide.game.objective}</p>
                        <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.4;"><strong>How to Play:</strong> ${guide.game.instructions}</p>
                    </div>
                </div>
            `;
        }

        const contentArea = document.getElementById('guide-content-area');
        contentArea.innerHTML = `
            <div>
                <div class="guide-sub-heading"><i class="fas fa-lightbulb"></i> Algorithm Concept</div>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${guide.concept}</p>
            </div>
            
            <div>
                <div class="guide-sub-heading"><i class="fas fa-sliders-h"></i> Visualizer Controls</div>
                <div style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                    ${controlsHTML}
                </div>
            </div>
            
            <div>
                <div class="guide-sub-heading"><i class="fas fa-file-alt"></i> How to Read Simulation Logs</div>
                <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5;">${guide.logs}</p>
            </div>
            
            ${gameHTML}
        `;

        document.getElementById('algovis-guide-panel').classList.add('open');
        document.getElementById('algovis-guide-backdrop').classList.add('open');
    }

    closeGuide() {
        const panel = document.getElementById('algovis-guide-panel');
        const backdrop = document.getElementById('algovis-guide-backdrop');
        if (panel) panel.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UIExtrasSystem();
});

// Export for manual initialization
window.UIExtrasSystem = UIExtrasSystem;

// --- Viral Features: Screenshot & Share ---

let _html2canvasLoaded = null;

function loadHtml2Canvas() {
    if (_html2canvasLoaded) return _html2canvasLoaded;

    _html2canvasLoaded = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    return _html2canvasLoaded;
}

window.shareScreenshot = async function (targetId, algoName) {
    const target = document.getElementById(targetId);
    if (!target) {
        console.error(`Target element ${targetId} not found`);
        return;
    }

    const btn = document.activeElement;
    const originalText = btn ? btn.textContent : 'Share';
    if (btn) btn.textContent = '📸 Capturing...';

    try {
        await loadHtml2Canvas();

        const canvas = await html2canvas(target, {
            backgroundColor: '#ffffff', // Force white background for dark mode/transparency
            scale: window.devicePixelRatio || 2,
            logging: false,
            useCORS: true
        });

        addWatermark(canvas, algoName);
        downloadCanvas(canvas, algoName);
    } catch (err) {
        console.error('Screenshot failed:', err);
        alert('Failed to create screenshot. Please try again.');
    } finally {
        if (btn) btn.textContent = originalText;
    }
};

function addWatermark(canvas, algoName) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Add explicit brand strip at bottom
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(0, height - 40, width, 40);

    ctx.font = "bold 24px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#111827"; // Dark text
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    ctx.fillText(
        `AlgoVisual Hub • ${algoName}`,
        width - 20,
        height - 20
    );
}

function downloadCanvas(canvas, algoName) {
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `algovisualhub-${algoName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}
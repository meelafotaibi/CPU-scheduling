// UI Extras System - Phase 0 Foundation
class UIExtrasSystem {
    constructor() {
        window.UIExtrasInstance = this;
        this.contentSystem = typeof AlgoContentSystem !== 'undefined'
            ? new AlgoContentSystem()
            : null;
        this.currentAlgo = null;
        this.init();
        this.injectGlobalFeatures();
        this.injectCSS();
        this.injectGuideButton();
    }

    init() {
        // Get algorithm from page attribute
        this.currentAlgo = document.documentElement.getAttribute('data-algo');
        if (this.currentAlgo && this.contentSystem) {
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
                supportBtn.innerHTML = `<img src="${prefix}assets/img/logo.png" style="height: 1.25em; width: auto; vertical-align: middle; margin-right: 6px;"> Support`;
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
                    <h4 style="color: var(--success); margin-bottom: 12px;"><i class="fas fa-check-circle" style="color: var(--success);"></i> Advantages</h4>
                    <ul style="margin-left: 20px; color: var(--text-muted);">
                        ${prosHTML}
                    </ul>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4 style="color: var(--warning); margin-bottom: 12px;"><i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i> Limitations</h4>
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
                        <button class="copy-btn"><i class="fas fa-clipboard"></i> Copy</button>
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
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-clipboard"></i> Copy';
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

        // Extract the last segment and strip any trailing .html
        let segment = path.split('/').pop();
        if (segment.endsWith('.html')) {
            segment = segment.slice(0, -5);
        }

        // Detect algorithm key
        let algoKey = "";
        if (segment === 'disk') algoKey = "disk";
        else if (segment === 'cpu-scheduling') algoKey = "cpu-scheduling";
        else if (segment === 'semaphores') algoKey = "semaphores";
        else if (segment === 'bankers') algoKey = "bankers";
        else if (segment === 'page-replacement') algoKey = "page-replacement";
        else if (segment === 'memory-allocation') algoKey = "memory-allocation";
        else if (segment === 'deadlock-detection') algoKey = "deadlock-detection";
        else if (segment === 'process-sync') algoKey = "process-sync";
        else if (segment === 'bubble') algoKey = "bubble";
        else if (segment === 'selection') algoKey = "selection";
        else if (segment === 'insertion') algoKey = "insertion";
        else if (segment === 'merge') algoKey = "merge";
        else if (segment === 'quick') algoKey = "quick";
        else if (segment === 'advanced-sorting' || segment === 'radix') algoKey = "radix-bucket";
        else if (segment === 'bfs') algoKey = "bfs";
        else if (segment === 'dfs') algoKey = "dfs";
        else if (segment === 'dijkstra') algoKey = "dijkstra";
        else if (segment === 'astar') algoKey = "astar";
        else if (segment === 'bellman-ford') algoKey = "bellman-ford";
        else if (segment === 'mst') algoKey = "mst";
        else if (segment === 'topo') algoKey = "topo";
        else if (segment === 'cycle-detection') algoKey = "cycle-detection";
        else if (segment === 'recursion') algoKey = "recursion";
        else if (segment === 'dp') algoKey = "dp";
        else if (segment === 'trie') algoKey = "trie";
        else if (segment === 'heap') algoKey = "heap";
        else if (segment === 'avl') algoKey = "avl";
        else if (segment === 'bst') algoKey = "bst";
        else if (segment === 'stack-queue') algoKey = "stack-queue";
        else if (segment === 'linked-list') algoKey = "linked-list";
        else if (segment === 'minimax') algoKey = "minimax";
        else if (segment === 'linear-regression') algoKey = "linear-regression";
        else if (segment === 'knn') algoKey = "knn";
        else if (segment === 'kmeans') algoKey = "kmeans";
        else if (segment === 'perceptron') algoKey = "perceptron";
        else if (segment === 'binary-search' || segment === 'search') algoKey = "binary-search";

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
    if (btn) btn.innerHTML = '<i class="fas fa-camera"></i> Capturing...';

    try {
        await loadHtml2Canvas();

        const canvas = await html2canvas(target, {
            backgroundColor: '#090d16', // Preserve rich dark background for glassmorphic/neon aesthetics
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

    // Calculate proportional font sizing and padding for high-DPI screenshots
    const scaleFactor = Math.max(1, Math.round(width / 800));
    const fontSize = Math.max(14, 16 * scaleFactor);
    const padding = Math.max(15, 20 * scaleFactor);
    const stripHeight = Math.max(45, 50 * scaleFactor);

    // Add translucent dark glass brand strip at the bottom
    ctx.fillStyle = "rgba(9, 13, 22, 0.95)";
    ctx.fillRect(0, height - stripHeight, width, stripHeight);

    // Draw glowing neon accent line at the top of the brand strip
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#6366f1"); // Indigo
    gradient.addColorStop(0.5, "#a855f7"); // Purple
    gradient.addColorStop(1, "#ec4899"); // Pink
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(2, 3 * scaleFactor);
    ctx.beginPath();
    ctx.moveTo(0, height - stripHeight);
    ctx.lineTo(width, height - stripHeight);
    ctx.stroke();

    // Brand Label
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("AlgoVisual Hub", padding, height - (stripHeight / 2));

    // Algorithm name label on the right
    ctx.textAlign = "right";
    ctx.fillStyle = "#a5b4fc"; // Soft lavender-indigo
    ctx.fillText(algoName, width - padding, height - (stripHeight / 2));
}

function downloadCanvas(canvas, algoName) {
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `algovisualhub-${algoName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

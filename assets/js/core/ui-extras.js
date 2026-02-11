// UI Extras System - Phase 0 Foundation
class UIExtrasSystem {
    constructor() {
        this.contentSystem = new AlgoContentSystem();
        this.currentAlgo = null;
        this.init();
    }

    init() {
        // Get algorithm from page attribute
        this.currentAlgo = document.documentElement.getAttribute('data-algo');
        if (this.currentAlgo) {
            this.injectStandardLayout();
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
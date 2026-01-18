/**
 * ui-extras.js - CORE UTILITY
 * Handles dynamic feature injection: Dark Mode, Info/Code Cards, Interview Mode, etc.
 */

(function () {
    // 1. Ensure DOM is ready before running
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    function initApp() {
        // 2. Load Content Database if missing
        if (typeof AlgoContent === 'undefined') {
            loadScript('../assets/js/core/algo-content.js')
                .then(() => bootstrapUI())
                .catch(() => {
                    console.warn("AlgoContent failed to load. Using generic fallbacks.");
                    // Define minimal fallback to prevent crash
                    window.AlgoContent = {};
                    bootstrapUI();
                });
        } else {
            bootstrapUI();
        }
    }

    // Helper to load scripts async
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => {
                // Try alternate path (for index.html vs subpages)
                if (src.startsWith('../')) {
                    const s2 = document.createElement('script');
                    s2.src = src.replace('../', '');
                    s2.onload = resolve;
                    s2.onerror = reject;
                    document.head.appendChild(s2);
                } else {
                    reject();
                }
            };
            document.head.appendChild(s);
        });
    }

    function bootstrapUI() {
        injectButtons(); // NavBar (Interview Mode, etc.)

        // Only inject educational content on visualizer pages (check for canvas)
        if (document.querySelector('canvas') || document.querySelector('.visualizer-layout')) {
            createModals();  // Export/Input Modals (Moved here)
            injectEducationalContent();
            enhanceLiveLog();
            standardizeButtons();
        }
    }

    /**
     * NAVBAR INJECTION
     */
    function injectButtons() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        // Check if we are on a visualizer page to add specialized buttons
        const isVisualizer = document.querySelector('canvas') !== null;

        if (isVisualizer && !document.getElementById('toggle-interview-mode')) {
            const interviewBtn = document.createElement('a');
            interviewBtn.href = "#";
            interviewBtn.id = "toggle-interview-mode";
            interviewBtn.innerHTML = '<i class="fas fa-user-graduate"></i> Interview Mode';
            interviewBtn.style.color = "var(--accent)";
            interviewBtn.style.fontWeight = "700";
            interviewBtn.onclick = (e) => { e.preventDefault(); toggleInterviewMode(); };

            const exportBtn = document.createElement('a');
            exportBtn.href = "#";
            exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export';
            exportBtn.onclick = (e) => { e.preventDefault(); showModal('export-modal'); };

            navLinks.appendChild(interviewBtn);
            navLinks.appendChild(exportBtn);
        }

        // Inject Complexity Tracker if needed
        const sidePanel = document.querySelector('.side-panel');
        if (sidePanel && !document.getElementById('complexity-container')) {
            const container = document.createElement('div');
            container.id = 'complexity-container';
            container.style.display = 'none';
            sidePanel.prepend(container);
            if (window.ComplexityTracker) {
                window.complexityTracker = new ComplexityTracker('complexity-container');
            }
        }

        // Custom Input Button (Universal)
        const controls = document.querySelector('.visualizer-layout .glass-card > div[style*="justify-content: space-between"]')
            || document.querySelector('.visualizer-layout .glass-card + div') // fallback
            || document.querySelector('.glass-card .input-group') // fallback
            || document.querySelector('.visualizer-layout .glass-card'); // ult fallback

        if (controls && isVisualizer && !document.getElementById('universal-input-btn')) {
            // Try to remove old buttons
            const existingInput = Array.from(document.querySelectorAll('button'))
                .find(b => b.innerText.includes('Custom Input') || b.innerText.includes('User Input'));
            if (existingInput) existingInput.remove();

            const btn = document.createElement('button');
            btn.id = "universal-input-btn";
            btn.className = "btn";
            btn.style.background = "var(--secondary)";
            btn.style.color = "white";
            btn.innerHTML = '<i class="fas fa-edit"></i> Custom Input';
            btn.onclick = () => showModal('input-modal');

            // Append to button group if clear, otherwise just controls
            const btnGroup = controls.querySelector('div[style*="gap"]') || controls;
            btnGroup.appendChild(btn);
        }
    }

    /**
     * EDUCATIONAL CONTENT INJECTION
     */
    function injectEducationalContent() {
        const title = document.title.toLowerCase();
        let key = null;

        // Better Regex/String matching 
        if (title.includes('bubble')) key = 'bubble';
        else if (title.includes('selection')) key = 'selection';
        else if (title.includes('insertion')) key = 'insertion';
        else if (title.includes('linked list')) key = 'linked-list';
        else if (title.includes('merge')) key = 'merge';
        else if (title.includes('quick')) key = 'quick';
        else if (title.includes('heap') && title.includes('sort')) key = 'heapsort';
        else if (title.includes('bst') || title.includes('binary search tree')) key = 'bst';
        else if (title.includes('avl')) key = 'avl';
        else if (title.includes('dijkstra')) key = 'dijkstra';
        else if (title.includes('bfs')) key = 'bfs';
        else if (title.includes('dfs')) key = 'dfs';
        else if (title.includes('cpu') || title.includes('scheduling')) key = 'cpu-scheduling';
        else if (title.includes('disk')) key = 'disk';
        else if (title.includes('page') || title.includes('replacement')) key = 'page-replacement';
        else if (title.includes('memory') || title.includes('allocation')) key = 'memory-allocation';
        else if (title.includes('banker') || title.includes('deadlock')) key = 'bankers';
        else if (title.includes('knn') || title.includes('nearest')) key = 'knn';
        else if (title.includes('kmeans') || title.includes('clustering')) key = 'kmeans';
        else if (title.includes('linear') || title.includes('regression')) key = 'linear-regression';
        else if (title.includes('search')) key = 'search';

        // Retrieve data or Generic Fallback
        const data = (key && window.AlgoContent && window.AlgoContent[key]) ? window.AlgoContent[key] : {
            description: `Visualization of the <strong>${document.title.split('|')[0].trim()}</strong> algorithm.`,
            pros: ["Visual aid helps understanding.", "Step-by-step execution analysis."],
            cons: [],
            code: {
                python: "# Code implementation coming soon...",
                cpp: "// Code implementation coming soon...",
                java: "// Code implementation coming soon...",
                c: "// Code implementation coming soon..."
            }
        };

        const codeKey = (key && window.AlgoContent && window.AlgoContent[key]) ? key : 'generic';
        // Register generic if needed for switchLang
        if (window.AlgoContent && !window.AlgoContent['generic']) window.AlgoContent['generic'] = data;

        const sidePanel = document.querySelector('.side-panel');
        if (sidePanel && !document.querySelector('.info-card')) {
            const infoCard = document.createElement('div');
            infoCard.className = 'glass-card info-card';
            infoCard.style.padding = '20px';
            infoCard.innerHTML = `
                <h4>📘 Algorithm Details</h4>
                <div class="info-section">
                    <p>${data.description}</p>
                </div>
                ${data.pros.length > 0 ? `<div class="info-section"><h5>Pros</h5><ul class="info-list">${data.pros.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${data.cons.length > 0 ? `<div class="info-section"><h5>Cons</h5><ul class="info-list">${data.cons.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
            `;
            sidePanel.appendChild(infoCard);
        }

        const layout = document.querySelector('.visualizer-layout');
        if (layout && !document.querySelector('.code-card')) {
            const codeCard = document.createElement('div');
            codeCard.className = 'glass-card code-card';
            codeCard.style.padding = '20px';
            codeCard.style.marginTop = '20px';
            codeCard.style.gridColumn = '1 / -1';
            codeCard.innerHTML = `
                <div class="code-header">
                    <h4>👨‍💻 Implementation</h4>
                    <div class="code-tabs">
                        <button class="code-tab active" onclick="switchLang('python', '${codeKey}')">Python</button>
                        <button class="code-tab" onclick="switchLang('cpp', '${codeKey}')">C++</button>
                        <button class="code-tab" onclick="switchLang('java', '${codeKey}')">Java</button>
                        <button class="code-tab" onclick="switchLang('c', '${codeKey}')">C</button>
                        <button class="code-tab" onclick="copyCode()" title="Copy"><i class="fas fa-copy"></i></button>
                    </div>
                </div>
                <div class="code-viewer" id="code-display">${data.code.python}</div>
            `;
            layout.appendChild(codeCard);
        }
    }

    /**
     * GLOBAL HELPERS
     */
    window.switchLang = function (lang, key) {
        if (!window.AlgoContent[key]) return;
        document.getElementById('code-display').innerText = window.AlgoContent[key].code[lang];
        document.querySelectorAll('.code-tab').forEach(t => {
            if (t.innerText.toLowerCase().includes(lang === 'cpp' ? 'c++' : lang)) t.classList.add('active');
            else if (!t.title) t.classList.remove('active');
        });
    }

    window.copyCode = function () {
        navigator.clipboard.writeText(document.getElementById('code-display').innerText).then(() => {
            showToast("✨ Code Secured! Ready for deployment. 🚀");
        });
    }

    function showToast(msg) {
        let toast = document.getElementById('visualizer-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'visualizer-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                font-weight: 600;
                font-size: 0.95rem;
                z-index: 10000;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<i class="fas fa-check-circle" style="font-size:1.2em"></i> ${msg}`;

        // Trigger Animation
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        });

        // Hide after 3s
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    window.toggleInterviewMode = function () {
        const c = document.getElementById('complexity-container');
        if (!c) return;
        const hidden = c.style.display === 'none';
        c.style.display = hidden ? 'block' : 'none';
        // Toggle other cards
        document.querySelectorAll('.side-panel .glass-card:not(#complexity-container)').forEach(card => {
            // Keep info card visible? Usually interview mode hides clutter
            if (card.innerText.includes('Complexity') || card.innerText.includes('Stats')) {
                card.style.display = hidden ? 'none' : 'block';
            }
        });
    }

    window.closeModal = function () {
        document.getElementById('algo-modal-overlay').classList.add('hide');
        document.querySelectorAll('.modal-content').forEach(m => m.classList.add('hide'));
    }

    window.showModal = function (id) {
        document.getElementById('algo-modal-overlay').classList.remove('hide');
        document.getElementById(id).classList.remove('hide');
    }

    window.handleUniversalInput = function () {
        const val = document.getElementById('custom-data-text').value;
        if (!val) return;
        const title = document.title.toLowerCase();
        try {
            if (title.includes('sort')) {
                const arr = val.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (window.engine && window.engine.setArray) window.engine.setArray(arr);
                if (window.algo && window.algo.reset) window.algo.reset();
            } else if (title.includes('search')) {
                const arr = val.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (window.engine && window.engine.setArray) {
                    window.engine.setArray(arr);
                    const log = document.getElementById('explanation-text') || document.querySelector('.log-entry');
                    if (log) log.innerText = "Array updated. Ready to search.";
                }
            } else if (title.includes('tree') || title.includes('heap') || title.includes('bst')) {
                const arr = val.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
                if (window.algo && window.algo.reset) window.algo.reset();
                arr.forEach(v => { if (window.algo.insert) window.algo.insert(v); });
            }
            window.closeModal();
        } catch (e) { alert("Error: " + e.message); }
    }

    window.downloadCanvasAsImage = function () {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const a = document.createElement('a');
            a.download = 'algovisual.png';
            a.href = canvas.toDataURL();
            a.click();
            window.closeModal();
        }
    }

    /* Modal Creation Helper - Message Style */
    function createModals() {
        if (document.getElementById('algo-modal-overlay')) return;
        const d = document.createElement('div');
        d.innerHTML = `
        <div id="algo-modal-overlay" class="modal-overlay hide">
            <!-- Export Modal -->
            <div id="export-modal" class="modal-content hide">
                <button class="close-btn" onclick="closeModal()">×</button>
                <h3>📤 Export</h3>
                <p>Save your visualization results.</p>
                <div class="modal-actions">
                    <button class="modal-btn primary" onclick="downloadCanvasAsImage()">Save PNG</button>
                    <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>

            <!-- Input Modal -->
            <div id="input-modal" class="modal-content hide">
                <button class="close-btn" onclick="closeModal()">×</button>
                <h3>✏️ Custom Input</h3>
                <p>Enter your dataset below.</p>
                <textarea id="custom-data-text" style="width:100%;height:100px;margin:0 0 20px 0;padding:12px;border-radius:12px;border:1px solid #ddd;font-family:monospace;"></textarea>
                <div class="modal-actions">
                    <button class="modal-btn primary" onclick="handleUniversalInput()">Apply Data</button>
                    <button class="modal-btn secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        </div>`;
        document.body.appendChild(d);

        // Placeholder Logic
        const title = document.title.toLowerCase();
        const t = document.getElementById('custom-data-text');
        if (title.includes('graph')) t.placeholder = "e.g. 0-1, 1-2, 2-3";
        else t.placeholder = "e.g. 10, 5, 8, 3, 1";
    }

    /**
     * UNIVERSAL LIVE LOG
     * Adds a scrollable log container to every visualizer and exposes window.Logger
     */
    function enhanceLiveLog() {
        const sidePanel = document.querySelector('.side-panel');
        if (!sidePanel || document.getElementById('live-log-container')) return;

        // Create Container
        const container = document.createElement('div');
        container.className = 'live-log-container';
        container.id = 'live-log-container';
        container.innerHTML = `
            <div class="live-log-header">
                <span>📜 Execution Log</span>
                <span style="font-size:0.8rem;opacity:0.7">History</span>
            </div>
            <div class="live-log-content" id="live-log-content">
                <div class="log-entry" style="color:#999;font-style:italic">Waiting for execution...</div>
            </div>
        `;
        sidePanel.appendChild(container);

        const logContent = document.getElementById('live-log-content');

        // PUBLIC API
        window.Logger = {
            step: 0,
            log: function (msg) {
                if (logContent.children.length === 1 && logContent.children[0].innerText.includes('Waiting')) {
                    logContent.innerHTML = '';
                }
                this.step++;
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                entry.innerHTML = `<span class="log-step">#${this.step}</span> ${msg}`;
                logContent.appendChild(entry);
                logContent.scrollTop = logContent.scrollHeight;
            },
            clear: function () {
                this.step = 0;
                logContent.innerHTML = '<div class="log-entry" style="color:#999;font-style:italic">Waiting for execution...</div>';
            }
        };

        // MONKEY PATCH existing updateStatus for backward compatibility
        if (window.ui && window.ui.updateStatus) {
            const original = window.ui.updateStatus;
            window.ui.updateStatus = function (msg) {
                original(msg); // Run original logic
                window.Logger.log(msg); // Also log to our new container
            };
        } else {
            // If no existing status function, init one
            if (!window.ui) window.ui = {};
            window.ui.updateStatus = (msg) => window.Logger.log(msg);
        }
    }

    function standardizeButtons() {
        // ...
        document.querySelectorAll('.btn').forEach(b => {
            if (!b.classList.contains('code-tab')) b.style.minWidth = '100px';
        });
    }

})();
Riverside

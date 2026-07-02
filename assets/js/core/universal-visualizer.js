// Universal Visualizer Generator
class UniversalVisualizer {
    static generateHTML(algoKey, title, additionalScripts = []) {
        const scripts = [
            '../assets/js/core/complete-algo-content.js',
            '../assets/js/core/ui-extras.js',
            ...additionalScripts
        ].map(src => `<script src="${src}"></script>`).join('\n    ');

        return `<!DOCTYPE html>
<html lang="en" data-theme="dark" data-algo="${algoKey}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - AlgoVisual Hub</title>
    <meta name="description" content="Interactive ${title.toLowerCase()} visualization with step-by-step execution.">
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>
    <nav>
        <div class="container">
            <div class="nav-content">
                <a href="../index.html" class="logo">AlgoVisual Hub</a>
                <div class="nav-links">
                    <a href="../algorithms.html">Algorithms</a>
                    <a href="../dsa.html">DSA</a>
                    <a href="../os.html">OS</a>

                </div>
            </div>
        </div>
    </nav>

    <main></main>

    ${scripts}
    <script>


        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const visualizerContainer = document.getElementById('visualizer-container');
                if (visualizerContainer) {
                    initializeVisualizer('${algoKey}');
                }
            }, 100);
        });

        function initializeVisualizer(algoKey) {
            const container = document.getElementById('visualizer-container');
            
            // Default visualization based on algorithm type
            if (['bfs', 'dfs', 'dijkstra', 'astar', 'bellman-ford', 'kruskal', 'topo'].includes(algoKey)) {
                container.innerHTML = \`
                    <canvas id="graph-canvas" width="600" height="400" style="border: 1px solid var(--border); border-radius: 8px; width: 100%;"></canvas>
                    <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="startAlgorithm()">Start \${algoKey.toUpperCase()}</button>
                        <button class="btn btn-secondary" onclick="resetVisualization()">Reset</button>
                        <button class="btn btn-secondary" onclick="shareScreenshot('visualizer-container', '\${algoKey.toUpperCase()}')"><i class="fas fa-camera"></i> Share</button>
                    </div>
                \`;
            } else if (['bubble-sort', 'insertion', 'selection', 'merge-sort', 'quick-sort', 'heap'].includes(algoKey)) {
                container.innerHTML = \`
                    <div id="array-container" style="display: flex; justify-content: center; align-items: end; height: 300px; gap: 4px; margin: 20px 0;"></div>
                    <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="startSorting()">Start Sort</button>
                        <button class="btn btn-secondary" onclick="generateArray()">New Array</button>
                        <button class="btn btn-secondary" onclick="resetArray()">Reset</button>
                        <button class="btn btn-secondary" onclick="shareScreenshot('visualizer-container', '\${algoKey.toUpperCase()}')"><i class="fas fa-camera"></i> Share</button>
                    </div>
                \`;
                initializeSortingArray();
            } else if (['bst', 'avl', 'trie'].includes(algoKey)) {
                container.innerHTML = \`
                    <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px;">
                        <div id="tree-container" style="height: 400px; border: 1px solid var(--border); border-radius: 8px; position: relative;"></div>
                        <div class="glass-card" style="padding: 20px;">
                            <h4>Operations</h4>
                            <input type="text" id="node-input" placeholder="Enter value" style="width: 100%; margin-bottom: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 6px;">
                            <button class="btn btn-primary" onclick="insertNode()" style="width: 100%; margin-bottom: 8px;">Insert</button>
                            <button class="btn btn-secondary" onclick="searchNode()" style="width: 100%; margin-bottom: 8px;">Search</button>
                            <button class="btn btn-secondary" onclick="clearTree()" style="width: 100%; margin-bottom: 8px;">Clear</button>
                            <button class="btn btn-secondary" onclick="shareScreenshot('visualizer-container', '\${algoKey.toUpperCase()}')" style="width: 100%;"><i class="fas fa-camera"></i> Share</button>
                        </div>
                    </div>
                \`;
            } else {
                container.innerHTML = \`
                    <div style="height: 400px; border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--glass);">
                        <div style="text-align: center;">
                            <h3>\${algoKey.toUpperCase()} Visualizer</h3>
                            <p style="color: var(--text-muted); margin: 16px 0;">Interactive visualization coming soon</p>
                            <button class="btn btn-primary" onclick="startDemo()">Start Demo</button>
                            <button class="btn btn-secondary" onclick="shareScreenshot('visualizer-container', '\${algoKey.toUpperCase()}')"><i class="fas fa-camera"></i> Share</button>
                        </div>
                    </div>
                \`;
            }
            
            logStep(\`\${algoKey.toUpperCase()} visualizer initialized\`, 'info');
        }

        function initializeSortingArray() {
            window.sortArray = [64, 34, 25, 12, 22, 11, 90];
            drawSortingArray();
        }

        function drawSortingArray() {
            const container = document.getElementById('array-container');
            if (!container || !window.sortArray) return;
            
            container.innerHTML = '';
            const maxVal = Math.max(...window.sortArray);
            
            window.sortArray.forEach(val => {
                const bar = document.createElement('div');
                bar.style.cssText = \`
                    width: 40px;
                    height: \${(val / maxVal) * 250}px;
                    background: var(--primary);
                    display: flex;
                    align-items: end;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    border-radius: 4px 4px 0 0;
                \`;
                bar.textContent = val;
                container.appendChild(bar);
            });
        }

        // Generic algorithm functions
        function startAlgorithm() {
            logStep('Algorithm started', 'info');
        }

        function startSorting() {
            logStep('Sorting algorithm started', 'info');
        }

        function startDemo() {
            logStep('Demo mode activated', 'info');
        }

        function resetVisualization() {
            logStep('Visualization reset', 'info');
        }

        function resetArray() {
            if (window.sortArray) {
                window.sortArray = [64, 34, 25, 12, 22, 11, 90];
                drawSortingArray();
                logStep('Array reset', 'info');
            }
        }

        function generateArray() {
            if (window.sortArray) {
                window.sortArray = Array.from({length: 7}, () => Math.floor(Math.random() * 90) + 10);
                drawSortingArray();
                logStep('New array generated', 'info');
            }
        }

        function insertNode() {
            const input = document.getElementById('node-input');
            if (input && input.value) {
                logStep(\`Insert: \${input.value}\`, 'success');
                input.value = '';
            }
        }

        function searchNode() {
            const input = document.getElementById('node-input');
            if (input && input.value) {
                logStep(\`Search: \${input.value}\`, 'info');
            }
        }

        function clearTree() {
            logStep('Tree cleared', 'info');
        }
    </script>
</body>
</html>`;
    }
}

window.UniversalVisualizer = UniversalVisualizer;
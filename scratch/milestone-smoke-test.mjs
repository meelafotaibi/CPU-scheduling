import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';

const root = process.cwd();
const chromeCandidates = [
  path.join(process.env.ProgramFiles || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join(process.env['ProgramFiles(x86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  path.join(process.env.ProgramFiles || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
  path.join(process.env['ProgramFiles(x86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
];

const chromePath = chromeCandidates.find(existsSync);
if (!chromePath) {
  throw new Error('No Chrome/Edge executable found');
}

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.json', 'application/json; charset=utf-8'],
]);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root, rel);
    if (!file.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime.get(path.extname(file)) || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

const listen = (srv) => new Promise((resolve) => srv.listen(0, '127.0.0.1', () => resolve(srv.address().port)));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForChrome(port) {
  for (let i = 0; i < 80; i += 1) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return r.json();
    } catch {}
    await wait(100);
  }
  throw new Error('Chrome remote debugging did not start');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
      if (msg.method && this.handlers.has(msg.method)) {
        for (const handler of this.handlers.get(msg.method)) handler(msg);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  on(method, handler) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(handler);
  }
}

function simplifyRemote(value) {
  if (!value) return null;
  if ('value' in value) return value.value;
  if (value.description) return value.description;
  return null;
}

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || result.exceptionDetails.exception?.description || 'Evaluation failed');
  }
  return simplifyRemote(result.result);
}

async function testPage(cdp, baseUrl, pagePath, checks = []) {
  const errors = [];
  const warnings = [];
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });

  cdp.on('Runtime.exceptionThrown', (msg) => {
    if (msg.sessionId === sessionId) {
      errors.push(msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text || 'Runtime exception');
    }
  });
  cdp.on('Log.entryAdded', (msg) => {
    if (msg.sessionId === sessionId && msg.params.entry.level === 'error') {
      errors.push(msg.params.entry.text);
    }
  });
  cdp.on('Runtime.consoleAPICalled', (msg) => {
    if (msg.sessionId !== sessionId) return;
    const text = msg.params.args.map(simplifyRemote).join(' ');
    if (msg.params.type === 'error') errors.push(text);
    if (msg.params.type === 'warning') warnings.push(text);
  });

  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Log.enable', {}, sessionId);
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: 'window.alert = (msg) => console.warn("alert:" + msg); window.confirm = () => true;',
  }, sessionId);

  const loaded = new Promise((resolve) => {
    const timeout = setTimeout(resolve, 2500);
    cdp.on('Page.loadEventFired', (msg) => {
      if (msg.sessionId === sessionId) {
        clearTimeout(timeout);
        resolve();
      }
    });
  });
  await cdp.send('Page.navigate', { url: `${baseUrl}/${pagePath}` }, sessionId);
  await loaded;
  await wait(800);

  const results = [];
  for (const check of checks) {
    try {
      results.push(await check(cdp, sessionId));
      await wait(200);
    } catch (error) {
      errors.push(`${check.name || 'check'}: ${error.message}`);
    }
  }

  await cdp.send('Target.closeTarget', { targetId });
  return { pagePath, errors, warnings, results };
}

const click = (selector) => `
  (() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return { ok: false, selector: ${JSON.stringify(selector)}, reason: 'missing' };
    el.click();
    return { ok: true, selector: ${JSON.stringify(selector)} };
  })()
`;

const commonChecks = [
  async function ready(cdp, sessionId) {
    return evaluate(cdp, sessionId, '({ title: document.title, readyState: document.readyState })');
  },
  async function onclickHandlers(cdp, sessionId) {
    const missing = await evaluate(cdp, sessionId, `
      (() => {
        const ignored = new Set([
          'alert', 'confirm', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
          'parseInt', 'parseFloat', 'Number', 'String', 'Boolean', 'Array.from',
          'Math.floor', 'Math.random', 'event.stopPropagation', 'shareScreenshot'
        ]);
        const resolvePath = (name) => {
          let obj = window;
          for (const part of name.split('.')) {
            if (part === 'window') { obj = window; continue; }
            if (obj == null || !(part in obj)) return undefined;
            obj = obj[part];
          }
          return obj;
        };
        return Array.from(document.querySelectorAll('[onclick]')).flatMap((el) => {
          const code = el.getAttribute('onclick') || '';
          const names = [...code.matchAll(/\\b([A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)?)\\s*\\(/g)]
            .map((m) => m[1])
            .filter((name) => !ignored.has(name) && !name.startsWith('console.'));
          return names
            .filter((name) => typeof resolvePath(name) !== 'function')
            .map((name) => ({ name, code, text: el.textContent.trim().replace(/\\s+/g, ' ').slice(0, 80) }));
        });
      })()
    `);
    if (missing.length) throw new Error(`missing onclick handlers: ${JSON.stringify(missing)}`);
    return { onclickHandlers: 'ok' };
  },
  async function modeAndToggleClicks(cdp, sessionId) {
    return evaluate(cdp, sessionId, `
      (() => {
        const selectors = ['.mode-tab', '.mode-btn', '.class-btn', '#grid-toggle-btn', '#build-btn', '#dir-toggle'];
        const clicked = [];
        for (const selector of selectors) {
          for (const el of document.querySelectorAll(selector)) {
            if (el.closest('[style*="display: none"]')) continue;
            el.click();
            clicked.push(el.id || el.textContent.trim().replace(/\\s+/g, ' ').slice(0, 40) || selector);
          }
        }
        return { clicked };
      })()
    `);
  },
  async function visibleButtonSmoke(cdp, sessionId) {
    return evaluate(cdp, sessionId, `
      (async () => {
        const skipText = /share|challenge|activate|stop challenge|copy|support/i;
        const clicked = [];
        for (const el of Array.from(document.querySelectorAll('button'))) {
          const text = el.textContent.trim().replace(/\\s+/g, ' ');
          const onclick = el.getAttribute('onclick') || '';
          const visible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
          if (!visible || el.disabled || skipText.test(text) || /shareScreenshot/.test(onclick)) continue;
          el.click();
          clicked.push(el.id || text.slice(0, 50) || 'button');
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
        return { clicked };
      })()
    `);
  },
];

const pages = [
  {
    path: 'dsa.html',
    checks: [
      ...commonChecks,
      async function dsaListToggle(cdp, sessionId) {
        return evaluate(cdp, sessionId, `
          (() => {
            document.querySelector('#list-view-btn')?.click();
            const listOn = document.querySelector('#algo-grid')?.classList.contains('list-view');
            const listActive = document.querySelector('#list-view-btn')?.classList.contains('active');
            document.querySelector('#grid-view-btn')?.click();
            const gridOn = !document.querySelector('#algo-grid')?.classList.contains('list-view');
            const gridActive = document.querySelector('#grid-view-btn')?.classList.contains('active');
            return { listOn, listActive, gridOn, gridActive };
          })()
        `);
      },
    ],
  },
  {
    path: 'algorithms.html',
    checks: [
      ...commonChecks,
      async function algorithmsListToggle(cdp, sessionId) {
        return evaluate(cdp, sessionId, `
          (() => {
            document.querySelector('#list-view-btn')?.click();
            const listOn = document.querySelector('#algo-grid')?.classList.contains('list-view');
            const listActive = document.querySelector('#list-view-btn')?.classList.contains('active');
            const canvasCount = document.querySelectorAll('#brain-canvas').length;
            document.querySelector('#grid-view-btn')?.click();
            const gridOn = !document.querySelector('#algo-grid')?.classList.contains('list-view');
            const gridActive = document.querySelector('#grid-view-btn')?.classList.contains('active');
            return { listOn, listActive, gridOn, gridActive, canvasCount };
          })()
        `);
      },
    ],
  },
  { path: 'cg.html', checks: commonChecks },
  { path: 'os.html', checks: commonChecks },
  { path: 'ai.html', checks: commonChecks },
  {
    path: 'visualizers/dsa/linked-list.html',
    checks: [
      ...commonChecks,
      async function linkedListModes(cdp, sessionId) {
        return evaluate(cdp, sessionId, `
          (() => {
            const before = document.querySelector('#stat-length')?.textContent?.trim();
            setListMode('doubly');
            const doubly = {
              active: document.querySelector('#tab-doubly')?.classList.contains('active'),
              badge: document.querySelector('#list-badge')?.textContent?.trim(),
              length: document.querySelector('#stat-length')?.textContent?.trim(),
            };
            setListMode('circular');
            const circular = {
              active: document.querySelector('#tab-circular')?.classList.contains('active'),
              badge: document.querySelector('#list-badge')?.textContent?.trim(),
              length: document.querySelector('#stat-length')?.textContent?.trim(),
            };
            return { before, doubly, circular };
          })()
        `);
      },
    ],
  },
  { path: 'visualizers/dsa/stack-queue.html', checks: commonChecks },
  { path: 'visualizers/dsa/heap.html', checks: commonChecks },
  { path: 'visualizers/dsa/avl.html', checks: commonChecks },
  { path: 'visualizers/dsa/bst.html', checks: commonChecks },
  { path: 'visualizers/dsa/trie.html', checks: commonChecks },
  { path: 'visualizers/algorithms/searching.html', checks: commonChecks },
  { path: 'visualizers/algorithms/recursion.html', checks: commonChecks },
  { path: 'visualizers/algorithms/dijkstra.html', checks: commonChecks },
  { path: 'visualizers/algorithms/astar.html', checks: commonChecks },
  { path: 'visualizers/algorithms/bellman-ford.html', checks: commonChecks },
  { path: 'visualizers/algorithms/mst.html', checks: commonChecks },
  { path: 'visualizers/algorithms/topo.html', checks: commonChecks },
  { path: 'visualizers/algorithms/advanced-sorting.html', checks: commonChecks },
  { path: 'visualizers/algorithms/dp.html', checks: commonChecks },
  { path: 'visualizers/algorithms/cycle-detection.html', checks: commonChecks },
  { path: 'visualizers/algorithms/bfs.html', checks: commonChecks },
  { path: 'visualizers/algorithms/dfs.html', checks: commonChecks },
  { path: 'visualizers/algorithms/bubble.html', checks: commonChecks },
  { path: 'visualizers/algorithms/selection.html', checks: commonChecks },
  { path: 'visualizers/algorithms/insertion.html', checks: commonChecks },
  { path: 'visualizers/algorithms/quick.html', checks: commonChecks },
  { path: 'visualizers/algorithms/merge.html', checks: commonChecks },
  
  // Computer Graphics (CG) Modular Visualizers
  { path: 'visualizers/cg/dda-bresenham.html', checks: commonChecks },
  { path: 'visualizers/cg/midpoint-circle.html', checks: commonChecks },
  { path: 'visualizers/cg/polygon-fill.html', checks: commonChecks },
  { path: 'visualizers/cg/cohen-sutherland.html', checks: commonChecks },
  { path: 'visualizers/cg/sutherland-hodgman.html', checks: commonChecks },
  { path: 'visualizers/cg/transformations.html', checks: commonChecks },
  { path: 'visualizers/cg/bezier.html', checks: commonChecks },
  { path: 'visualizers/cg/camera-view.html', checks: commonChecks },
  { path: 'visualizers/cg/projections.html', checks: commonChecks },
  { path: 'visualizers/cg/z-buffer.html', checks: commonChecks },
  { path: 'visualizers/cg/shading-models.html', checks: commonChecks },
  { path: 'visualizers/cg/texture-mapping.html', checks: commonChecks },
  { path: 'visualizers/cg/glut.html', checks: commonChecks },
  { path: 'visualizers/cg/glut-mouse.html', checks: commonChecks },
  { path: 'visualizers/cg/glut-keyboard.html', checks: commonChecks },
  { path: 'visualizers/cg/glut-menu.html', checks: commonChecks },
];

const serverPort = await listen(server);
const debugPort = 9333 + Math.floor(Math.random() * 1000);
const userDataDir = mkdtempSync(path.join(tmpdir(), 'milestone-chrome-'));
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--disable-extensions',
  '--disable-background-networking',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${userDataDir}`,
  `--remote-debugging-port=${debugPort}`,
  'about:blank',
], { stdio: 'ignore' });

try {
  const version = await waitForChrome(debugPort);
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const cdp = new CDP(ws);
  const baseUrl = `http://127.0.0.1:${serverPort}`;
  const reports = [];
  for (const page of pages) {
    reports.push(await testPage(cdp, baseUrl, page.path, page.checks));
  }
  const failures = reports.filter((r) => r.errors.length);
  for (const report of reports) {
    console.log(`\n${report.errors.length ? 'FAIL' : 'PASS'} ${report.pagePath}`);
    for (const error of report.errors) console.log(`  error: ${error}`);
    for (const result of report.results) console.log(`  result: ${JSON.stringify(result)}`);
  }
  if (failures.length) process.exitCode = 1;
} finally {
  const closed = new Promise((resolve) => chrome.once('exit', resolve));
  chrome.kill();
  await Promise.race([closed, wait(2000)]);
  server.close();
  rmSync(userDataDir, { recursive: true, force: true });
}

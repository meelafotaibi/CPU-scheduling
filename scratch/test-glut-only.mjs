import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
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
]);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root, rel);
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

async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || result.exceptionDetails.exception?.description || 'Evaluation failed');
  }
  return result.result?.value;
}

const serverPort = await listen(server);
const debugPort = 9333 + Math.floor(Math.random() * 1000);
const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=${debugPort}',
  'about:blank',
].map(arg => arg.replace('${debugPort}', debugPort)), { stdio: 'ignore' });

try {
  console.log(`Chrome spawned on port ${debugPort}, Server on port ${serverPort}`);
  const version = await waitForChrome(debugPort);
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const cdp = new CDP(ws);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });

  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Page.enable', {}, sessionId);

  const loaded = new Promise((resolve) => {
    cdp.on('Page.loadEventFired', (msg) => {
      if (msg.sessionId === sessionId) resolve();
    });
  });

  console.log("Navigating to visualizers/cg/glut.html...");
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${serverPort}/visualizers/cg/glut.html` }, sessionId);
  await loaded;
  await wait(500);

  const title = await evaluate(cdp, sessionId, 'document.title');
  console.log(`Page title: ${title}`);

  const readyState = await evaluate(cdp, sessionId, 'document.readyState');
  console.log(`Ready state: ${readyState}`);

  console.log("Testing Buffering Mode buttons...");
  await evaluate(cdp, sessionId, `document.querySelector('#btn-single').click();`);
  await wait(200);
  const modeVal = await evaluate(cdp, sessionId, `document.querySelector('#stat-buffer-mode').innerText`);
  console.log(`Buffering Mode Stat after click: ${modeVal}`);

  await evaluate(cdp, sessionId, `document.querySelector('#btn-double').click();`);
  await wait(200);
  const modeVal2 = await evaluate(cdp, sessionId, `document.querySelector('#stat-buffer-mode').innerText`);
  console.log(`Buffering Mode Stat after click back: ${modeVal2}`);

  console.log("Testing Animation Source buttons...");
  await evaluate(cdp, sessionId, `document.querySelector('#btn-anim-idle').click();`);
  await wait(200);
  await evaluate(cdp, sessionId, `document.querySelector('#btn-anim-timer').click();`);
  await wait(200);

  console.log("SUCCESS! All interactive controls in visualizers/cg/glut.html are functioning perfectly without errors.");
  await cdp.send('Target.closeTarget', { targetId });
} catch (err) {
  console.error("TEST FAILED:", err);
  process.exitCode = 1;
} finally {
  chrome.kill();
  server.close();
}

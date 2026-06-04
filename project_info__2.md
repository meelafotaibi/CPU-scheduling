# AlgoVisual Hub — Codebase Overview

## Summary

This repository is a static, front-end educational website for visualizing algorithms and data structures. Despite the GitHub repo name `CPU-scheduling`, the actual product identity is **AlgoVisual Hub**: a multi-page learning platform focused on DSA, operating systems, AI/ML, and computer graphics.

The site’s core value is making abstract CS concepts visible through step-by-step animations, interactive controls, example code, and roadmap/status pages. It is currently much closer to an **educational lab / demo hub** than a SaaS product: there is no backend, authentication, user accounts, billing, or real subscription workflow.

---

## Architecture

### Primary pattern
The project is a **static multi-page site** with a shared design system and a client-side visualization framework layered on top. It uses:

- plain HTML pages for each section,
- shared CSS for visual design and responsiveness,
- JavaScript modules for algorithm content, render engines, progress tracking, and UI injection,
- no server-side application code.

### Major subsystems

1. **Marketing / navigation pages**
   - `index.html` is the landing page.
   - `algorithms.html`, `os.html`, `ai.html`, `cg.html` are category landing pages.
   - `roadmap.html`, `guide.html`, `support.html`, `privacy.html`, `terms.html`, `contact.html`, `coming-soon.html` are support and information pages.

2. **Visualization engine layer**
   - `assets/js/core/*-engine.js` files implement canvas-based rendering for different domains:
     - arrays,
     - graphs,
     - heaps,
     - memory,
     - disk scheduling,
     - recursion trees,
     - DSA node diagrams,
     - ML scatter plots.
   - These engines are specialized for the teaching visuals, not generic rendering.

3. **Content and metadata layer**
   - `assets/js/core/algo-content.js` contains foundational algorithm descriptions, complexity data, and code samples.
   - `assets/js/core/complete-algo-content.js` extends that content to cover more algorithms across graphs, sorting, trees, search, OS, AI.

4. **UI composition / platform shell**
   - `assets/js/core/ui-extras.js` injects common layout blocks, support buttons, progress widgets, code tabs, logging UI, and screenshot/share helpers.
   - `assets/js/core/universal-visualizer.js` can generate standardized HTML for visualizer pages.

5. **Progress / gamification layer**
   - `assets/js/core/features.js` stores progress in `localStorage`, updates category counts, exposes sharing, and unlocks achievements.
   - This is client-side only; nothing is synced to a server.

### Technology stack

- **Language**: HTML, CSS, JavaScript
- **Runtime**: browser-only
- **Libraries / external services**
  - Google Analytics / gtag
  - Google Fonts
  - Font Awesome
  - `html2canvas` loaded dynamically for screenshot export
  - Firebase config files exist, but the visible codebase does not show a real app backend layer

### How execution starts

There is no single app entry point like in a SPA. Instead, each page loads its own scripts:

- `index.html` loads `assets/js/loader.js`, `assets/js/main.js`, and `assets/js/brain-animation.js`
- category pages often load `assets/js/core/ui-extras.js`
- visualizer pages are expected to load page-specific engines plus the shared content/UI layers

The runtime behavior is mostly:
1. HTML loads.
2. Shared CSS renders the theme.
3. JS injects navigation features, progress widgets, and visualizer layouts.
4. Canvas engines draw the algorithm state.
5. Optional localStorage progress and achievement logic updates UI state.

---

## Directory Structure

```text
project-root/
├── index.html                 — Landing page and category overview
├── algorithms.html            — DSA algorithm catalog
├── os.html                    — Operating systems catalog
├── ai.html                    — AI / ML catalog
├── cg.html                    — Computer graphics catalog
├── roadmap.html               — Feature and release roadmap
├── guide.html                 — Usage guide
├── support.html               — Help / FAQ / contact page
├── contact.html               — Older contact page variant
├── coming-soon.html           — Placeholder / teaser page
├── privacy.html               — Privacy policy
├── terms.html                 — Terms of use
├── assets/
│   ├── css/
│   │   ├── main.css           — Main design system and layout styles
│   │   └── responsive.css     — Mobile layout overrides
│   ├── img/
│   │   ├── logo.png
│   │   └── logo1.png
│   └── js/
│       ├── main.js            — Global UI behavior / navigation / animations
│       ├── loader.js          — Loading-screen behavior
│       ├── brain-animation.js — Decorative canvas background
│       ├── algorithm-code.js  — Example code snippets
│       ├── inject_*.js        — Build-time HTML injectors
│       └── core/
│           ├── algo-content.js           — Base algorithm content store
│           ├── complete-algo-content.js  — Extended algorithm content store
│           ├── ui-extras.js              — Standard layout + support button + share tools
│           ├── universal-visualizer.js    — HTML generator for visualizer pages
│           ├── features.js               — Progress, achievements, sharing
│           ├── dsa-engine.js             — Linked list / tree / stack-style canvas engine
│           ├── graph-engine.js            — Graph visualizer engine
│           ├── array-engine.js            — Sorting array engine
│           ├── heap-engine.js             — Heap visualizer engine
│           ├── disk-engine.js             — Disk scheduling visualizer engine
│           ├── memory-engine.js          — Memory allocation engine
│           ├── recursion-engine.js        — Recursion tree engine
│           ├── ml-engine.js               — ML scatter / clustering engine
│           ├── ComplexityTracker.js       — Step / operation / complexity counters
│           └── playback.js                — Play / pause / step controller
├── guide/                    — Additional guide pages
│   ├── bfs.html
│   ├── dfs.html
│   └── dijkstra.html
├── guides/                   — More topic-specific guides
│   └── cpu-scheduling.html
└── visualizers/              — Individual visualizer pages
    ├── bfs.html
    ├── dfs.html
    ├── dijkstra.html
    ├── bubble-sort.html
    ├── cpu-scheduling.html
    ├── memory-allocation.html
    ├── page-replacement.html
    ├── minimax.html
    ├── kmeans.html
    └── many more
```

---

## Key Abstractions

### `AlgoContentSystem`
- **File**: `assets/js/core/algo-content.js`
- **Responsibility**: Stores algorithm metadata: title, definition, usage, complexity, pros/cons, and sample code.
- **Interface**:
  - `initializeContent()` populates the base map.
  - `getContent(algoKey)` returns the content object for a given algorithm key.
  - `getAllAlgorithms()` returns all known keys.
- **Lifecycle**: Instantiated in browser memory; used whenever a visualizer page needs text/code content.
- **Used by**: `UIExtrasSystem`, `UniversalVisualizer`, and anything that renders algorithm detail panels.

### `CompleteAlgoContentSystem`
- **File**: `assets/js/core/complete-algo-content.js`
- **Responsibility**: Extends the base content registry with more algorithms across graphs, sorting, trees, search, OS, and AI.
- **Interface**:
  - `addAllAlgorithms()`
  - category-specific `add*Algorithms()` methods
- **Lifecycle**: Replaces the base `AlgoContentSystem` globally by assigning `window.AlgoContentSystem = CompleteAlgoContentSystem`.
- **Used by**: Any page that loads `complete-algo-content.js` before `ui-extras.js`.

### `UIExtrasSystem`
- **File**: `assets/js/core/ui-extras.js`
- **Responsibility**: Injects the standard visualizer page shell and global UI features.
- **Interface**:
  - `injectGlobalFeatures()` adds support buttons, loads `features.js` if absent, and inserts a global progress indicator.
  - `injectStandardLayout()` rewrites the current page into a consistent algorithm detail layout.
  - `injectInfoCard()`, `injectComplexityCard()`, `injectCodeCard()` render content sections.
  - `enhanceLiveLog()` sets up the execution log helpers.
- **Lifecycle**: Auto-instantiated on DOM ready.
- **Used by**: Category/visualizer pages to standardize layout and provide the support button.

### `ProgressSystem`
- **File**: `assets/js/core/features.js`
- **Responsibility**: Tracks completed algorithms in `localStorage` and updates category progress in the UI.
- **Interface**:
  - `getProgress()`
  - `saveProgress(progress)`
  - `complete(category, algoName)`
  - `isCompleted(category, algoName)`
  - `updateDOMProgress()`
- **Lifecycle**: Persistent across sessions through browser storage.
- **Used by**: Category cards and any progress-aware view.

### `GamificationSystem`
- **File**: `assets/js/core/features.js`
- **Responsibility**: Unlocks achievements, stores challenge scores, and displays achievement banners.
- **Interface**:
  - `getAchievements()`
  - `unlock(id, title, desc, icon)`
  - `saveScore(algoName, challengeType, score, optimalScore)`
  - `checkProgressAchievements()`
- **Lifecycle**: Pure client-side, localStorage backed.
- **Used by**: Progress workflows and the sorting challenge game.

### `SharingSystem`
- **File**: `assets/js/core/features.js`
- **Responsibility**: Serializes app state into URL parameters and copies share links.
- **Interface**:
  - `serialize(params)`
  - `deserialize()`
  - `copyLink(params, btnElement)`
- **Used by**: Share/link UI actions.

### `SortingChallengeGame`
- **File**: `assets/js/core/features.js`
- **Responsibility**: A game-like sorting mode where the user swaps array elements manually.
- **Interface**:
  - `start()`
  - `stop()`
  - `calculateOptimalSwaps()`
  - `handleBarClick(idx)`
- **Used by**: Sorting visualizers to add a “challenge” mode and measure performance.

### `UniversalVisualizer`
- **File**: `assets/js/core/universal-visualizer.js`
- **Responsibility**: Generates a full HTML document for a visualizer page from an algorithm key and title.
- **Interface**:
  - `generateHTML(algoKey, title, additionalScripts = [])`
- **Lifecycle**: Build-time helper, not a runtime application object.
- **Used by**: Visualizer scaffolding / generation workflows.

### `DSAEngine`
- **File**: `assets/js/core/dsa-engine.js`
- **Responsibility**: Canvas renderer for node-based structures like lists, stacks, queues, and trees.
- **Interface**:
  - `drawNode()`
  - `drawArrow()`
  - `draw()`
  - `drawGrid()`
- **Used by**: DSA visualizers.

### `GraphEngine`
- **File**: `assets/js/core/graph-engine.js`
- **Responsibility**: Graph rendering and editing, including nodes, edges, hit-testing, and neighbor lookup.
- **Interface**:
  - `setEditMode()`
  - `getNodeAt()`
  - `addEdge()`
  - `setGraph()`
  - `updateNodeStatus()`
  - `scrambleNodes()`
- **Used by**: BFS, DFS, Dijkstra, A*, Bellman-Ford, MST, topo visualizers.

### `ArrayEngine`
- **File**: `assets/js/core/array-engine.js`
- **Responsibility**: Sorting-array canvas renderer with highlighting and swapping.
- **Interface**:
  - `setArray()`
  - `highlight(indices, status)`
  - `clearHighlights()`
  - `swap(i, j)`
  - `draw()`
- **Used by**: Bubble, selection, insertion, quick, merge, heap visualizers and challenge mode.

### `HeapEngine`
- **File**: `assets/js/core/heap-engine.js`
- **Responsibility**: Draws heap as both a tree and an array.
- **Interface**:
  - `setHeap(arr)`
  - `highlight(indices, status)`
  - `clearHighlights()`
  - `drawTree()`
  - `drawArray()`
- **Used by**: Heap sort and heap structure demos.

### `MemoryEngine`
- **File**: `assets/js/core/memory-engine.js`
- **Responsibility**: Visualizes memory blocks and allocation decisions.
- **Interface**:
  - `setBlocks(blocks)`
  - `allocate(blockIdx, processId, processSize)`
  - `reset()`
  - `draw()`
- **Used by**: First-fit / best-fit / worst-fit style memory pages.

### `DiskEngine`
- **File**: `assets/js/core/disk-engine.js`
- **Responsibility**: Draws disk request traces and head movement.
- **Interface**:
  - `setData(requests, initialHead, path, maxSteps)`
  - `draw()`
  - `drawGrid()`
  - `drawPath()`
  - `highlightHead(cylinder)`
- **Used by**: Disk scheduling pages.

### `RecursionEngine`
- **File**: `assets/js/core/recursion-engine.js`
- **Responsibility**: Renders recursion trees and node status.
- **Interface**:
  - `reset()`
  - `addNode(label, value, parentId)`
  - `updateNodeStatus(id, status)`
  - `updateLayout()`
  - `draw()`
- **Used by**: recursion visualization pages.

### `MLEngine`
- **File**: `assets/js/core/ml-engine.js`
- **Responsibility**: Draws scatter plots and interaction points for ML algorithms.
- **Interface**:
  - `initInteractions()`
  - `onCanvasClick(x, y)`
  - `addPoint(x, y, color)`
  - `clear()`
  - `draw()`
  - `getDistance(p1, p2)`
- **Used by**: K-Means, KNN, regression, perceptron demos.

### `Playback`
- **File**: `assets/js/core/playback.js`
- **Responsibility**: Controls simulation timing and step navigation.
- **Interface**:
  - `setSpeed(val)`
  - `play()`
  - `pause()`
  - `reset()`
  - `step()`
- **Used by**: algorithm playback UIs.

### `ComplexityTracker`
- **File**: `assets/js/core/ComplexityTracker.js`
- **Responsibility**: Tracks operations, recursion depth, and displayed complexity info.
- **Interface**:
  - `reset()`
  - `increment()`
  - `setRecursion()`
  - `setComplexity()`
  - `render()`
  - `updateUI()`
- **Used by**: visualizers that want a live complexity counter.

---

## Data Flow

### 1) Landing page and category navigation
1. `index.html` loads the main styles and shared scripts.
2. It renders five category cards: DSA, Sorting & Searching, Operating Systems, AI/ML, and Computer Graphics.
3. Each card links to a category page such as `algorithms.html` or `os.html`.
4. The page uses `brain-animation.js` for the decorative background and `loader.js` for the splash/loading state.

### 2) Category page browsing
1. A category page like `os.html` or `ai.html` presents a grid of topic cards.
2. Each card links to a dedicated visualizer page in `visualizers/`.
3. Some pages also link to a guide page before the tool itself, which makes the platform feel educational rather than just interactive.
4. Grid/list toggles on some pages change how the catalog is displayed, but do not alter the algorithm logic.

### 3) Visualizer bootstrapping
1. A visualizer page loads the shared CSS plus `ui-extras.js`.
2. `UIExtrasSystem` checks the page’s `data-algo` attribute and, if present, replaces the page body with a standardized algorithm detail layout.
3. It injects:
   - definition and usage,
   - complexity panel,
   - code tabs,
   - live log,
   - navigation buttons.
4. `AlgoContentSystem` supplies the content objects used in those panels.

### 4) Simulation and rendering
1. The page-specific engine creates or resizes a canvas and prepares data structures.
2. Buttons like Play / Reset / Step call into the engine or into `Playback`.
3. The engine redraws bars, nodes, graphs, memory blocks, or tree structures based on current state.
4. Logs are appended through the global `logStep()` helper created by `UIExtrasSystem`.

### 5) Progress and achievement flow
1. When a task is marked complete, `ProgressSystem.complete(category, algoName)` updates `localStorage`.
2. It recalculates the visible counts in the category cards.
3. `GamificationSystem.checkProgressAchievements()` may unlock milestones.
4. The UI shows a toast or achievement banner.

### 6) Sharing and screenshot flow
1. Share actions call `SharingSystem.serialize()` or `window.shareScreenshot()`.
2. `shareScreenshot()` lazy-loads `html2canvas`.
3. The target element is captured, watermarked, and downloaded as a PNG.

---

## Non-Obvious Behaviors & Design Decisions

### Hidden invariants
- Many pages assume a global `#brain-canvas` exists for the decorative animation.
- Several JS systems depend on optional DOM elements; they are written to fail softly if a page does not include the expected structure.
- `UIExtrasSystem` expects a `data-algo` attribute on the `<html>` element when it should auto-build an algorithm detail page.
- Progress counts are hardcoded around category totals:
  - DSA = 6
  - Sorting = 4
  - OS = 5
  - AI = 5
  - CG = 6

### Why some things are unusual
- `main.js` is named like a general app controller, but its class is `CPUSchedulerUI`. It is really a generic UI enhancer with some old naming baggage.
- `ui-extras.js` dynamically loads `features.js` if it is missing. That makes pages more tolerant of different load orders.
- `UniversalVisualizer` generates page HTML instead of using a routing framework. This is a build-time convenience for a static site.
- The platform uses a “luxury” visual style — glassmorphism, glow, gradients, animation — to make educational content feel premium, but that increases CSS complexity and can make debugging harder.

### State management
- Most meaningful state lives in browser memory or `localStorage`.
- There is no server-backed session state.
- Mutable runtime state includes:
  - array contents,
  - graph nodes/edges,
  - memory block assignments,
  - progress and achievements,
  - playback state,
  - current theme.
- Because state is browser-only, different devices do not share progress.

### Error propagation
- The code generally does not have a central error handling layer.
- Failures are typically caught locally and either logged to console or ignored.
- In `features.js`, storage access is wrapped in `try/catch` in some places, but not consistently everywhere.
- A missing DOM element usually results in no-op behavior rather than a hard crash, which helps static pages survive partial loading.

### Performance-sensitive paths
- The app is mostly static, so basic page load is fast.
- The expensive parts are mostly visual:
  - canvas redraws,
  - hover effects,
  - `backdrop-filter`,
  - shadows and glow effects,
  - Google Fonts and Font Awesome.
- `main.js` uses throttled scroll handlers and `IntersectionObserver`, which is a good sign for performance.
- However, the design still leans heavily on GPU-heavy visual effects, so slower mobile devices may feel less smooth.

### External dependencies and quirks
- `html2canvas` is loaded only when screenshot sharing is requested.
- Google Analytics is embedded on several pages.
- Font Awesome is loaded on some pages but not all.
- Some pages use `data-theme="dark"` and others use `data-theme="light"`, which can create inconsistent appearance if the shared CSS expects one default.
- Several CSS custom properties referenced in `main.css` are not visibly defined in the file excerpt, such as `--gradient-primary`, `--shadow-xl`, `--gradient-border`, and `--bg`. That suggests either missing definitions elsewhere or CSS drift.

---

## Feature Inventory

### Already present
- Landing page with strong product positioning
- Category landing pages for:
  - DSA
  - algorithms/sorting/searching
  - operating systems
  - AI/ML
  - computer graphics
- Roadmap page with live/in-development/planned status labels
- Support page with email contact and FAQ
- Guide page with usage instructions
- Privacy and terms pages
- Canvas-based visualizers
- Playback controls
- Custom input support in several tools
- Local progress tracking
- Achievements
- Screenshot sharing
- Search/graph/array/tree/ML engines
- Responsive CSS layer
- SEO metadata and structured data on major pages

### Not present
- User accounts
- Real payments
- Subscriptions / billing
- PayTabs integration
- Paid support tiers
- Admin dashboard
- Server-side persistence
- Multi-user collaboration
- Personal learning dashboard
- API/backend services

---

## Support Page / PayTabs / Pricing Questions

### Is there a support page?
Yes. `support.html` exists and is linked in the footer and in the injected support button on many pages.

### Is there a PayTabs placeholder or payment flow?
No PayTabs integration or placeholder was found in the examined files. I did not find:
- `PayTabs`
- `paytabs`
- SAR pricing blocks
- support tiers like 5 / 10 / 30 SAR
- custom contribution checkout logic

### Is support shown in the header?
Yes, but indirectly. `assets/js/core/ui-extras.js` injects a **Support** button into the navigation bar on pages that load that script. It is not hardcoded in every page, and it does not appear to be present on `support.html` itself because that page does not load `ui-extras.js`.

### What the support page actually does
- Shows a support center header.
- Lists a contact email: `devmeelo4@gmail.com`.
- Gives a short FAQ.
- Links to guide, privacy, and terms.
- It is informational, not transactional.

### Does it support paid custom tiers?
No evidence of that exists in the current codebase. If you were expecting a SaaS-style contribution page with `5 SAR`, `10 SAR`, `30 SAR`, or “customize” pricing, that feature is not implemented in the repository currently.

---

## Responsiveness, Speed, and “Is it working well?”

### Responsiveness
**Mostly yes, but not perfectly.**

Good signs:
- `responsive.css` has explicit mobile breakpoints.
- Navigation collapses / wraps on small screens.
- Grids collapse to one column.
- Visualizer layouts are adjusted for mobile.
- Media queries reduce spacing and button sizes.

Weaknesses:
- Some pages rely on large fixed paddings and heavy inline styles.
- There are duplicate patterns and mixed theme defaults.
- `main.css` also contains its own responsive rules, so behavior is split across two files.
- `contact.html` is not aligned with the rest of the site’s design system and lacks the shared main stylesheet.

### Speed
**Probably reasonably fast for a static site, but visually heavy.**

Fast:
- static HTML delivery,
- no backend round trips for most pages,
- localStorage-based progress,
- lazy loading of `html2canvas`.

Potentially slower:
- multiple external font/analytics/CDN requests,
- large CSS file with many animations and effects,
- canvas layers on every page,
- constant glow/backdrop blur/shadow styling.

### Is it “working well”?
**Conceptually yes, production-polish-wise not fully.**

What works well:
- The project has a coherent educational purpose.
- The roadmap and content structure are strong.
- The site shows a clear “what it does” story.
- The visual style is consistent across the main pages.

What looks fragile:
- Some pages use inconsistent theme defaults.
- The shared JS/CSS architecture is somewhat duplicated.
- `contact.html` appears to be an older or mismatched page.
- There are signs of CSS variable drift.
- The app lacks server-side validation and persistent state.

---

## What is the point of this project?

The point is to make computer science algorithms easier to learn by turning them into interactive, visual experiences. It is especially aimed at:
- CS students preparing for exams,
- people learning algorithms for interviews,
- instructors who want visual examples,
- self-learners who need intuition, not just code.

It is basically an **interactive educational library** for core CS topics.

---

## Does it need “luxury features” to become a SaaS?

If the goal is to evolve from an educational lab into a real SaaS product, yes — but the missing pieces are mostly **product infrastructure**, not more visual polish.

### Minimum SaaS features needed
- Authentication / login
- User profiles
- Cloud-synced progress
- Saved playlists or learning paths
- Billing / subscriptions
- Trial vs premium access
- Admin content management
- Usage analytics
- Email support workflows
- Error monitoring / crash reporting
- Search, tagging, and filtering across content
- Localization / multilingual support
- Mobile-first onboarding
- Accessibility improvements

### Higher-value SaaS upgrades
- Personalized dashboards
- Certificate / achievement export
- Instructor classroom mode
- Embedded quizzes
- Team / school plans
- Saved custom datasets
- Replayable shared links
- Collaborative study rooms
- Topic recommendation engine

### “Luxury” features that would help brand perception
- polished onboarding
- animated empty states
- shareable achievement cards
- premium roadmap transparency
- AI-assisted explanations
- dark/light theme controls across all pages
- PWA/offline support
- performance telemetry

### What matters more than luxury
Right now, the biggest gap is not animation quality — it is **productization**:
- no account system,
- no paid tiers,
- no backend,
- no real support workflow,
- no content governance.

So: the project is already a strong **educational frontend**, but it is not yet a SaaS in the business sense.

---

## Module Reference

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with category navigation and platform pitch |
| `algorithms.html` | DSA catalog page with sorting/searching/graph cards |
| `os.html` | Operating systems catalog page |
| `ai.html` | AI / machine learning catalog page |
| `cg.html` | Computer graphics catalog page |
| `roadmap.html` | Detailed roadmap with live / in-dev / planned labels |
| `guide.html` | User guide for working with visualizers |
| `support.html` | Support / FAQ / contact page |
| `contact.html` | Legacy contact page variant |
| `coming-soon.html` | Placeholder page for upcoming features |
| `assets/css/main.css` | Core visual identity, layout, cards, nav, buttons, animations |
| `assets/css/responsive.css` | Mobile and narrow-screen layout overrides |
| `assets/js/main.js` | Global UI behavior, scroll effects, ripple effects, theme handling |
| `assets/js/core/features.js` | Local progress, achievements, sharing, challenge game |
| `assets/js/core/ui-extras.js` | Injected visualizer shell, support button, code/log UI, screenshot tools |
| `assets/js/core/universal-visualizer.js` | HTML generator for algorithm pages |
| `assets/js/core/algo-content.js` | Base algorithm definitions and code samples |
| `assets/js/core/complete-algo-content.js` | Extended content registry for more algorithms |
| `assets/js/core/dsa-engine.js` | Canvas engine for lists, stacks, queues, trees |
| `assets/js/core/graph-engine.js` | Canvas engine for graph visualizations |
| `assets/js/core/array-engine.js` | Canvas engine for sorting arrays |
| `assets/js/core/heap-engine.js` | Canvas engine for heaps |
| `assets/js/core/memory-engine.js` | Memory block allocation visualizer |
| `assets/js/core/disk-engine.js` | Disk scheduling visualizer |
| `assets/js/core/recursion-engine.js` | Recursion tree visualizer |
| `assets/js/core/ml-engine.js` | ML/cluster scatter plot visualizer |
| `assets/js/core/playback.js` | Play/pause/step controls |
| `assets/js/core/ComplexityTracker.js` | Complexity and operation counter UI |
| `assets/js/algorithm-code.js` | Multilingual sample code snippets |
| `inject_responsive.js` | Build helper that inserts responsive stylesheet links into HTML files |
| `inject_favicon.js` | Build helper that injects favicon links into HTML files |
| `inject_multiplex_ads.js` | Ads helper, currently disabled |
| `generate_sitemap.js` | Sitemap generation helper |

---

## Suggested Reading Order

1. `index.html` — to understand the product story and navigation model
2. `assets/css/main.css` — to understand the design system and responsive behavior
3. `assets/js/core/features.js` — to understand progress, sharing, and gamification
4. `assets/js/core/ui-extras.js` — to understand how visualizer pages are assembled
5. `assets/js/core/algo-content.js` + `assets/js/core/complete-algo-content.js` — to see the algorithm content model
6. `roadmap.html` — to understand current scope vs planned scope

---

## Bottom Line

This is a polished, static educational platform for algorithm learning, not a full SaaS. It has a strong visual identity, a clear educational purpose, and a decent client-side architecture for demos and interactive teaching.

What it does **well**:
- teaches algorithms visually,
- provides category structure,
- includes progress and achievements,
- supports responsive layouts reasonably well.

What it **does not** yet do:
- payments,
- subscriptions,
- server-side accounts,
- real support monetization,
- SaaS-grade product infrastructure.

If your goal is to turn it into a true SaaS, the next step is not more visual decoration — it is adding identity, persistence, billing, and backend-powered product features.
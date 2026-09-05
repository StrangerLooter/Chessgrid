# AGENTS.md — Persistent AI Agent Guidelines & Architecture Manual

## 1. Project Overview & Purpose
**ChessGrid** is an enterprise-grade collegiate chess tournament management platform and 3D cinematic arena presentation suite. It provides arbiters, tournament directors, and collegiate spectators with:
- A luxury 3D cinematic landing page powered by Three.js, React Three Fiber, Drei, and GSAP scroll choreography.
- A comprehensive Tournament Command Center dashboard for real-time bracket visualization, swiss/knockout pairing, player roster management, live chess clocks with arbiter controls, match result logging with snapshot-based undo history, and collegiate report generation.
- Fullscreen Projector / Public Display mode for venue streaming and stage displays.

---

## 2. Tech Stack & Core Dependencies
- **Framework**: React 19 (`react`, `react-dom`) + TypeScript 6
- **Build System & Dev Server**: Vite 8 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`, `postcss`, `autoprefixer`) + Custom Vanilla CSS Variables & Design Tokens (`src/index.css`)
- **3D Graphics**: Three.js (`three`, `@types/three`), `@react-three/fiber`, `@react-three/drei`
- **Animation & Choreography**: GSAP 3 (`gsap`), Canvas Confetti (`canvas-confetti`)
- **Icons**: Lucide React (`lucide-react`)
- **Linter**: Oxlint (`oxlint`)

---

## 3. Directory Map
```
Chessgrid/
├── .antigravityignore          # Indexer & agent context optimization rules
├── AGENTS.md                   # This instruction manual and persistent memory
├── README.md                   # Repository introduction
├── index.html                  # HTML entry point with luxury Google Fonts
├── package.json                # Project dependencies and script definitions
├── vite.config.ts              # Vite + Tailwind plugin config
├── tsconfig.json               # Root TypeScript project references
├── tsconfig.app.json           # Application TypeScript compiler settings
├── tsconfig.node.json          # Node/tooling TypeScript compiler settings
├── .oxlintrc.json              # Oxlint lint configuration
├── public/                     # Static icons and assets (favicon.svg, icons.svg)
├── docs/
│   └── PROJECT_CONTEXT.md      # Concise technical architecture & component registry
└── src/
    ├── main.tsx                # React DOM root mounting
    ├── App.tsx                 # Root router / view-mode orchestrator (Loading, Cinematic, Command)
    ├── App.css                 # Supplemental App CSS
    ├── index.css               # Core design tokens, dark obsidian theme, typography, & scrollbars
    ├── assets/                 # Local images & SVG assets
    ├── types/
    │   └── tournament.ts       # Central TypeScript interfaces, enums, and data models
    ├── context/
    │   ├── TournamentContext.tsx # Central state machine, localStorage persistence & actions
    │   └── ScrollContext.tsx     # GSAP scroll waypoint interpolation for 3D camera
    ├── utils/
    │   ├── bracketEngine.ts    # Deterministic bracket tree generation, advancement & seed logic
    │   ├── exportUtils.ts      # Printable tournament report & export generator
    │   ├── formatters.ts       # Clocks, round labels, time, and result badge formatters
    │   └── soundEffects.ts     # Synthesized web audio effects (tick, buzzer, victory chime)
    ├── data/
    │   └── demoData.ts         # Pre-seeded collegiate tournament data for instant testing
    └── components/
        ├── cinematic/          # 3D R3F scenes, GSAP scroll orchestrator & 3D pieces
        ├── dashboard/          # Command Center dashboard overview & metric widgets
        ├── bracket/            # Interactive knockout bracket tree & match node components
        ├── players/            # Player roster tables, registration, bulk import & profile modals
        ├── matches/            # Match list, details modal, result entry modal & undo modal
        ├── live/               # Live digital chess timers & arbiter board management
        ├── eliminated/         # Hall of Honor & 3-tier golden podium view
        ├── history/            # Match logs, action history, and export report modal
        ├── projector/          # Clean full-screen public projector broadcast view
        ├── settings/           # Tournament rules editor, configuration & state backup/restore
        ├── layout/             # Command Center Navbar, Sidebar, and Footer
        └── common/             # Toast notification container, confirmation dialog & champion modal
```

---

## 4. Key Architectural Decisions & Data Flow
1. **View Modes Orchestration (`src/App.tsx`)**:
   - `loading`: Displays cinematic asset loader and transitions on completion.
   - `cinematic`: Renders `CinematicShell` with scroll-driven Three.js scenes.
   - `command`: Renders the full `MainApp` Command Center navigation shell.
   - `isProjectorMode`: Overrides view to render fullscreen `PublicDisplayMode`.

2. **State Management & Persistence (`src/context/TournamentContext.tsx`)**:
   - Single source of truth for `players`, `matches`, `boards`, `settings`, `announcements`, and `historyLogs`.
   - Persisted automatically to `localStorage` under `'chessgrid_state'`.
   - Deep immutability pattern with snapshot captures in `historyLogs` to power the full "Undo Result" rollback mechanism.

3. **Deterministic Bracket Progression (`src/utils/bracketEngine.ts`)**:
   - Generates binary knockout brackets for powers of 2 (2, 4, 8, 16, 32, 64, 128).
   - Auto-routes winners to the designated slot (`whiteFromMatchId` / `blackFromMatchId`) in downstream round matches.

4. **Design System & Aesthetics (`src/index.css`)**:
   - Palette: Dark Obsidian (`--cg-obsidian: #0a0a0b`), Glass Surfaces (`#111114`, `#18181d`), Metallic Gold (`#c9a84c`, `#e8c45a`), Luminous Ivory (`#f5f0e8`), Emerald Accents (`#22a67a`).
   - Fonts: Cormorant Garamond (`--font-cinematic`), Bebas Neue (`--font-stat`), Space Grotesk (`--font-sans`), JetBrains Mono (`--font-mono`).

---

## 5. Standard Development Commands
- `npm run dev`: Launch Vite HMR development server (default: `http://localhost:5173`).
- `npm run build`: Execute TypeScript type-check (`tsc -b`) and Vite production bundle.
- `npm run lint`: Execute Oxlint fast static analysis.
- `npm run preview`: Serve production build for local smoke testing.

---

## 6. AI Agent Operating Rules

### Context Efficiency
- **Do not scan the entire repository for ordinary tasks**: Determine which specific feature area is affected before loading files.
- **First identify the smallest set of relevant files**: e.g., if a tournament clock issue occurs, inspect `src/components/live/ChessTimer.tsx` and `src/context/TournamentContext.tsx`.
- **Prefer targeted search over opening large numbers of files**: Use ripgrep / exact symbol queries rather than bulk reading directories.
- **Do not read generated files or dependencies**: Never read `dist/`, `node_modules/`, `package-lock.json`, or minified bundles unless explicitly required.
- **Do not repeatedly reread unchanged files**: Cache and reuse file knowledge gathered earlier in the conversation.
- **Prefer reading relevant functions/components rather than entire unrelated files**: Use slice notation or targeted line views.

### Code Changes
- **Make the smallest change necessary**: Keep diffs tight and focused.
- **Reuse existing components and utilities**: Use helpers from `src/utils/formatters.ts`, `src/utils/bracketEngine.ts`, and components in `src/components/common/`.
- **Do not create duplicate functionality**: Check existing modals and context methods before writing new abstractions.
- **Do not refactor unrelated code**: Preserve existing working logic, comments, and structure.
- **Do not rewrite entire files when a targeted edit is sufficient**: Use `replace_file_content` for surgical modifications.
- **Preserve existing architecture and conventions**: Maintain strict TypeScript interfaces (`src/types/tournament.ts`) and CSS custom property tokens.

### Debugging
- **Reproduce/inspect the relevant error first**: Check TypeScript compiler diagnostics (`tsc -b`) and linter feedback before guessing.
- **Investigate only files related to the error**: Narrow search directly to the component or context hook throwing the warning/error.
- **Avoid repeatedly trying random fixes**: Formulate a hypothesis based on code analysis before editing.
- **If the same issue remains after reasonable attempts, stop and explain the cause**: Do not enter an endless fix loop.

### Protected Files (Do Not Modify Without Explicit Request)
- `package.json` / `package-lock.json`
- `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`
- Core Three.js shader / geometry setup in `src/components/cinematic/` unless fixing a 3D visual bug.

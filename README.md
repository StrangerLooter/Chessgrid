# ♛ ChessGrid

> **Enterprise-Grade Collegiate Chess Tournament Management Platform, Live Arena & 3D Cinematic Suite**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Stockfish](https://img.shields.io/badge/Stockfish-16%20WASM-d97706?logo=chess.com&logoColor=white)](https://stockfishchess.org/)
[![Deployment](https://img.shields.io/badge/Deployment-chessgrid--nine.vercel.app-10b981?logo=vercel&logoColor=white)](https://chessgrid-nine.vercel.app/)

**Live Production App**: [https://chessgrid-nine.vercel.app/](https://chessgrid-nine.vercel.app/)  
**GitHub Repository**: [https://github.com/StrangerLooter/Chessgrid](https://github.com/StrangerLooter/Chessgrid)

---

## 📌 Table of Contents
1. [Overview & Purpose](#-overview--purpose)
2. [Key Capabilities & Modules](#-key-capabilities--modules)
   - [3D Cinematic Landing Arena](#1-3d-cinematic-landing-arena)
   - [Tournament Command Center](#2-tournament-command-center)
   - [In-Game Chess Arena (`/play`)](#3-in-game-chess-arena-play)
   - [Voice Control System](#4-voice-control-system)
   - [Live Digital Clocks & Arbiter Desk](#5-live-digital-clocks--arbiter-desk)
   - [Venue Projector Broadcast Mode](#6-venue-projector-broadcast-mode)
3. [Arbiter & Tournament Director Operating Guide](#-arbiter--tournament-director-operating-guide)
4. [Player & Practice Hub Guide](#-player--practice-hub-guide)
5. [Voice Command Syntax Reference](#-voice-command-syntax-reference)
6. [System Architecture & Data Flow](#-system-architecture--data-flow)
7. [Repository Map](#-repository-map)
8. [Local Development & Setup](#-local-development--setup)
9. [Automated Testing & Verification](#-automated-testing--verification)
10. [Deployment to Vercel](#-deployment-to-vercel)
11. [License](#-license)

---

## 🌟 Overview & Purpose

**ChessGrid** is an all-in-one tournament operations system and interactive chess arena designed specifically for collegiate athletic departments, university chess clubs, and collegiate championship directors. 

Traditional tournament operations rely on disjointed spreadsheets, physical pairing sheets, standalone chess clocks, and disconnected presentation screens. **ChessGrid unites the entire tournament lifecycle into a single, cohesive, zero-latency digital suite**:

- **FIDE-Compliant Knockout Engine**: Deterministic binary bracket generation (powers of 2: 2, 4, 8, 16, 32, 64, 128) with automatic winner propagation and manual pairing overrides.
- **Fail-Safe Arbiter Controls**: Snapshot-based immutability allowing arbiters to undo and repair mis-recorded results without corrupting downstream match progressions.
- **Stage & Auditorium Broadcast**: High-contrast, full-screen projector view for arena streaming and stage displays.
- **Authentic Match Play with Voice Control**: Full Stockfish 16 WASM chess engine integration with voice recognition (English + NATO phonetic), move history review, and exportable PGN/FEN records.
- **3D Cinematic Presentation**: Three.js and React Three Fiber landing experience designed to wow spectators, alumni, and sponsors.

---

## 💎 Key Capabilities & Modules

### 1. 3D Cinematic Landing Arena
- **Scroll-Driven Choreography**: Integrated GSAP timeline interpolating 3D camera waypoints as the user navigates the landing page.
- **Three.js & React Three Fiber Canvas**: Procedural golden chess pieces, atmospheric particle floating systems, and dark obsidian lighting.
- **Modern Foreground Hierarchy**: Clean collegiate typography (Cinzel, Cormorant Garamond, Space Grotesk, JetBrains Mono), direct CTAs, and a floating glass dock navigation.
- **Comprehensive Feature Walkthrough**: Built-in interactive sections detailing platform features, the 6-step arbiter workflow, and core product modules.

### 2. Tournament Command Center
- **Tournament Action Center**: Interactive operational dashboard with step-by-step guidance for tournament setup, contender enrollment, bracket launching, and live match monitoring.
- **Real Operational KPIs**: Real-time stats calculated dynamically from state: Contenders enrolled (`registered / required`), active live combat boards, tournament stage progress, and idle board capacity.
- **Contender Roster Management**: Player profile management, seed assignments, collegiate department tags, win/loss records, and bulk CSV contender import.
- **Deterministic Knockout Bracket Tree**: Interactive visual bracket with live status badges, player seeds, winner highlights, and direct match detail inspection.
- **Snapshot Undo History**: Every result entry captures a complete state snapshot, enabling one-click rollbacks if an arbiter enters an incorrect score or winner.

### 3. In-Game Chess Arena (`/play`)
- **Luxury Walnut & Maple Board**: Warm maple light squares (`#d8ac72`) and deep walnut dark squares (`#744626`) set within a beveled wooden chassis with inset rank (`1–8`) and file (`a–h`) coordinate notations.
- **Tournament Header Navigation**: Displays active tournament name (`Electrophysisiesta 2026`), department, match ID (`#QF-02`), board number (`Board 04`), time control (`10+0`), and live status pill.
- **Player Cards & Glowing Capsule Clocks**: Dual player profiles with FIDE ratings, federation flags, and high-contrast emerald green digital capsule timers (`09:42`).
- **4-Tab Right Control Console**:
  1. **`Moves`**: Scrollable PGN notation sheet (`# | White | Black`) with active move golden pill highlight, move step navigation (`|<`, `<`, `>`, `>|`, `Flip Board`), match actions (`Offer Draw`, `Resign`, `More`), turn indicator with dynamic opening recognition (`Sicilian Defense`, `Ruy Lopez`, `Queen's Gambit`), and 2x3 tournament metadata card.
  2. **`Game Info`**: Position FEN (with 1-click copy), full PGN notation (copy & `.pgn` download), and match parameters.
  3. **`Captured`**: Captured material breakdown for White and Black with piece icons and net point advantage calculations.
  4. **`Analysis`**: Stockfish 16 evaluation bar, numeric advantage score (`+0.25`), and launcher for deep engine analysis.

### 4. Voice Control System
- **Hands-Free Move Input**: Speak chess moves naturally (e.g. *"Knight to f3"*, *"Pawn to e4"*, *"e2 to e4"*).
- **NATO Phonetic Support**: Full support for noisy tournament halls using NATO alphabet (e.g. *"echo two to echo four"*, *"foxtrot three"*).
- **Disambiguation & Candidate Preview**: If multiple pieces can move to a target square, candidate moves are highlighted and confirmed visually before execution.
- **Special Action Commands**: Resign, offer draw, take back, flip board, confirm, or cancel using voice commands.

### 5. Live Digital Clocks & Arbiter Desk
- **Independent Board Timers**: Dedicated multi-board clocks supporting Bullet (`1+0`, `2+1`), Blitz (`3+0`, `3+2`, `5+0`, `5+3`), Rapid (`10+0`, `10+5`, `15+10`), and Classical (`30+0`).
- **Time Pressure Sound Effects**: Synthesized Web Audio API sound alerts for move completion, low-time ticks, and flag-fall buzzers.
- **Arbiter Time Adjustments**: Emergency time adjustments (+/- seconds) directly from the board management panel.

### 6. Venue Projector Broadcast Mode
- **Zero-Distraction Auditorium Streaming**: Fullscreen high-contrast display designed for 1080p and 4K venue projection systems.
- **Live Match Rotator**: Displays current round pairings, active digital timers, board numbers, and recent match winners with grand golden typography.

---

## 📋 Arbiter & Tournament Director Operating Guide

Follow this standard operating procedure when hosting an event on ChessGrid:

### Step 1: Initialize Tournament Settings
1. Navigate to the **Command Center** (`/command`) or click **Create Tournament** on the landing page.
2. Enter the **Tournament Name** (e.g., *National Collegiate Chess Championship 2026*).
3. Enter the **Host College / University** and **Department**.
4. Select the **Tournament Size**: Choose a binary power of 2: **4, 8, 16, 32, 64, or 128 players**.
5. Select the default **Time Control** (e.g., `10+5 Rapid`).
6. Click **Initialize Tournament**.

### Step 2: Contender Roster Enrollment
1. Open the **Players** tab in the sidebar.
2. **Manual Registration**: Click **Register Contender** to input Player Name, Rating/Seed, Roll Number, Department, and Contact Info.
3. **Bulk CSV Import**: Click **Bulk Import** to paste or upload CSV player data.
4. Continue until the required contender count is met. The **Action Center** will automatically switch status to `READY TO LAUNCH`.

### Step 3: Seeding & Bracket Generation
1. Go to the **Bracket** tab or **Action Center**.
2. Click **Generate Pairings & Launch Round 1**.
   - *Seeded Mode*: Automatically pairs top seeds against lower seeds (e.g., Seed 1 vs Seed 16).
   - *Manual / Shuffle Mode*: Use **Manual Pairing** to review or swap contenders prior to locking Round 1.
3. Once confirmed, Round 1 matches are instantly dispatched to available boards.

### Step 4: Active Board Operations & Clocks
1. Navigate to **Live Matches** or **Board Management**.
2. Assign matches to physical tables/boards (e.g., *Board 01*, *Board 02*).
3. Start clocks when both combatants sit at the board.
4. If an arbiter penalty or clock adjustment is required, click **Adjust Clock** to add or deduct minutes.

### Step 5: Recording Match Results
1. When a match ends, click **Log Result** on the active match card.
2. Select the result outcome:
   - `White Win (1 - 0)`
   - `Black Win (0 - 1)`
   - `Draw / Tie-Break` (supports Armageddon, Blitz playoff, or Sonneborn-Berger)
   - `Forfeit / Disqualification`
3. Click **Confirm Result**.
4. The bracket engine will **automatically advance the winner** to the correct downstream slot in the subsequent round.

### Step 6: Handling Mistakes (Snapshot Undo)
1. If a result was entered mistakenly (e.g., wrong winner clicked), open **Audit History** or click **Undo Result** on the match.
2. Select the target match and confirm rollback.
3. The platform restores the complete state snapshot, allowing the correct result to be logged without disrupting the rest of the bracket.

### Step 7: Final Stage & Report Export
1. When the Grand Final concludes, open the **Hall of Honor** to view the dynamic 3-tier golden podium (1st, 2nd, and 3rd place).
2. Open **Export Report** to generate print-ready official standings, pairing sheets, and match summaries.

---

## ♟️ Player & Practice Hub Guide

To play or practice chess inside ChessGrid:

1. Click **Play Chess** in the top navigation or visit `/play`.
2. Choose your game mode:
   - **Vs Computer**: Test your skills against Stockfish 16 WASM across 5 difficulty levels (Beginner, Easy, Medium, Hard, Expert).
   - **2-Player Local**: Play on the same device with synchronized digital capsule clocks.
   - **Analysis View**: Paste a PGN or analyze your completed game with evaluation gauges and engine recommendations.
   - **History**: Revisit and analyze previous games logged in your local browser session.
3. **Move History Navigation**:
   - Step backward and forward through moves using `|<`, `<`, `>`, `>|`.
   - Click any move notation (e.g. `14. exd5`) to inspect the historical board position.
   - Click **Return to Live** or make a move to resume playing.
4. **PGN & FEN Tools**: Open the **Game Info** tab to copy the current position FEN or export/download the PGN file.

---

## 🎙️ Voice Command Syntax Reference

ChessGrid includes a client-side voice recognition engine powered by the Web Speech API and an AST move resolver.

### Move Commands
| Voice Command | Standard Move | Description |
| :--- | :--- | :--- |
| `"Pawn to e4"` or `"e4"` | `e4` | Simple pawn move |
| `"Knight to f3"` or `"Horse to f3"` | `Nf3` | Piece move to destination |
| `"Bishop takes c6"` or `"Takes on c6"` | `Bxc6` / `xc6` | Capture command |
| `"Knight from b to d2"` | `Nbd2` | Explicit file disambiguation |
| `"Castle kingside"` or `"Short castle"` | `O-O` | Kingside castling |
| `"Castle queenside"` or `"Long castle"` | `O-O-O` | Queenside castling |
| `"Pawn to e8 Queen"` | `e8=Q` | Promotion to Queen |
| `"Echo two to echo four"` | `e4` | NATO phonetic coordinate move |
| `"Alpha two to alpha four"` | `a4` | NATO phonetic coordinate move |

### Operational Commands
| Voice Command | Action |
| :--- | :--- |
| `"Confirm"` or `"Yes"` | Confirm candidate move or resign dialog |
| `"Cancel"` or `"No"` | Abort move candidate preview |
| `"Undo move"` or `"Take back"` | Roll back the previous move |
| `"Flip board"` | Rotate board orientation 180 degrees |
| `"Resign game"` | Triggers voice resignation prompt |

---

## 🏗️ System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                               App.tsx                                   |
|       (Central Router: Loading -> Cinematic -> Command -> Play)         |
+-------------------+--------------------+--------------------+-----------+
                    |                    |                    |
                    v                    v                    v
      +-----------------------------+  +-------------------------------+
      |   TournamentContext.tsx     |  |       ScrollContext.tsx       |
      | - players: Player[]         |  | - GSAP 3D Camera Waypoints    |
      | - matches: Match[]          |  | - Hero -> Pairing -> Podium   |
      | - boards: Board[]           |  +-------------------------------+
      | - settings: Tournament      |
      | - historyLogs: Snapshot[]   |
      | - localStorage Auto-Sync    |
      +--------------+--------------+
                     |
         +-----------+-----------+---------------------+
         |                       |                     |
         v                       v                     v
+-------------------+   +------------------+   +----------------------+
|  bracketEngine.ts |   | useChessGame.ts  |   |    useChessVoice.ts  |
| - Deterministic   |   | - chess.js State |   | - Web Speech API     |
|   Binary Knockout |   | - Stockfish WASM |   | - NATO Parser        |
| - Auto Progression|   | - Clocks & PGN   |   | - Disambiguation AST |
| - Slot Routing    |   +------------------+   +----------------------+
+-------------------+            |
                                 v
                        +------------------+
                        |  ChessBoard.tsx  |
                        | - Walnut/Maple   |
                        | - Coord Chassis  |
                        | - Gold Highlight |
                        +------------------+
```

---

## 📂 Repository Map

```
ChessGrid/
├── public/                     # Static icons, engine WASM & audio assets
│   ├── engine/                 # Stockfish 16 WASM & worker binaries
│   ├── favicon.svg             # Application brand favicon
│   └── icons.svg               # SVG symbol spritesheet
├── docs/                       # Architectural documentation
│   └── PROJECT_CONTEXT.md      # Component registry & architectural rules
├── scripts/                    # CLI test and verification utilities
│   └── test-voice-system.ts    # 44-case voice parser & AST test suite
└── src/
    ├── App.tsx                 # Root router & view-mode orchestrator
    ├── main.tsx                # React DOM 19 entry point
    ├── index.css               # Design system tokens, obsidian theme, fonts
    ├── types/
    │   └── tournament.ts       # Central TypeScript interfaces & enums
    ├── context/
    │   ├── TournamentContext.tsx # Central tournament state machine & persistence
    │   └── ScrollContext.tsx   # GSAP 3D waypoint interpolation
    ├── utils/
    │   ├── bracketEngine.ts    # Deterministic bracket tree generation & routing
    │   ├── exportUtils.ts      # Printable HTML/PDF report generator
    │   ├── formatters.ts       # Clocks, round labels & result formatters
    │   └── soundEffects.ts     # Web Audio API synthesized audio alerts
    ├── services/
    │   └── chessEngine.ts      # Stockfish 16 WebWorker service & difficulty levels
    ├── hooks/
    │   ├── useChessGame.ts     # Complete chess state, clocks & notation engine
    │   └── useChessVoice.ts    # Speech recognition, NATO parser & move AST
    ├── data/
    │   └── demoData.ts         # Pre-seeded collegiate tournament data
    └── components/
        ├── cinematic/          # 3D Three.js scenes, GSAP hero & landing sections
        │   ├── HeroTypography.tsx      # Clean hero foreground & CTAs
        │   ├── FloatingNav.tsx         # Modern glass navigation dock
        │   └── LandingContentSections.tsx # Features, Workflow & Module directory
        ├── dashboard/          # Command Center KPI overview & Action Center
        ├── bracket/            # Interactive knockout bracket tree & match nodes
        ├── players/            # Player tables, registration modal & CSV import
        ├── matches/            # Match list, details, result entry & undo modals
        ├── live/               # Digital chess timers & multi-board management
        ├── eliminated/         # Hall of Honor & dynamic 3-tier golden podium
        ├── history/            # Audit logs & export report modal
        ├── projector/          # Fullscreen venue stage broadcast display
        ├── settings/           # Tournament rules, config & backup/restore
        ├── layout/             # Top Navbar, Sidebar & Footer
        ├── common/             # Toast container, confirmation & modal shells
        └── chess/              # Play Chess hub, wooden board & analysis suite
            ├── ChessBoard.tsx          # Walnut/maple board with beveled coordinates
            ├── PlayChessPage.tsx       # Tournament in-game arena with capsule clocks
            ├── VoiceControl.tsx        # Voice status, push-to-talk & transcript
            └── AnalysisView.tsx        # Deep Stockfish analysis suite
```

---

## 💻 Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) version **20.x** or higher
- `npm` or `yarn`

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/StrangerLooter/Chessgrid.git

# 2. Enter directory
cd Chessgrid

# 3. Install dependencies
npm install

# 4. Start local Vite development server
npm run dev
```

The application will be accessible at: `http://localhost:5173/`

### Available NPM Scripts
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite HMR development server |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and produces production bundle |
| `npm run lint` | Executes fast static analysis via Oxlint |
| `npm run preview` | Locally serves the production build for testing |
| `npx -y tsx scripts/test-voice-system.ts` | Runs the 44-case voice recognition and move AST test suite |

---

## 🧪 Automated Testing & Verification

ChessGrid maintains strict quality standards with zero tolerance for build errors or lint violations:

```bash
# 1. Type Check and Production Build
npm run build
# Expected output: ✓ built in ~3.3s with 0 errors

# 2. Fast Static Analysis Linter
npx oxlint
# Expected output: Found 0 errors

# 3. Voice Control Engine Verification
npx -y tsx scripts/test-voice-system.ts
# Expected output: 44/44 tests passed (0 failures)
```

---

## 🚀 Deployment to Vercel

The application is pre-configured for instant zero-configuration deployment on Vercel:

1. Fork or push your code to GitHub (`StrangerLooter/Chessgrid`).
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `Chessgrid` repository.
4. Set the following build configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## 📄 License

This software is developed for collegiate chess championships and sports tournament management.  
Licensed under the [MIT License](LICENSE) (or organizational private collegiate license).  
Powered by [Stockfish](https://stockfishchess.org/) (GNU GPLv3).

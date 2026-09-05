# ♛ ChessGrid

> **Enterprise-grade Collegiate Chess Tournament Platform & 3D Immersive Arena**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Features

- **3D Cinematic Arena**: Full-bleed WebGL landing world built with React Three Fiber, Drei, and GSAP scroll choreography.
- **Tournament Command Center**: Single-elimination binary knockout bracket tree generator with auto-routing, seeding, and manual pairing.
- **Live Digital Chess Clocks**: Integrated chess timers (Bullet, Blitz, Rapid, Classical) with low-time warnings and arbiter overrides.
- **Snapshot Undo Architecture**: Deep immutable state history enabling arbiters to safely roll back mis-recorded match results.
- **Hall of Honor & Dynamic Podium**: 3-tier golden podium and round-by-round departure cards for tournament combatants.
- **Stage Projector Broadcast Mode**: High-contrast, fullscreen broadcast mode optimized for auditorium projectors and venue stream monitors.
- **Collegiate Report Generation**: Instant print-ready HTML/PDF tournament standing and bracket export.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20+)
- `npm` or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/StrangerLooter/ChessGrid.git

# Navigate into project directory
cd ChessGrid

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Development Scripts
```bash
npm run dev      # Start local Vite development server
npm run build    # Run TypeScript compilation and build production bundle
npm run lint     # Execute Oxlint static analysis
npm run preview  # Locally preview production build
```

---

## 🏛️ Architecture & Tech Stack

```
ChessGrid/
├── public/                 # Static icons & vectors (favicon.svg, icons.svg)
├── docs/                   # Technical architecture & project context
└── src/
    ├── components/
    │   ├── cinematic/      # 3D R3F scenes, procedural pieces & scroll waypoints
    │   ├── dashboard/      # Command Center metric overview & active match widgets
    │   ├── bracket/        # Interactive knockout bracket tree & match nodes
    │   ├── players/        # Roster tables, profile modal & bulk CSV import
    │   ├── matches/        # Match list, details, result entry & undo modals
    │   ├── live/           # Digital chess clocks & arbiter board manager
    │   ├── eliminated/     # Hall of Honor & 3-tier golden podium
    │   ├── history/        # Audit logs & print report modal
    │   ├── projector/      # Venue stage projector display
    │   └── settings/       # Tournament rules, configs & backup/restore
    ├── context/            # TournamentContext state machine & ScrollContext
    ├── utils/              # bracketEngine, soundEffects, formatters, themeTokens
    └── types/              # Central TypeScript tournament data models
```

---

## 🌐 Deploy to Vercel

The easiest way to deploy ChessGrid is via [Vercel](https://vercel.com/):

1. Push your code to GitHub: `StrangerLooter/ChessGrid`.
2. Import the repository in the [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

---

## 📄 License
This project is private and developed for collegiate chess championships.

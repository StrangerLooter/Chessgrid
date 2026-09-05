/**
 * ChessGrid Unified Design System Tokens
 * Bridges 2D CSS design tokens and 3D Three.js / R3F materials, lighting & shaders.
 */

export const CHESS_THEME_COLORS = {
  // Core Obsidian Canvas
  obsidian: '#0a0a0b',
  charcoal: '#111114',
  surface: '#18181d',
  surfaceRaised: '#1e1e26',
  surfaceHighlight: '#262632',

  // Metallic Gold Accents
  gold: '#c9a84c',
  goldBright: '#e8c45a',
  goldDim: '#8a7035',
  goldGlow: 'rgba(201, 168, 76, 0.45)',

  // Luminous Ivory & White
  ivory: '#f5f0e8',
  ivoryDim: '#c8c0ae',
  ivoryMuted: '#9e9687',

  // Status & Tactical Tones
  emerald: '#1a7a5e',
  emeraldBright: '#22a67a',
  emeraldGlow: 'rgba(34, 166, 122, 0.45)',

  electric: '#1e4fff',
  electricDim: '#0f2899',
  electricGlow: 'rgba(30, 79, 255, 0.45)',

  red: '#8b1a1a',
  redBright: '#c0392b',
  redGlow: 'rgba(192, 57, 43, 0.45)',

  // Smoked Glass & Overlays
  glassBg: 'rgba(10, 10, 11, 0.78)',
  glassBorder: 'rgba(201, 168, 76, 0.14)',
  glassBorderHover: 'rgba(201, 168, 76, 0.38)',
  glassCard: 'rgba(24, 24, 29, 0.85)',
} as const;

export const THREE_MATERIAL_PRESETS = {
  // Gold King & Champion Pieces
  goldMetal: {
    color: '#c9a84c',
    metalness: 0.92,
    roughness: 0.18,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
  },
  // Ivory White Pieces
  ivoryBone: {
    color: '#f5f0e8',
    metalness: 0.08,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  },
  // Dark Obsidian Pieces
  obsidianSlate: {
    color: '#0e0e12',
    metalness: 0.86,
    roughness: 0.22,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  },
  // Dark Board Squares
  boardDark: {
    color: '#121216',
    metalness: 0.5,
    roughness: 0.4,
  },
  // Light Board Squares
  boardLight: {
    color: '#dfd8ca',
    metalness: 0.2,
    roughness: 0.35,
  },
  // Board Gold Border Trim
  boardBorder: {
    color: '#2a2416',
    metalness: 0.8,
    roughness: 0.25,
  },
  // Glowing Active Nodes / Pins
  activeNode: {
    color: '#22a67a',
    emissive: '#1a7a5e',
    emissiveIntensity: 0.6,
    metalness: 0.4,
    roughness: 0.2,
  },
  // Smoked Glass Panels in 3D
  smokedGlass: {
    color: '#18181d',
    transmission: 0.75,
    opacity: 0.85,
    transparent: true,
    roughness: 0.12,
    ior: 1.45,
  },
} as const;

export const THREE_LIGHTING_RIG = {
  ambient: {
    color: '#1a1815',
    intensity: 0.9,
  },
  keyLight: {
    color: '#fff8ee',
    intensity: 2.4,
    position: [8, 14, 10] as [number, number, number],
  },
  goldFill: {
    color: '#c9a84c',
    intensity: 1.5,
    position: [-8, -4, -6] as [number, number, number],
  },
  rimLight: {
    color: '#2563eb',
    intensity: 1.2,
    position: [0, 10, -12] as [number, number, number],
  },
  emeraldTactical: {
    color: '#22a67a',
    intensity: 0.9,
    position: [6, 4, -4] as [number, number, number],
  },
  fog: {
    color: '#0a0a0b',
    density: 0.015,
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  cinematic: "'Cormorant Garamond', Georgia, serif",
  sans: "'Space Grotesk', system-ui, -apple-system, sans-serif",
  stat: "'Bebas Neue', Impact, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
} as const;

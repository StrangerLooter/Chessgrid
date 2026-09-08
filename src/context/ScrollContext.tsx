import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ScrollState {
  /** 0–1 representing total scroll progress through the cinematic journey */
  progress: number;
  /** Current named waypoint */
  waypoint: CinematicWaypoint;
  /** 0–1 progress within the current waypoint's range */
  waypointProgress: number;
}

export type CinematicWaypoint =
  | 'hero'
  | 'tournament'
  | 'players'
  | 'pairing'
  | 'bracket'
  | 'match'
  | 'projector'
  | 'analysis'
  | 'final'
  | 'champion';

/** Scroll % ranges for active waypoints (0–100) */
export const WAYPOINT_RANGES: Partial<Record<CinematicWaypoint, [number, number]>> = {
  hero:       [0,   20],
  players:    [20,  40],
  pairing:    [40,  60],
  bracket:    [60,  80],
  projector:  [80,  92],
  champion:   [92, 100],
};

function getWaypoint(pct: number): CinematicWaypoint {
  for (const [key, range] of Object.entries(WAYPOINT_RANGES) as [CinematicWaypoint, [number, number]][]) {
    if (range && pct >= range[0] && pct <= range[1]) return key;
  }
  return 'hero';
}

function getWaypointProgress(pct: number, waypoint: CinematicWaypoint): number {
  const range = WAYPOINT_RANGES[waypoint];
  if (!range) return 0;
  const [start, end] = range;
  const diff = end - start;
  if (diff === 0) return 0;
  return Math.max(0, Math.min(1, (pct - start) / diff));
}

interface ScrollContextType extends ScrollState {
  setProgress: (pct: number) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  progress: 0,
  waypoint: 'hero',
  waypointProgress: 0,
  setProgress: () => {},
});

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    waypoint: 'hero',
    waypointProgress: 0,
  });
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const setProgress = useCallback((pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const current = stateRef.current;
    const waypoint = getWaypoint(clamped);
    const waypointProgress = getWaypointProgress(clamped, waypoint);
    
    // Only trigger React state updates when waypoint changes or progress changes by at least 0.35%
    // This stops thousands of cascading component re-renders per second during fast scrolls
    if (
      waypoint !== current.waypoint ||
      Math.abs(clamped - current.progress) >= 0.35 ||
      clamped === 0 ||
      clamped === 100
    ) {
      setState({ progress: clamped, waypoint, waypointProgress });
    }
  }, []);

  const value = React.useMemo(() => ({ ...state, setProgress }), [state, setProgress]);

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);

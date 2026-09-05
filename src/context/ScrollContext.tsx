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
  | 'final'
  | 'champion';

/** Scroll % ranges for each waypoint (0–100) */
export const WAYPOINT_RANGES: Record<CinematicWaypoint, [number, number]> = {
  hero:       [0,   15],
  tournament: [15,  30],
  players:    [30,  45],
  pairing:    [45,  60],
  bracket:    [60,  72],
  match:      [72,  83],
  final:      [83,  93],
  champion:   [93, 100],
};

function getWaypoint(pct: number): CinematicWaypoint {
  for (const [key, [start, end]] of Object.entries(WAYPOINT_RANGES) as [CinematicWaypoint, [number, number]][]) {
    if (pct >= start && pct <= end) return key;
  }
  return 'hero';
}

function getWaypointProgress(pct: number, waypoint: CinematicWaypoint): number {
  const [start, end] = WAYPOINT_RANGES[waypoint];
  const range = end - start;
  if (range === 0) return 0;
  return Math.max(0, Math.min(1, (pct - start) / range));
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

  const setProgress = useCallback((pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const waypoint = getWaypoint(clamped);
    const waypointProgress = getWaypointProgress(clamped, waypoint);
    setState({ progress: clamped, waypoint, waypointProgress });
  }, []);

  return (
    <ScrollContext.Provider value={{ ...state, setProgress }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);

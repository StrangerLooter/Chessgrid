import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { 
  TournamentSettings, 
  Player, 
  Match, 
  Board, 
  Announcement, 
  HistoryLog, 
  NavTab, 
  ResultType, 
  TieBreakInfo,
  TournamentSize
} from '../types/tournament';
import { DEMO_SETTINGS, DEMO_PLAYERS, DEMO_MATCHES, DEMO_BOARDS, DEMO_ANNOUNCEMENTS } from '../data/demoData';
import { 
  generateInitialMatches, 
  generateRandomPairings, 
  generateSeededPairings, 
  applyMatchResult, 
  repairBracketAfterResultChange 
} from '../utils/bracketEngine';
import { soundEffects } from '../utils/soundEffects';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface TournamentContextType {
  // State
  settings: TournamentSettings;
  players: Player[];
  matches: Match[];
  boards: Board[];
  announcements: Announcement[];
  historyLogs: HistoryLog[];
  activeTab: NavTab;
  isDark: boolean;
  isMuted: boolean;
  isProjectorMode: boolean;
  toasts: ToastMessage[];

  // Navigation & UI controls
  setActiveTab: (tab: NavTab) => void;
  toggleTheme: () => void;
  toggleMute: () => void;
  setIsProjectorMode: (active: boolean) => void;
  addToast: (type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Tournament Management Actions
  updateSettings: (newSettings: Partial<TournamentSettings>) => void;
  startNewTournament: (settings: Partial<TournamentSettings>, initialPlayers?: Player[]) => void;
  clearAllPlayers: () => void;
  loadDemoTournament: () => void;
  resetTournament: () => void;

  // Player Management
  addPlayer: (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'wins' | 'losses' | 'draws' | 'currentRound' | 'score' | 'status'>) => boolean;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  bulkAddPlayers: (newPlayers: Array<Omit<Player, 'id' | 'matchesPlayed' | 'wins' | 'losses' | 'draws' | 'currentRound' | 'score' | 'status'>>) => void;

  // Pairing & Bracket
  shuffleAndPairPlayers: (seeded?: boolean) => { white: Player | null; black: Player | null }[];
  confirmPairings: (pairings: { white: Player | null; black: Player | null }[]) => void;
  manualSwapPlayers: (playerAId: string, playerBId: string) => void;

  // Match & Clocks
  startMatch: (matchId: string, boardNumber?: number) => void;
  pauseMatch: (matchId: string) => void;
  resumeMatch: (matchId: string) => void;
  switchActiveClock: (matchId: string) => void;
  resetMatchClock: (matchId: string) => void;
  adjustPlayerClock: (matchId: string, player: 'white' | 'black', deltaSeconds: number) => void;
  recordResult: (matchId: string, resultType: ResultType, details?: string, tieBreakInfo?: TieBreakInfo) => void;
  undoOrRepairResult: (matchId: string, newResultType: ResultType, newTieBreakInfo?: TieBreakInfo) => void;
  undoLastAction: () => void;

  // Board Management
  assignMatchToBoard: (boardNumber: number, matchId: string) => void;
  freeBoard: (boardNumber: number) => void;
  updateBoardCount: (count: number) => void;

  // Announcements
  addAnnouncement: (title: string, content: string, priority?: 'normal' | 'high' | 'urgent', isPinned?: boolean) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Calculated stats & helpers
  stats: {
    totalRegistered: number;
    totalRequired: TournamentSize;
    isReadyToStart: boolean;
    liveMatchesCount: number;
    upcomingMatchesCount: number;
    completedMatchesCount: number;
    eliminatedCount: number;
    progressPercent: number;
    currentRoundName: string;
    championPlayer: Player | null;
    runnerUpPlayer: Player | null;
  };
}

const STORAGE_KEY_SETTINGS = 'chess_tm_settings_v1';
const STORAGE_KEY_PLAYERS = 'chess_tm_players_v1';
const STORAGE_KEY_MATCHES = 'chess_tm_matches_v1';
const STORAGE_KEY_BOARDS = 'chess_tm_boards_v1';
const STORAGE_KEY_ANNOUNCEMENTS = 'chess_tm_announcements_v1';
const STORAGE_KEY_HISTORY = 'chess_tm_history_v1';
const STORAGE_KEY_THEME = 'chess_tm_dark_v1';
const STORAGE_KEY_MUTE = 'chess_tm_mute_v1';

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or Fallback to DEMO
  const [settings, setSettings] = useState<TournamentSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return saved ? JSON.parse(saved) : DEMO_SETTINGS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    return saved ? JSON.parse(saved) : DEMO_PLAYERS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MATCHES);
    return saved ? JSON.parse(saved) : DEMO_MATCHES;
  });

  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOARDS);
    return saved ? JSON.parse(saved) : DEMO_BOARDS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : DEMO_ANNOUNCEMENTS;
  });

  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MUTE);
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyLogs));
  }, [historyLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MUTE, JSON.stringify(isMuted));
    soundEffects.setMuted(isMuted);
  }, [isMuted]);

  // Toast Notification helper
  const addToast = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Timer Tick Engine: Runs countdown every 100ms for active live matches
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setMatches(prevMatches => {
        let hasChanges = false;
        const updated = prevMatches.map(m => {
          if (m.status === 'live' && m.isTimerRunning && m.activeClock) {
            hasChanges = true;
            let whiteTime = m.whiteTimeRemainingMs;
            let blackTime = m.blackTimeRemainingMs;

            if (m.activeClock === 'white') {
              whiteTime = Math.max(0, whiteTime - delta);
              if (whiteTime === 0 && m.whiteTimeRemainingMs > 0) {
                soundEffects.playTimeoutBuzzer();
                addToast('warning', 'Flag Fall!', `White (${players.find(p => p.id === m.whitePlayerId)?.name || 'White'}) has run out of time!`);
              }
            } else {
              blackTime = Math.max(0, blackTime - delta);
              if (blackTime === 0 && m.blackTimeRemainingMs > 0) {
                soundEffects.playTimeoutBuzzer();
                addToast('warning', 'Flag Fall!', `Black (${players.find(p => p.id === m.blackPlayerId)?.name || 'Black'}) has run out of time!`);
              }
            }

            return {
              ...m,
              whiteTimeRemainingMs: whiteTime,
              blackTimeRemainingMs: blackTime,
              isTimerRunning: (m.activeClock === 'white' ? whiteTime : blackTime) > 0,
            };
          }
          return m;
        });

        return hasChanges ? updated : prevMatches;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [addToast, players]);

  // Tournament Setup actions
  const updateSettings = useCallback((newSettings: Partial<TournamentSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('info', 'Settings Updated', 'Tournament parameters have been saved.');
  }, [addToast]);

  const startNewTournament = useCallback((customSettings: Partial<TournamentSettings>, initialPlayers?: Player[]) => {
    const totalPlayers = customSettings.totalPlayers || 16;
    const initialSettings: TournamentSettings = {
      id: `tourn-${Date.now()}`,
      name: customSettings.name || 'IEHE Department Chess Championship 2026',
      collegeName: customSettings.collegeName || 'Institute for Excellence in Higher Education (IEHE)',
      departmentName: customSettings.departmentName || 'Department of Physics',
      academicSession: customSettings.academicSession || '2025-2026',
      date: customSettings.date || new Date().toISOString().split('T')[0],
      venue: customSettings.venue || 'Auditorium Hall B, IEHE Campus',
      organizerName: customSettings.organizerName || 'Ram Vishwakarma',
      totalPlayers,
      status: 'setup',
      currentRoundIndex: 0,
      rulesText: customSettings.rulesText || DEMO_SETTINGS.rulesText,
      defaultTimeControl: customSettings.defaultTimeControl || {
        type: 'rapid',
        initialMinutes: 10,
        incrementSeconds: 5,
        label: '10 + 5 Rapid',
      },
      maxBoards: Math.max(2, Math.floor(totalPlayers / 4)),
      autoAdvanceWalkovers: true,
      ...customSettings,
    };

    const roster = initialPlayers || [];
    const initialMatches = generateInitialMatches(totalPlayers, initialSettings.defaultTimeControl);
    const initialBoards: Board[] = Array.from({ length: initialSettings.maxBoards }, (_, i) => ({
      number: i + 1,
      currentMatchId: null,
      status: 'empty',
    }));

    setSettings(initialSettings);
    setPlayers(roster);
    setMatches(initialMatches);
    setBoards(initialBoards);
    setAnnouncements([
      {
        id: `ann-${Date.now()}`,
        title: 'Player Registration Open',
        content: `Welcome to ${initialSettings.name}. Contenders may now register with the arbiter.`,
        timestamp: new Date().toISOString(),
        priority: 'high',
        isPinned: true,
      },
    ]);
    setHistoryLogs([]);
    setActiveTab(roster.length > 0 ? 'dashboard' : 'players');
    addToast('success', 'New Tournament Initialized', `Created "${initialSettings.name}" with capacity for ${totalPlayers} players.`);
  }, [addToast]);

  const clearAllPlayers = useCallback(() => {
    setPlayers([]);
    const initialMatches = generateInitialMatches(settings.totalPlayers, settings.defaultTimeControl);
    setMatches(initialMatches);
    setBoards(prev => prev.map(b => ({ ...b, currentMatchId: null, status: 'empty' })));
    setSettings(prev => ({ ...prev, status: 'setup', currentRoundIndex: 0 }));
    setHistoryLogs([]);
    addToast('warning', 'Roster Cleared', 'All contenders removed. You can now register new players or import via CSV.');
  }, [settings.totalPlayers, settings.defaultTimeControl, addToast]);

  const loadDemoTournament = useCallback(() => {
    setSettings(DEMO_SETTINGS);
    setPlayers(DEMO_PLAYERS);
    setMatches(DEMO_MATCHES);
    setBoards(DEMO_BOARDS);
    setAnnouncements(DEMO_ANNOUNCEMENTS);
    setHistoryLogs([]);
    setActiveTab('dashboard');
    addToast('info', 'Demo Loaded', 'IEHE Championship 2026 loaded with live matches and bracket.');
  }, [addToast]);

  const resetTournament = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_PLAYERS);
    localStorage.removeItem(STORAGE_KEY_MATCHES);
    localStorage.removeItem(STORAGE_KEY_BOARDS);
    localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    loadDemoTournament();
  }, [loadDemoTournament]);

  // Player Management
  const addPlayer = useCallback((playerData: Omit<Player, 'id' | 'matchesPlayed' | 'wins' | 'losses' | 'draws' | 'currentRound' | 'score' | 'status'>) => {
    if (players.length >= settings.totalPlayers) {
      addToast('error', 'Limit Reached', `Tournament player limit of ${settings.totalPlayers} has been reached.`);
      return false;
    }

    // Check duplicate roll number
    if (players.some(p => p.rollNumber.trim().toLowerCase() === playerData.rollNumber.trim().toLowerCase())) {
      addToast('error', 'Duplicate Roll Number', `A player with roll number "${playerData.rollNumber}" is already registered.`);
      return false;
    }

    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      seed: players.length + 1,
      status: 'registered',
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      currentRound: 'Round 1',
      score: 0,
    };

    setPlayers(prev => [...prev, newPlayer]);
    addToast('success', 'Player Registered', `${newPlayer.name} (Seed #${newPlayer.seed}) added successfully.`);
    return true;
  }, [players, settings.totalPlayers, addToast]);

  const updatePlayer = useCallback((id: string, updates: Partial<Player>) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    addToast('info', 'Player Updated', 'Player profile details updated.');
  }, [addToast]);

  const deletePlayer = useCallback((id: string) => {
    setPlayers(prev => {
      const filtered = prev.filter(p => p.id !== id);
      return filtered.map((p, idx) => ({ ...p, seed: idx + 1 }));
    });
    setMatches(prevMatches => {
      const isAssigned = prevMatches.some(m => m.whitePlayerId === id || m.blackPlayerId === id);
      if (isAssigned) {
        return generateInitialMatches(settings.totalPlayers, settings.defaultTimeControl);
      }
      return prevMatches;
    });
    setBoards(prev => prev.map(b => ({ ...b, currentMatchId: null, status: 'empty' })));
    setSettings(prev => ({ ...prev, status: 'setup' }));
    addToast('warning', 'Player Removed', 'Contender removed from tournament registry.');
  }, [settings.totalPlayers, settings.defaultTimeControl, addToast]);

  const bulkAddPlayers = useCallback((newPlayersList: Array<Omit<Player, 'id' | 'matchesPlayed' | 'wins' | 'losses' | 'draws' | 'currentRound' | 'score' | 'status'>>) => {
    const availableSlots = settings.totalPlayers - players.length;
    const toAdd = newPlayersList.slice(0, availableSlots);

    const created: Player[] = toAdd.map((pd, index) => ({
      ...pd,
      id: `p-${Date.now()}-${index}`,
      seed: players.length + index + 1,
      status: 'registered',
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      currentRound: 'Round 1',
      score: 0,
    }));

    setPlayers(prev => [...prev, ...created]);
    addToast('success', 'Bulk Registration', `Added ${created.length} players to the tournament.`);
  }, [players.length, settings.totalPlayers, addToast]);

  // Pairing & Bracket
  const shuffleAndPairPlayers = useCallback((seeded: boolean = false) => {
    if (players.length < 2) {
      addToast('error', 'Not Enough Players', 'Need at least 2 registered players to generate pairings.');
      return [];
    }

    soundEffects.playClockClick();
    const pairings = seeded ? generateSeededPairings(players) : generateRandomPairings(players);
    return pairings;
  }, [players, addToast]);

  const confirmPairings = useCallback((pairings: { white: Player | null; black: Player | null }[]) => {
    const updatedMatches = generateInitialMatches(settings.totalPlayers, settings.defaultTimeControl, pairings);
    setMatches(updatedMatches);
    setSettings(prev => ({ ...prev, status: 'in_progress' }));
    setPlayers(prev => prev.map(p => ({ ...p, status: 'active' })));
    addToast('success', 'Pairings Confirmed', 'Round 1 matches generated and tournament is now IN PROGRESS!');
    setActiveTab('bracket');
  }, [settings.totalPlayers, settings.defaultTimeControl, addToast]);

  const manualSwapPlayers = useCallback((playerAId: string, playerBId: string) => {
    setMatches(prevMatches => {
      return prevMatches.map(m => {
        let w = m.whitePlayerId;
        let b = m.blackPlayerId;

        if (w === playerAId) w = playerBId;
        else if (w === playerBId) w = playerAId;

        if (b === playerAId) b = playerBId;
        else if (b === playerBId) b = playerAId;

        return {
          ...m,
          whitePlayerId: w,
          blackPlayerId: b,
        };
      });
    });
    addToast('info', 'Players Swapped', 'Pairing manually updated.');
  }, [addToast]);

  // Match & Timer Operations
  const startMatch = useCallback((matchId: string, boardNumber?: number) => {
    const startTimeIso = new Date().toISOString();
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: 'live',
          isTimerRunning: true,
          activeClock: 'white',
          startTime: m.startTime || startTimeIso,
          boardNumber: boardNumber !== undefined ? boardNumber : (m.boardNumber || 1),
        };
      }
      return m;
    }));

    if (boardNumber) {
      setBoards(prev => prev.map(b => (b.number === boardNumber ? { ...b, currentMatchId: matchId, status: 'occupied' } : b)));
    }

    soundEffects.playClockClick();
    addToast('info', 'Match Started', `Match ${matchId} is now LIVE on Board ${boardNumber || 1}.`);
  }, [addToast]);

  const pauseMatch = useCallback((matchId: string) => {
    setMatches(prev => prev.map(m => (m.id === matchId ? { ...m, isTimerRunning: false } : m)));
    soundEffects.playClockClick();
  }, []);

  const resumeMatch = useCallback((matchId: string) => {
    setMatches(prev => prev.map(m => (m.id === matchId ? { ...m, isTimerRunning: true, activeClock: m.activeClock || 'white' } : m)));
    soundEffects.playClockClick();
  }, []);

  const switchActiveClock = useCallback((matchId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId && m.status === 'live') {
        const nextClock = m.activeClock === 'white' ? 'black' : 'white';
        const incMs = m.timeControl.incrementSeconds * 1000;

        // Add increment to the player who just finished their move
        const whiteTime = m.activeClock === 'white' ? m.whiteTimeRemainingMs + incMs : m.whiteTimeRemainingMs;
        const blackTime = m.activeClock === 'black' ? m.blackTimeRemainingMs + incMs : m.blackTimeRemainingMs;

        soundEffects.playClockClick();
        return {
          ...m,
          activeClock: nextClock,
          isTimerRunning: true,
          whiteTimeRemainingMs: whiteTime,
          blackTimeRemainingMs: blackTime,
        };
      }
      return m;
    }));
  }, []);

  const resetMatchClock = useCallback((matchId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const initialMs = m.timeControl.initialMinutes * 60 * 1000;
        return {
          ...m,
          isTimerRunning: false,
          activeClock: null,
          whiteTimeRemainingMs: initialMs,
          blackTimeRemainingMs: initialMs,
        };
      }
      return m;
    }));
    soundEffects.playClockClick();
  }, []);

  const adjustPlayerClock = useCallback((matchId: string, player: 'white' | 'black', deltaSeconds: number) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const deltaMs = deltaSeconds * 1000;
        if (player === 'white') {
          return { ...m, whiteTimeRemainingMs: Math.max(0, m.whiteTimeRemainingMs + deltaMs) };
        } else {
          return { ...m, blackTimeRemainingMs: Math.max(0, m.blackTimeRemainingMs + deltaMs) };
        }
      }
      return m;
    }));
  }, []);

  // Record Result
  const recordResult = useCallback((matchId: string, resultType: ResultType, details?: string, tieBreakInfo?: TieBreakInfo) => {
    // Snapshot for Undo
    const snapshot = JSON.stringify({ matches, players, boards });

    const result = applyMatchResult(matches, players, matchId, resultType, details, tieBreakInfo);

    setMatches(result.updatedMatches);
    setPlayers(result.updatedPlayers);

    // Free up board if assigned
    const targetMatch = matches.find(m => m.id === matchId);
    if (targetMatch && targetMatch.boardNumber) {
      setBoards(prev => prev.map(b => (b.number === targetMatch.boardNumber ? { ...b, currentMatchId: null, status: 'empty' } : b)));
    }

    // Log history
    const winnerName = result.winner ? result.winner.name : 'Winner';
    const loserName = result.loser ? result.loser.name : 'Loser';
    const logItem: HistoryLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      matchId,
      action: 'RECORD_RESULT',
      description: `${winnerName} defeated ${loserName} in ${targetMatch?.roundName || 'Match'} (${resultType})`,
      snapshotState: snapshot,
    };
    setHistoryLogs(prev => [logItem, ...prev]);

    if (result.winner?.status === 'champion') {
      soundEffects.playVictoryChime();
      addToast('success', '🏆 TOURNAMENT CHAMPION!', `${winnerName} has won the ${settings.name}!`);
    } else {
      soundEffects.playVictoryChime();
      addToast('success', 'Result Recorded', `${winnerName} advanced to the next round.`);
    }
  }, [matches, players, boards, settings.name, addToast]);

  // Undo / Repair result
  const undoOrRepairResult = useCallback((matchId: string, newResultType: ResultType, newTieBreakInfo?: TieBreakInfo) => {
    const repaired = repairBracketAfterResultChange(matches, players, matchId, newResultType, newTieBreakInfo);
    setMatches(repaired.updatedMatches);
    setPlayers(repaired.updatedPlayers);
    addToast('warning', 'Bracket Repaired', 'Match result updated and downstream bracket tree synchronized.');
  }, [matches, players, addToast]);

  const undoLastAction = useCallback(() => {
    if (historyLogs.length === 0) {
      addToast('info', 'No Actions to Undo', 'History log is empty.');
      return;
    }

    const [lastLog, ...restLogs] = historyLogs;
    if (lastLog.snapshotState) {
      try {
        const state = JSON.parse(lastLog.snapshotState);
        if (state.matches && state.players) {
          setMatches(state.matches);
          setPlayers(state.players);
          if (state.boards) setBoards(state.boards);
          setHistoryLogs(restLogs);
          addToast('success', 'Action Undone', `Rolled back: ${lastLog.description}`);
          return;
        }
      } catch {
        // Fallback
      }
    }
    addToast('error', 'Undo Failed', 'Unable to restore previous snapshot.');
  }, [historyLogs, addToast]);

  // Board Management
  const assignMatchToBoard = useCallback((boardNumber: number, matchId: string) => {
    setBoards(prev => prev.map(b => (b.number === boardNumber ? { ...b, currentMatchId: matchId, status: 'occupied' } : b)));
    setMatches(prev => prev.map(m => (m.id === matchId ? { ...m, boardNumber } : m)));
    addToast('info', 'Board Assigned', `Match assigned to Board ${boardNumber}.`);
  }, [addToast]);

  const freeBoard = useCallback((boardNumber: number) => {
    setBoards(prev => prev.map(b => (b.number === boardNumber ? { ...b, currentMatchId: null, status: 'empty' } : b)));
    addToast('info', 'Board Vacated', `Board ${boardNumber} is now free.`);
  }, [addToast]);

  const updateBoardCount = useCallback((count: number) => {
    setSettings(prev => ({ ...prev, maxBoards: count }));
    setBoards(prev => {
      const current = [...prev];
      if (count > current.length) {
        for (let i = current.length + 1; i <= count; i++) {
          current.push({ number: i, currentMatchId: null, status: 'empty' });
        }
      } else {
        return current.slice(0, count);
      }
      return current;
    });
  }, []);

  // Announcements
  const addAnnouncement = useCallback((title: string, content: string, priority: 'normal' | 'high' | 'urgent' = 'normal', isPinned: boolean = false) => {
    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      timestamp: new Date().toISOString(),
      priority,
      isPinned,
    };
    setAnnouncements(prev => [ann, ...prev]);
    addToast('info', 'Announcement Published', title);
  }, [addToast]);

  const updateAnnouncement = useCallback((id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  // Statistics calculation
  const totalRegistered = players.length;
  const totalRequired = settings.totalPlayers;
  const isReadyToStart = totalRegistered >= totalRequired;
  const liveMatchesCount = matches.filter(m => m.status === 'live').length;
  const upcomingMatchesCount = matches.filter(m => m.status === 'upcoming' || m.status === 'ready').length;
  const completedMatchesCount = matches.filter(m => m.status === 'completed').length;
  const eliminatedCount = players.filter(p => p.status === 'eliminated').length;
  const totalExpectedMatches = totalRequired - 1;
  const progressPercent = totalExpectedMatches > 0 ? Math.round((completedMatchesCount / totalExpectedMatches) * 100) : 0;
  
  const championPlayer = players.find(p => p.status === 'champion') || null;
  const finalMatch = matches.find(m => m.roundName === 'Final');
  const runnerUpPlayer = (championPlayer && finalMatch && finalMatch.loserPlayerId)
    ? (players.find(p => p.id === finalMatch.loserPlayerId) || null)
    : null;

  // Active round name calculation
  let currentRoundName = 'Setup';
  if (championPlayer) {
    currentRoundName = 'Completed';
  } else if (matches.some(m => m.status === 'live' || m.status === 'ready')) {
    const activeMatch = matches.find(m => m.status === 'live') || matches.find(m => m.status === 'ready');
    if (activeMatch) currentRoundName = activeMatch.roundName;
  }

  const stats = {
    totalRegistered,
    totalRequired,
    isReadyToStart,
    liveMatchesCount,
    upcomingMatchesCount,
    completedMatchesCount,
    eliminatedCount,
    progressPercent: Math.min(100, progressPercent),
    currentRoundName,
    championPlayer,
    runnerUpPlayer,
  };

  return (
    <TournamentContext.Provider
      value={{
        settings,
        players,
        matches,
        boards,
        announcements,
        historyLogs,
        activeTab,
        isDark,
        isMuted,
        isProjectorMode,
        toasts,
        setActiveTab,
        toggleTheme,
        toggleMute,
        setIsProjectorMode,
        addToast,
        removeToast,
        updateSettings,
        startNewTournament,
        clearAllPlayers,
        loadDemoTournament,
        resetTournament,
        addPlayer,
        updatePlayer,
        deletePlayer,
        bulkAddPlayers,
        shuffleAndPairPlayers,
        confirmPairings,
        manualSwapPlayers,
        startMatch,
        pauseMatch,
        resumeMatch,
        switchActiveClock,
        resetMatchClock,
        adjustPlayerClock,
        recordResult,
        undoOrRepairResult,
        undoLastAction,
        assignMatchToBoard,
        freeBoard,
        updateBoardCount,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        stats,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = (): TournamentContextType => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};

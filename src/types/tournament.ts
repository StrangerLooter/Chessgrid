export type TournamentSize = 2 | 4 | 8 | 16 | 32 | 64 | 128;

export type TournamentStatus = 'setup' | 'paired' | 'in_progress' | 'completed';

export type PlayerStatus = 'registered' | 'active' | 'eliminated' | 'champion' | 'withdrawn';

export type MatchStatus = 'upcoming' | 'ready' | 'live' | 'completed' | 'cancelled';

export type ResultType = 
  | 'white_win' 
  | 'black_win' 
  | 'draw' 
  | 'walkover_white' 
  | 'walkover_black' 
  | 'disqualification'
  | null;

export type TieBreakMethod = 'rapid' | 'blitz' | 'armageddon' | 'organizer_decision';

export type TimeControlType = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'custom';

export interface TimeControl {
  type: TimeControlType;
  initialMinutes: number;
  incrementSeconds: number;
  label: string;
}

export interface Player {
  id: string;
  seed: number;
  name: string;
  rollNumber: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  status: PlayerStatus;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  currentRound: string;
  eliminatedInRound?: string;
  eliminatedByPlayerId?: string;
  eliminatedAt?: string;
  score: number;
}

export interface TieBreakInfo {
  method: TieBreakMethod;
  winnerId: string;
  details: string;
  timestamp: string;
}

export interface Match {
  id: string;
  roundIndex: number; // 0-indexed
  roundName: string; // "Round of 16", "Quarterfinal", "Semifinal", "Final"
  matchNumber: number; // 1-indexed within round or global
  boardNumber?: number | null;
  whitePlayerId: string | null;
  blackPlayerId: string | null;
  winnerPlayerId: string | null;
  loserPlayerId: string | null;
  status: MatchStatus;
  timeControl: TimeControl;
  whiteTimeRemainingMs: number;
  blackTimeRemainingMs: number;
  isTimerRunning: boolean;
  activeClock: 'white' | 'black' | null;
  lastTimerUpdate?: number;
  startTime?: string;
  endTime?: string;
  resultType: ResultType;
  resultDetails?: string;
  tieBreakInfo?: TieBreakInfo;
  notes: string;
  nextMatchId?: string;
  nextMatchSlot?: 'white' | 'black';
  previousMatchIds?: {
    whiteFromMatchId?: string;
    blackFromMatchId?: string;
  };
}

export interface Board {
  number: number;
  currentMatchId: string | null;
  status: 'empty' | 'occupied' | 'completed';
}

export interface TournamentSettings {
  id: string;
  name: string;
  collegeName: string;
  departmentName: string;
  academicSession: string;
  date: string;
  venue: string;
  organizerName: string;
  totalPlayers: TournamentSize;
  status: TournamentStatus;
  currentRoundIndex: number;
  logoUrl?: string;
  rulesText: string;
  defaultTimeControl: TimeControl;
  maxBoards: number;
  autoAdvanceWalkovers: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  priority: 'normal' | 'high' | 'urgent';
  isPinned: boolean;
}

export interface HistoryLog {
  id: string;
  timestamp: string;
  matchId: string;
  action: string;
  description: string;
  snapshotState?: string; // JSON serialized state before action for Undo
}

export type NavTab = 
  | 'dashboard' 
  | 'players' 
  | 'bracket' 
  | 'matches' 
  | 'live' 
  | 'boards' 
  | 'eliminated' 
  | 'history' 
  | 'settings';

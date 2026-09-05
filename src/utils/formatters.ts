import type { ResultType, TimeControl } from '../types/tournament';

export function formatTime(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  const formattedMins = String(minutes).padStart(2, '0');
  const formattedSecs = String(seconds).padStart(2, '0');

  // If under 20 seconds, show tenths for intense rapid/blitz countdowns
  if (totalSeconds < 20 && ms > 0) {
    return `${formattedMins}:${formattedSecs}.${tenths}`;
  }

  return `${formattedMins}:${formattedSecs}`;
}

export function formatTimeControl(tc: TimeControl): string {
  if (!tc) return '10 + 5';
  if (tc.type === 'custom') {
    return `${tc.initialMinutes}m + ${tc.incrementSeconds}s (Custom)`;
  }
  return `${tc.initialMinutes} + ${tc.incrementSeconds}`;
}

export function formatResultBadge(resultType: ResultType): { label: string; color: string; desc: string } {
  switch (resultType) {
    case 'white_win':
      return { label: '1 - 0', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'White Won' };
    case 'black_win':
      return { label: '0 - 1', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'Black Won' };
    case 'draw':
      return { label: '½ - ½', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', desc: 'Draw' };
    case 'walkover_white':
      return { label: '1 - 0 (W/O)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', desc: 'Walkover (White)' };
    case 'walkover_black':
      return { label: '0 - 1 (W/O)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', desc: 'Walkover (Black)' };
    case 'disqualification':
      return { label: 'DQ', color: 'bg-red-500/20 text-red-300 border-red-500/30', desc: 'Disqualified' };
    default:
      return { label: 'vs', color: 'bg-slate-800 text-slate-400 border-slate-700', desc: 'Pending' };
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatFullDate(isoString?: string): string {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

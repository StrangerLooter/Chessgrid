import React, { useEffect, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { 
  Trophy, 
  Megaphone, 
  X, 
  Maximize2, 
  Minimize2, 
  Crown, 
  Layers
} from 'lucide-react';
import { formatTime } from '../../utils/formatters';
import { deviceManager } from '../../utils/deviceApi';

export const PublicDisplayMode: React.FC = () => {
  const { 
    settings, 
    matches, 
    players, 
    stats, 
    announcements, 
    setIsProjectorMode 
  } = useTournament();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Keep display awake during live broadcast
  useEffect(() => {
    deviceManager.requestWakeLock();
    return () => {
      deviceManager.releaseWakeLock();
    };
  }, []);

  // Clock time update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProjectorMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsProjectorMode]);

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const liveMatches = matches.filter(m => m.status === 'live');
  const readyMatches = matches.filter(m => m.status === 'ready' || m.status === 'upcoming').slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 text-white flex flex-col justify-between overflow-hidden select-none p-6 sm:p-8 animate-in fade-in font-sans"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(201,168,76,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(26,122,94,0.05) 0%, transparent 50%), var(--cg-obsidian)',
      }}
    >
      
      {/* Projector Top Header */}
      <div className="flex items-center justify-between border-b border-[#c9a84c]/20 pb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#0a0a0b] shadow-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--cg-gold-dim), var(--cg-gold-bright))',
              boxShadow: '0 0 30px -5px rgba(201,168,76,0.5)',
            }}
          >
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl sm:text-3xl font-light tracking-wider text-[#f5f0e8]"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                {settings.name}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#e8c45a] border border-[#c9a84c]/40"
                style={{ background: 'rgba(201,168,76,0.12)' }}
              >
                {settings.academicSession}
              </span>
            </div>
            <p className="text-sm font-medium text-[#c8c0ae]/70 mt-0.5">
              {settings.collegeName} • <strong className="text-[#e8c45a]">{settings.departmentName}</strong> • {settings.venue}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-[#f5f0e8]">{currentTime}</div>
            <div className="text-xs text-[#c8c0ae]/60">Current Round: <strong className="text-[#e8c45a]">{stats.currentRoundName}</strong></div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-2xl bg-[#111114] border border-[#c9a84c]/30 hover:bg-[#18181d] text-[#c8c0ae] hover:text-[#e8c45a] transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          </button>

          <button
            onClick={() => setIsProjectorMode(false)}
            className="p-3 rounded-2xl bg-[#111114] border border-[#c9a84c]/30 hover:bg-red-950/40 text-[#c8c0ae] hover:text-red-400 transition-colors"
            title="Exit Projector Mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Stage: Live Matches Big Screen */}
      <div className="flex-1 my-6 overflow-y-auto space-y-6">
        {stats.championPlayer ? (
          /* Grand Champion Big Callout on Projector */
          <div className="py-12 px-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/40 text-center shadow-2xl relative overflow-hidden">
            <div className="inline-flex p-5 rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mb-4 shadow-xl">
              <Crown className="w-16 h-16" />
            </div>
            <div className="text-sm font-bold uppercase tracking-widest text-amber-300">
              Tournament Champion
            </div>
            <h2 className="text-5xl font-black text-white mt-2 mb-1">
              {stats.championPlayer.name}
            </h2>
            <p className="text-lg font-semibold text-emerald-400">
              {stats.championPlayer.rollNumber} • {stats.championPlayer.course}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {settings.collegeName} • {settings.departmentName}
            </p>
          </div>
        ) : liveMatches.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 className="text-xl font-extrabold text-white">Live Matches on Board</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map(match => {
                const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
                const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

                const isWhiteActive = match.activeClock === 'white';
                const isBlackActive = match.activeClock === 'black';

                return (
                  <div
                    key={match.id}
                    className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/40 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm border border-emerald-500/30">
                        BOARD {match.boardNumber || 1}
                      </span>
                      <span className="text-sm font-bold text-slate-300">
                        {match.roundName}
                      </span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-950 text-slate-400">
                        {match.timeControl.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* White */}
                      <div className={`p-4 rounded-2xl border text-center transition-all ${
                        isWhiteActive
                          ? 'bg-slate-800 border-emerald-400 ring-4 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span className="font-bold flex items-center gap-1.5 text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block" />
                            WHITE
                          </span>
                          {isWhiteActive && <span className="text-emerald-400 font-bold text-[10px] animate-pulse">TURN</span>}
                        </div>
                        <div className="text-xl font-extrabold text-white truncate">{whitePlayer?.name || 'TBD'}</div>
                        <div className="text-xs text-slate-400 truncate">{whitePlayer?.course || '-'}</div>

                        <div className={`text-4xl sm:text-5xl font-mono font-black mt-3 ${
                          match.whiteTimeRemainingMs < 30000 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                        }`}>
                          {formatTime(match.whiteTimeRemainingMs)}
                        </div>
                      </div>

                      {/* Black */}
                      <div className={`p-4 rounded-2xl border text-center transition-all ${
                        isBlackActive
                          ? 'bg-slate-800 border-emerald-400 ring-4 ring-emerald-500/30 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span className="font-bold flex items-center gap-1.5 text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600 inline-block" />
                            BLACK
                          </span>
                          {isBlackActive && <span className="text-emerald-400 font-bold text-[10px] animate-pulse">TURN</span>}
                        </div>
                        <div className="text-xl font-extrabold text-white truncate">{blackPlayer?.name || 'TBD'}</div>
                        <div className="text-xs text-slate-400 truncate">{blackPlayer?.course || '-'}</div>

                        <div className={`text-4xl sm:text-5xl font-mono font-black mt-3 ${
                          match.blackTimeRemainingMs < 30000 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                        }`}>
                          {formatTime(match.blackTimeRemainingMs)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Upcoming Queue on Big Screen */}
        {readyMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Next Matches in Queue</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {readyMatches.map(match => {
                const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
                const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

                return (
                  <div key={match.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-white">{match.roundName}</span>
                      <span className="text-emerald-400 font-bold">Board {match.boardNumber || 1}</span>
                    </div>

                    <div className="space-y-1 text-sm font-bold">
                      <div className="flex items-center gap-2 text-white truncate">
                        <span className="w-2 h-2 rounded-full bg-white inline-block shrink-0" />
                        <span className="truncate">{whitePlayer?.name || 'TBD'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase pl-4">vs</div>
                      <div className="flex items-center gap-2 text-white truncate">
                        <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-600 inline-block shrink-0" />
                        <span className="truncate">{blackPlayer?.name || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Projector Bottom Ticker: Arena Announcements & Arbiter Info */}
      <div className="border-t border-slate-800/80 pt-4 flex items-center gap-4 bg-slate-950">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs shrink-0">
          <Megaphone className="w-4 h-4" />
          <span>OFFICIAL ANNOUNCEMENTS</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="text-xs text-slate-300 font-medium truncate">
            {announcements.length > 0 ? (
              <span>
                <strong>{announcements[0].title}:</strong> {announcements[0].content}
              </span>
            ) : (
              <span>Tournament in progress under FIDE Rapid Knockout Rules. Chief Arbiter: {settings.organizerName}.</span>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 shrink-0 hidden sm:block">
          Press <strong>ESC</strong> to exit Display Mode
        </div>
      </div>
    </div>
  );
};

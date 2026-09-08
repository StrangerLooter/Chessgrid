import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { 
  Swords, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  X, 
  AlertTriangle,
  Gamepad2
} from 'lucide-react';
import { formatTime, formatResultBadge } from '../../utils/formatters';
import { TournamentBoardModal } from '../chess/TournamentBoardModal';

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenResultModal: (match: Match) => void;
  onOpenUndoModal?: (match: Match) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  isOpen,
  onClose,
  onOpenResultModal,
  onOpenUndoModal,
}) => {
  const { 
    players, 
    boards, 
    startMatch, 
    pauseMatch, 
    resumeMatch, 
    resetMatchClock, 
    adjustPlayerClock,
    switchActiveClock,
    assignMatchToBoard 
  } = useTournament();

  const [selectedBoard, setSelectedBoard] = useState<number>(match?.boardNumber || 1);
  const [isPlayBoardOpen, setIsPlayBoardOpen] = useState(false);

  if (!isOpen || !match) return null;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isReady = !!(whitePlayer && blackPlayer);

  const badge = formatResultBadge(match.resultType);

  const handleBoardChange = (boardNum: number) => {
    setSelectedBoard(boardNum);
    assignMatchToBoard(boardNum, match.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-2xl rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, #131317 0%, #0a0a0b 100%)',
            border: '1px solid rgba(201, 168, 76, 0.28)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(201, 168, 76, 0.12)',
          }}
        >
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: 'var(--cg-gold-bright)',
              }}
            >
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 
                  className="text-xl font-bold tracking-wide"
                  style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
                >
                  Match #{match.matchNumber}: {match.roundName}
                </h3>
                <span className="text-xs font-mono text-[#c9a84c]">({match.id})</span>
              </div>
              <p className="text-xs text-[#c8c0ae]/60">
                Control tournament digital clocks, board assignments, and official arbiter results
              </p>
            </div>
          </div>

          {/* Board & Time Control Settings Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div 
              className="p-3 rounded-xl flex items-center justify-between"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <span className="text-xs font-semibold text-[#c8c0ae]/70">Assigned Board:</span>
              <select
                value={match.boardNumber || selectedBoard}
                onChange={e => handleBoardChange(Number(e.target.value))}
                disabled={isCompleted}
                className="bg-black/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50"
              >
                {boards.map(b => (
                  <option key={b.number} value={b.number}>
                    Board #{b.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Play Live Board Action */}
            {isReady && !isCompleted && (
              <button
                type="button"
                onClick={() => setIsPlayBoardOpen(true)}
                className="p-3 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Gamepad2 className="w-4 h-4 text-amber-400" />
                <span>LAUNCH INTERACTIVE BOARD</span>
              </button>
            )}
          </div>

          {/* Two Player Versing Cards & Live Clocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* White Player */}
            <div 
              className="p-4 rounded-2xl border transition-all relative overflow-hidden"
              style={{
                background: match.activeClock === 'white' && isLive
                  ? 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.22) 0%, rgba(10, 10, 11, 0.95) 100%)'
                  : match.winnerPlayerId === match.whitePlayerId && isCompleted
                  ? 'rgba(34, 166, 122, 0.12)'
                  : 'rgba(10, 10, 11, 0.7)',
                borderColor: match.activeClock === 'white' && isLive
                  ? 'var(--cg-gold-bright)'
                  : match.winnerPlayerId === match.whitePlayerId && isCompleted
                  ? 'rgba(34, 166, 122, 0.4)'
                  : 'rgba(201, 168, 76, 0.15)',
                boxShadow: match.activeClock === 'white' && isLive
                  ? '0 0 25px rgba(201, 168, 76, 0.25)'
                  : 'none',
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#c8c0ae]/60 mb-2">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <span className="w-3 h-3 rounded-full bg-white inline-block shadow-sm" />
                  WHITE
                </span>
                {whitePlayer && <span className="font-semibold text-[#c9a84c] font-mono">Seed #{whitePlayer.seed}</span>}
              </div>

              <div 
                className="text-base font-bold text-white truncate"
                style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.1rem' }}
              >
                {whitePlayer?.name || 'TBD (Winner of Prev)'}
              </div>
              <div className="text-xs text-[#c8c0ae]/50 mt-0.5 truncate font-mono">
                {whitePlayer?.rollNumber || '-'} • {whitePlayer?.course || '-'}
              </div>

              {/* Large Clock Display */}
              <div 
                className="my-3 py-2.5 rounded-xl border"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderColor: match.activeClock === 'white' && isLive ? 'rgba(201, 168, 76, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <div 
                  className="text-3xl font-extrabold tracking-wider"
                  style={{
                    fontFamily: 'var(--font-stat)',
                    color: match.whiteTimeRemainingMs < 30000 ? '#f87171' : match.activeClock === 'white' && isLive ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                  }}
                >
                  {formatTime(match.whiteTimeRemainingMs)}
                </div>
              </div>

              {/* Quick Time Adjusters (+1m / -1m) */}
              {!isCompleted && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustPlayerClock(match.id, 'white', -60)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f87171',
                    }}
                    title="Subtract 1 minute penalty"
                  >
                    -1 min
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustPlayerClock(match.id, 'white', 60)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors"
                    style={{
                      background: 'rgba(201, 168, 76, 0.1)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      color: 'var(--cg-gold-bright)',
                    }}
                    title="Add 1 minute bonus"
                  >
                    +1 min
                  </button>
                </div>
              )}
            </div>

            {/* Black Player */}
            <div 
              className="p-4 rounded-2xl border transition-all relative overflow-hidden"
              style={{
                background: match.activeClock === 'black' && isLive
                  ? 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.22) 0%, rgba(10, 10, 11, 0.95) 100%)'
                  : match.winnerPlayerId === match.blackPlayerId && isCompleted
                  ? 'rgba(34, 166, 122, 0.12)'
                  : 'rgba(10, 10, 11, 0.7)',
                borderColor: match.activeClock === 'black' && isLive
                  ? 'var(--cg-gold-bright)'
                  : match.winnerPlayerId === match.blackPlayerId && isCompleted
                  ? 'rgba(34, 166, 122, 0.4)'
                  : 'rgba(201, 168, 76, 0.15)',
                boxShadow: match.activeClock === 'black' && isLive
                  ? '0 0 25px rgba(201, 168, 76, 0.25)'
                  : 'none',
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#c8c0ae]/60 mb-2">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <span className="w-3 h-3 rounded-full bg-black border border-[#c9a84c]/50 inline-block shadow-sm" />
                  BLACK
                </span>
                {blackPlayer && <span className="font-semibold text-[#c9a84c] font-mono">Seed #{blackPlayer.seed}</span>}
              </div>

              <div 
                className="text-base font-bold text-white truncate"
                style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.1rem' }}
              >
                {blackPlayer?.name || 'TBD (Winner of Prev)'}
              </div>
              <div className="text-xs text-[#c8c0ae]/50 mt-0.5 truncate font-mono">
                {blackPlayer?.rollNumber || '-'} • {blackPlayer?.course || '-'}
              </div>

              {/* Large Clock Display */}
              <div 
                className="my-3 py-2.5 rounded-xl border"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  borderColor: match.activeClock === 'black' && isLive ? 'rgba(201, 168, 76, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <div 
                  className="text-3xl font-extrabold tracking-wider"
                  style={{
                    fontFamily: 'var(--font-stat)',
                    color: match.blackTimeRemainingMs < 30000 ? '#f87171' : match.activeClock === 'black' && isLive ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                  }}
                >
                  {formatTime(match.blackTimeRemainingMs)}
                </div>
              </div>

              {/* Quick Time Adjusters (+1m / -1m) */}
              {!isCompleted && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustPlayerClock(match.id, 'black', -60)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f87171',
                    }}
                    title="Subtract 1 minute penalty"
                  >
                    -1 min
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustPlayerClock(match.id, 'black', 60)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors"
                    style={{
                      background: 'rgba(201, 168, 76, 0.1)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      color: 'var(--cg-gold-bright)',
                    }}
                    title="Add 1 minute bonus"
                  >
                    +1 min
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Clock Control Bar */}
          {!isCompleted && isReady && (
            <div 
              className="flex flex-wrap items-center gap-2.5 mb-6 p-3 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 11, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.18)',
              }}
            >
              {isLive ? (
                <>
                  {match.isTimerRunning ? (
                    <button
                      onClick={() => pauseMatch(match.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        color: '#fbbf24',
                      }}
                    >
                      <Pause className="w-4 h-4" />
                      Pause Clock
                    </button>
                  ) : (
                    <button
                      onClick={() => resumeMatch(match.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
                      style={{
                        background: 'rgba(34, 166, 122, 0.2)',
                        border: '1px solid rgba(34, 166, 122, 0.4)',
                        color: '#34d399',
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Resume Clock
                    </button>
                  )}

                  <button
                    onClick={() => switchActiveClock(match.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: 'rgba(201, 168, 76, 0.12)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      color: 'var(--cg-gold-bright)',
                    }}
                  >
                    <RotateCcw className="w-4 h-4 text-[#c9a84c]" />
                    Switch Active Turn (Space)
                  </button>

                  <button
                    onClick={() => resetMatchClock(match.id)}
                    className="p-2.5 rounded-xl text-[#c8c0ae]/50 hover:text-white transition-colors"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    title="Reset clock to initial time"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startMatch(match.id, match.boardNumber || selectedBoard)}
                  className="cg-btn cg-btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Clock & Start Game on Board {match.boardNumber || selectedBoard}</span>
                </button>
              )}
            </div>
          )}

          {/* Arbiter Notes / Details if completed */}
          {match.resultDetails && (
            <div 
              className="p-3.5 mb-5 rounded-xl text-xs"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.18)',
              }}
            >
              <span className="font-bold text-[#c8c0ae]/70">Official Result: </span>
              <span className="text-emerald-400 font-bold">{badge.desc} ({badge.label})</span>
              <p className="text-[#c8c0ae]/60 mt-1 italic font-sans">{match.resultDetails}</p>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#c9a84c]/20">
            <div>
              {isCompleted && onOpenUndoModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenUndoModal(match);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fbbf24',
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Edit / Undo Result</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                Close
              </button>

              {isReady && !isCompleted && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenResultModal(match);
                  }}
                  className="cg-btn cg-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  <Award className="w-4 h-4" />
                  <span>Record Result</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Board Modal */}
      {isPlayBoardOpen && (
        <TournamentBoardModal
          match={match}
          isOpen={isPlayBoardOpen}
          onClose={() => setIsPlayBoardOpen(false)}
        />
      )}
    </>
  );
};

import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { Grid3X3, Play, Plus, Minus, Trash2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface BoardManagementProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
}

export const BoardManagement: React.FC<BoardManagementProps> = ({
  onOpenMatchModal,
}) => {
  const { 
    boards, 
    matches, 
    players, 
    assignMatchToBoard, 
    freeBoard, 
    updateBoardCount,
    startMatch 
  } = useTournament();

  const [assigningBoardNum, setAssigningBoardNum] = useState<number | null>(null);

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const matchMap = new Map<string, Match>(matches.map(m => [m.id, m]));

  const unassignedReadyMatches = matches.filter(
    m => (m.status === 'ready' || m.status === 'upcoming') && m.whitePlayerId && m.blackPlayerId
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Board Count Controls */}
      <div
        className="p-6 rounded flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'rgba(17, 17, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(201, 168, 76, 0.22)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <Grid3X3 className="w-5 h-5" style={{ color: 'var(--cg-gold)' }} />
            <h2
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: '1.5rem',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: 'var(--cg-ivory)',
                margin: 0,
              }}
            >
              PHYSICAL BOARD ALLOCATION
            </h2>
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                color: 'var(--cg-gold)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {boards.length} PHYSICAL TABLES
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.6)',
            }}
          >
            Manage physical chessboard stations and arbitrate table occupancy
          </p>
        </div>

        {/* Board Count Adjuster */}
        <div
          className="flex items-center gap-3 p-1.5 rounded"
          style={{
            background: 'rgba(10, 10, 11, 0.8)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
          }}
        >
          <span
            className="text-xs font-semibold pl-2 uppercase"
            style={{ fontFamily: 'var(--font-sans)', color: 'rgba(200, 192, 174, 0.6)' }}
          >
            Total Tables:
          </span>
          <button
            onClick={() => updateBoardCount(Math.max(1, boards.length - 1))}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[rgba(201,168,76,0.1)] transition-colors"
            title="Remove Board"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            className="text-sm font-bold px-2"
            style={{ fontFamily: 'var(--font-stat)', fontSize: '1.25rem', color: 'var(--cg-gold)' }}
          >
            {boards.length}
          </span>
          <button
            onClick={() => updateBoardCount(boards.length + 1)}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[rgba(201,168,76,0.1)] transition-colors"
            title="Add Board"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {boards.map(board => {
          const match = board.currentMatchId ? matchMap.get(board.currentMatchId) : null;
          const whitePlayer = match?.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
          const blackPlayer = match?.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;
          const isLive = match?.status === 'live';

          return (
            <div
              key={board.number}
              className="p-5 rounded transition-all duration-200 flex flex-col justify-between"
              style={{
                background: isLive
                  ? 'rgba(201, 168, 76, 0.1)'
                  : match
                  ? 'rgba(17, 17, 20, 0.75)'
                  : 'rgba(10, 10, 11, 0.55)',
                border: isLive
                  ? '1px solid var(--cg-gold)'
                  : match
                  ? '1px solid rgba(201, 168, 76, 0.22)'
                  : '1px dashed rgba(201, 168, 76, 0.15)',
                boxShadow: isLive ? '0 0 25px -5px rgba(201, 168, 76, 0.4)' : 'none',
              }}
            >
              {/* Board Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'rgba(201, 168, 76, 0.18)',
                      border: '1px solid rgba(201, 168, 76, 0.4)',
                      color: 'var(--cg-gold-bright)',
                      fontFamily: 'var(--font-stat)',
                    }}
                  >
                    {board.number}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--cg-ivory)',
                        margin: 0,
                      }}
                    >
                      BOARD #{board.number}
                    </h3>
                    <span
                      className="text-[11px]"
                      style={{ color: 'rgba(200, 192, 174, 0.5)', fontFamily: 'var(--font-sans)' }}
                    >
                      {isLive ? 'Match in progress' : match ? 'Assigned' : 'Available / Free'}
                    </span>
                  </div>
                </div>

                <div>
                  {isLive ? (
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse"
                      style={{
                        background: 'rgba(201, 168, 76, 0.2)',
                        color: 'var(--cg-gold-bright)',
                        border: '1px solid rgba(201, 168, 76, 0.5)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      LIVE
                    </span>
                  ) : match ? (
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: 'rgba(201, 168, 76, 0.1)',
                        color: 'var(--cg-gold)',
                        border: '1px solid rgba(201, 168, 76, 0.25)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      OCCUPIED
                    </span>
                  ) : (
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px]"
                      style={{
                        background: 'rgba(201, 168, 76, 0.05)',
                        color: 'rgba(200, 192, 174, 0.4)',
                        border: '1px solid rgba(201, 168, 76, 0.1)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      FREE
                    </span>
                  )}
                </div>
              </div>

              {/* Match Content */}
              {match ? (
                <div className="space-y-3 mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                  <div className="text-xs flex items-center justify-between">
                    <span className="font-bold" style={{ color: 'var(--cg-ivory)' }}>{match.roundName}</span>
                    <span className="font-mono" style={{ color: 'rgba(200, 192, 174, 0.5)' }}>{match.timeControl.label}</span>
                  </div>

                  {/* White vs Black */}
                  <div
                    className="p-3 rounded space-y-2"
                    style={{
                      background: 'rgba(10, 10, 11, 0.7)',
                      border: '1px solid rgba(201, 168, 76, 0.12)',
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-amber-300 inline-block" />
                        <span className="font-bold truncate" style={{ color: 'var(--cg-ivory)' }}>
                          {whitePlayer?.name || 'TBD'}
                        </span>
                      </div>
                      {isLive && (
                        <span className="font-mono font-bold text-xs" style={{ color: 'var(--cg-ivory)' }}>
                          {formatTime(match.whiteTimeRemainingMs)}
                        </span>
                      )}
                    </div>

                    <div className="text-center text-[10px] uppercase font-bold" style={{ color: 'var(--cg-gold)' }}>
                      vs
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-400 inline-block" />
                        <span className="font-bold truncate" style={{ color: 'var(--cg-gold)' }}>
                          {blackPlayer?.name || 'TBD'}
                        </span>
                      </div>
                      {isLive && (
                        <span className="font-mono font-bold text-xs" style={{ color: 'var(--cg-gold)' }}>
                          {formatTime(match.blackTimeRemainingMs)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for occupied board */}
                  <div className="flex items-center gap-2 pt-2">
                    {!isLive && (
                      <button
                        onClick={() => startMatch(match.id, board.number)}
                        className="flex-1 cg-btn cg-btn-primary"
                        style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Start Match
                      </button>
                    )}

                    <button
                      onClick={() => onOpenMatchModal(match)}
                      className="flex-1 cg-btn cg-btn-ghost"
                      style={{ padding: '0.4rem 0.8rem', justifyContent: 'center' }}
                    >
                      Control Room
                    </button>

                    <button
                      onClick={() => freeBoard(board.number)}
                      className="p-2 rounded transition-colors text-slate-400 hover:text-red-400 hover:bg-[rgba(192,57,43,0.15)]"
                      title="Vacate Board"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(200, 192, 174, 0.4)', fontFamily: 'var(--font-sans)' }}
                  >
                    Table is currently available.
                  </p>

                  {assigningBoardNum === board.number ? (
                    <div className="space-y-2 animate-in fade-in">
                      <div
                        className="text-[11px] font-semibold"
                        style={{ color: 'var(--cg-gold)', fontFamily: 'var(--font-sans)' }}
                      >
                        Select Match to Assign:
                      </div>
                      {unassignedReadyMatches.length === 0 ? (
                        <div className="text-xs" style={{ color: 'rgba(200, 192, 174, 0.4)' }}>
                          No ready matches waiting in queue.
                        </div>
                      ) : (
                        <div className="max-h-36 overflow-y-auto space-y-1 text-left">
                          {unassignedReadyMatches.map(m => (
                            <button
                              key={m.id}
                              onClick={() => {
                                assignMatchToBoard(board.number, m.id);
                                setAssigningBoardNum(null);
                              }}
                              className="w-full p-2 rounded text-xs text-slate-200 flex items-center justify-between transition-colors"
                              style={{
                                background: 'rgba(10, 10, 11, 0.8)',
                                border: '1px solid rgba(201, 168, 76, 0.2)',
                              }}
                            >
                              <span>{m.roundName} #{m.matchNumber}</span>
                              <span style={{ color: 'var(--cg-gold)', fontWeight: 700 }}>Assign →</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setAssigningBoardNum(null)}
                        className="text-[11px] text-slate-500 underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigningBoardNum(board.number)}
                      className="cg-btn cg-btn-ghost"
                      style={{ padding: '0.4rem 1rem' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Ready Match</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardManagement;

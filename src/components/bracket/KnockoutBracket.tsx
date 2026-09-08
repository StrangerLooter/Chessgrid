import React, { useState, useRef, useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match } from '../../types/tournament';
import { BracketMatchNode } from './BracketMatchNode';
import { getRoundNames } from '../../utils/bracketEngine';
import { 
  Trophy, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Shuffle,
  Crown
} from 'lucide-react';

interface KnockoutBracketProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenShuffleModal: () => void;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({
  onOpenMatchModal,
  onOpenShuffleModal,
}) => {
  const { matches, playerMap, settings, stats } = useTournament();
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const roundNames: string[] = useMemo(() => getRoundNames(settings.totalPlayers), [settings.totalPlayers]);

  // Group matches by roundIndex
  const matchesByRound = useMemo(() => {
    const grouped: { [roundIndex: number]: Match[] } = {};
    matches.forEach(m => {
      if (!grouped[m.roundIndex]) {
        grouped[m.roundIndex] = [];
      }
      grouped[m.roundIndex].push(m);
    });
    return grouped;
  }, [matches]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(1.4, prev + 0.1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.65, prev - 0.1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-4">
      
      {/* Bracket Header Toolbar */}
      <div
        className="p-4 sm:p-5 rounded flex flex-col sm:flex-row items-center justify-between gap-4"
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
            <Trophy className="w-5 h-5" style={{ color: 'var(--cg-gold)' }} />
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
              KNOCKOUT TOURNAMENT BRACKET
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
              {settings.totalPlayers} PLAYERS • {roundNames.length} ROUNDS
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.6)',
            }}
          >
            Click any match node to inspect live clocks, arbitrate boards, or declare victory
          </p>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          {settings.status === 'setup' && stats.isReadyToStart && (
            <button
              onClick={onOpenShuffleModal}
              className="cg-btn cg-btn-primary"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle & Pair</span>
            </button>
          )}

          <div
            className="flex items-center gap-1 p-1 rounded"
            style={{
              background: 'rgba(10, 10, 11, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
            }}
          >
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span
              className="text-[11px] font-mono px-1 font-semibold"
              style={{ color: 'var(--cg-gold)' }}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[rgba(201,168,76,0.1)] transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Bracket Canvas Container */}
      <div 
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-hidden p-6 sm:p-8 rounded min-h-[580px] flex items-center justify-start relative bracket-scroll"
        style={{
          background: 'rgba(10, 10, 11, 0.94)',
          border: '1px solid rgba(201, 168, 76, 0.22)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85), 0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="flex items-stretch gap-10 sm:gap-14 transition-transform duration-200 origin-top-left py-4"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {roundNames.map((roundName, rIndex) => {
            const roundMatches = matchesByRound[rIndex] || [];
            const isLastRound = rIndex === roundNames.length - 1;

            return (
              <div key={roundName} className="flex flex-col justify-around min-w-[260px] space-y-6 relative">
                
                {/* Round Header Label */}
                <div
                  className="text-center pb-2 sticky top-0 backdrop-blur-md z-10 rounded-t"
                  style={{
                    borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
                    background: 'rgba(19, 19, 20, 0.75)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: 'var(--cg-gold)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {roundName}
                  </span>
                  <div
                    className="text-[11px] font-mono mt-0.5"
                    style={{
                      color: 'rgba(200, 192, 174, 0.55)',
                    }}
                  >
                    {roundMatches.length} {roundMatches.length === 1 ? 'Championship Match' : 'Matches'}
                  </div>
                </div>

                {/* Matches Column */}
                <div className="flex flex-col justify-around h-full space-y-6 relative">
                  {roundMatches.map(match => (
                    <div key={match.id} className="relative flex items-center">
                      <BracketMatchNode
                        match={match}
                        playerMap={playerMap}
                        onClick={onOpenMatchModal}
                      />
                      {!isLastRound && (
                        <div className="hidden lg:block absolute -right-10 w-10 bracket-line pointer-events-none" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Grand Champion Pedestal at the end of the bracket */}
          <div className="flex flex-col justify-center items-center min-w-[220px] pl-4">
            <div
              className="text-center pb-2 w-full mb-6"
              style={{
                borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--cg-gold-bright)',
                  textTransform: 'uppercase',
                }}
              >
                TOURNAMENT CHAMPION
              </span>
            </div>

            <div
              className="p-6 rounded border text-center transition-all w-full"
              style={{
                background: stats.championPlayer
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(10,10,11,0.95))'
                  : 'rgba(17, 17, 20, 0.5)',
                borderColor: stats.championPlayer ? 'rgba(201, 168, 76, 0.5)' : 'rgba(201, 168, 76, 0.15)',
                boxShadow: stats.championPlayer ? '0 0 30px -5px rgba(201, 168, 76, 0.4)' : 'none',
              }}
            >
              <div
                className="w-14 h-14 rounded flex items-center justify-center mx-auto mb-3"
                style={{
                  background: 'rgba(201, 168, 76, 0.2)',
                  border: '1px solid rgba(201, 168, 76, 0.5)',
                  color: 'var(--cg-gold-bright)',
                }}
              >
                {stats.championPlayer ? <Crown className="w-7 h-7" /> : <Trophy className="w-7 h-7" />}
              </div>

              {stats.championPlayer ? (
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--cg-gold)',
                    }}
                  >
                    VICTOR & CHAMPION
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-cinematic)',
                      fontSize: '1.4rem',
                      fontWeight: 400,
                      color: 'var(--cg-ivory)',
                      margin: '0.25rem 0',
                    }}
                  >
                    {stats.championPlayer.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--cg-emerald-bright)',
                      margin: 0,
                    }}
                  >
                    {stats.championPlayer.rollNumber}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      color: 'rgba(200, 192, 174, 0.5)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stats.championPlayer.course}
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(200, 192, 174, 0.7)', fontWeight: 600 }}>
                    Awaiting Final Match
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.7rem',
                      color: 'rgba(200, 192, 174, 0.4)',
                      marginTop: '0.25rem',
                    }}
                  >
                    Champion will be crowned upon completion of the Final round.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bracket Visual State Legend */}
      <div
        className="flex flex-wrap items-center justify-center gap-4 text-xs p-3 rounded"
        style={{
          background: 'rgba(10, 10, 11, 0.7)',
          border: '1px solid rgba(201, 168, 76, 0.12)',
          fontFamily: 'var(--font-sans)',
          color: 'rgba(200, 192, 174, 0.6)',
        }}
      >
        <span style={{ color: 'var(--cg-gold)', fontWeight: 700 }}>LEGEND:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-950 border border-dashed border-amber-400/40 inline-block" />
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-900 border border-amber-400 inline-block" />
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400 inline-block animate-pulse" />
          <span style={{ color: 'var(--cg-gold-bright)', fontWeight: 700 }}>Live Match</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40 inline-block" />
          <span style={{ color: 'var(--cg-emerald-bright)' }}>Winner</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="line-through text-slate-500">Eliminated</span>
        </div>
      </div>
    </div>
  );
};

export default KnockoutBracket;

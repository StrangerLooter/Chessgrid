import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { Search, Calendar, ChevronRight, Swords, Skull } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface EliminatedViewProps {
  onOpenProfileModal: (player: Player) => void;
}

export const EliminatedView: React.FC<EliminatedViewProps> = ({ onOpenProfileModal }) => {
  const { players, stats } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [roundFilter, setRoundFilter] = useState('all');

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  const eliminatedPlayers = players.filter(p => p.status === 'eliminated');

  const filtered = eliminatedPlayers.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.course.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRound = roundFilter === 'all' || p.eliminatedInRound === roundFilter;

    return matchesSearch && matchesRound;
  });

  const uniqueRounds = Array.from(new Set(eliminatedPlayers.map(p => p.eliminatedInRound || 'Round 1')));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 80% 0%, rgba(220, 38, 38, 0.08) 0%, rgba(17, 17, 20, 0.95) 70%)',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#f87171',
                }}
              >
                <Skull className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 
                    className="text-2xl font-bold tracking-wide"
                    style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
                  >
                    Eliminated Contenders Registry
                  </h2>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: 'rgba(220, 38, 38, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {stats.eliminatedCount} Knocked Out
                  </span>
                </div>
                <p className="text-xs text-[#c8c0ae]/60 mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  Chronological registry of honorable departures across knockout brackets
                </p>
              </div>
            </div>
          </div>

          {/* Contender Pill */}
          <div 
            className="flex items-center gap-4 px-4 py-2.5 rounded-xl self-stretch md:self-auto justify-between md:justify-start"
            style={{
              background: 'rgba(10, 10, 11, 0.6)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            <div className="text-left md:text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c8c0ae]/50" style={{ fontFamily: 'var(--font-sans)' }}>
                Active Field
              </div>
              <div 
                className="text-base font-bold"
                style={{ fontFamily: 'var(--font-stat)', color: 'var(--cg-gold-bright)', letterSpacing: '0.05em' }}
              >
                {stats.totalRegistered - stats.eliminatedCount} CONTENDERS REMAINING
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8c0ae]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search eliminated players..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder-[#c8c0ae]/30 focus:outline-none transition-all"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {uniqueRounds.length > 0 && (
          <select
            value={roundFilter}
            onChange={e => setRoundFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all w-full sm:w-auto"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">All Knockout Rounds</option>
            {uniqueRounds.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
      </div>

      {/* Eliminated Cards Grid */}
      {filtered.length === 0 ? (
        <div 
          className="p-12 text-center rounded-2xl text-[#c8c0ae]/40"
          style={{
            background: 'rgba(17, 17, 20, 0.4)',
            border: '1px dashed rgba(201, 168, 76, 0.15)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {eliminatedPlayers.length === 0 ? 'No players eliminated yet. All contenders active.' : 'No eliminated players matching the search filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(player => {
            const defeatedBy = player.eliminatedByPlayerId ? playerMap.get(player.eliminatedByPlayerId) : null;

            return (
              <div
                key={player.id}
                className="p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between group hover:border-[#c9a84c]/40"
                style={{
                  background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.85) 100%)',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: 'rgba(220, 38, 38, 0.12)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        color: '#f87171',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {player.eliminatedInRound || 'Knockout Stage'}
                    </span>
                    <span 
                      className="text-xs font-bold"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--cg-gold)' }}
                    >
                      Seed #{player.seed}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(201,168,76,0.2), rgba(10,10,11,0.8))',
                        border: '1px solid rgba(201, 168, 76, 0.25)',
                        color: 'var(--cg-gold-bright)',
                        fontFamily: 'var(--font-stat)'
                      }}
                    >
                      {player.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 
                        className="font-bold text-base leading-tight truncate group-hover:text-[#e8c45a] transition-colors"
                        style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
                      >
                        {player.name}
                      </h3>
                      <p className="text-[11px] text-[#c8c0ae]/50 mt-0.5 truncate font-mono">
                        {player.rollNumber} • {player.course}
                      </p>
                    </div>
                  </div>

                  {/* Elimination matchup details */}
                  <div 
                    className="p-3 rounded-xl text-xs space-y-1.5 mb-4"
                    style={{
                      background: 'rgba(10, 10, 11, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-[#c8c0ae]/70">
                      <Swords className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>Conceded to:</span>
                      <strong className="text-white font-bold ml-0.5">{defeatedBy?.name || 'Opponent'}</strong>
                    </div>
                    {player.eliminatedAt && (
                      <div className="text-[10px] text-[#c8c0ae]/40 flex items-center gap-1 pt-1 border-t border-white/5 font-mono">
                        <Calendar className="w-3 h-3 text-[#c9a84c]/60" />
                        <span>Knocked out: {formatDateTime(player.eliminatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onOpenProfileModal(player)}
                  className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all group/btn"
                  style={{
                    background: 'rgba(201, 168, 76, 0.08)',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    color: 'var(--cg-ivory)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.18)';
                    e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)';
                  }}
                >
                  <span>Contender Dossier & Match Record</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#c9a84c] group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


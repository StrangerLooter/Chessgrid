import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { 
  X, 
  Crown, 
  UserMinus, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Swords, 
  Phone, 
  Mail,
  GraduationCap
} from 'lucide-react';
import { formatResultBadge } from '../../utils/formatters';

interface PlayerProfileModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, isOpen, onClose }) => {
  const { matches, players } = useTournament();

  if (!isOpen || !player) return null;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  // Find all matches featuring this player
  const playerMatches = matches.filter(
    m => m.whitePlayerId === player.id || m.blackPlayerId === player.id
  );

  return (
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

        {/* Profile Header Pod */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b border-[#c9a84c]/20">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shrink-0"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(201, 168, 76, 0.3) 0%, rgba(10, 10, 11, 0.95) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.4)',
              color: 'var(--cg-gold-bright)',
              fontFamily: 'var(--font-stat)'
            }}
          >
            {player.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 
                className="text-2xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
              >
                {player.name}
              </h2>
              
              {player.status === 'champion' && (
                <span 
                  className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(201, 168, 76, 0.2)',
                    color: 'var(--cg-gold-bright)',
                    border: '1px solid rgba(201, 168, 76, 0.4)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <Crown className="w-3.5 h-3.5 text-[#c9a84c]" /> Champion
                </span>
              )}

              {player.status === 'eliminated' && (
                <span 
                  className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(220, 38, 38, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <UserMinus className="w-3.5 h-3.5" /> Out in {player.eliminatedInRound || 'R1'}
                </span>
              )}

              {player.status === 'active' && (
                <span 
                  className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(34, 166, 122, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(34, 166, 122, 0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Active Contender
                </span>
              )}
            </div>

            <div 
              className="text-xs font-bold"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--cg-gold)' }}
            >
              Roll No: {player.rollNumber} • Seed #{player.seed}
            </div>

            <div className="text-xs text-[#c8c0ae]/70 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1 text-[#c8c0ae]/80">
                <GraduationCap className="w-3.5 h-3.5 text-[#c9a84c]" />
                {player.course} ({player.year}, {player.semester}, Sec {player.section})
              </span>
              {player.phone && (
                <span className="flex items-center gap-1 font-mono text-[#c8c0ae]/70">
                  <Phone className="w-3.5 h-3.5 text-[#c9a84c]" />
                  {player.phone}
                </span>
              )}
              {player.email && (
                <span className="flex items-center gap-1 font-mono text-[#c8c0ae]/70">
                  <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                  {player.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div 
            className="p-3.5 rounded-2xl text-center"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c8c0ae]/50">Matches Played</div>
            <div 
              className="text-2xl font-bold mt-0.5"
              style={{ fontFamily: 'var(--font-stat)', color: 'var(--cg-ivory)' }}
            >
              {player.matchesPlayed}
            </div>
          </div>

          <div 
            className="p-3.5 rounded-2xl text-center"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(34, 166, 122, 0.25)',
            }}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c8c0ae]/50">Victories (Wins)</div>
            <div 
              className="text-2xl font-bold mt-0.5 text-emerald-400"
              style={{ fontFamily: 'var(--font-stat)' }}
            >
              {player.wins}
            </div>
          </div>

          <div 
            className="p-3.5 rounded-2xl text-center"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
            }}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c8c0ae]/50">Defeats (Losses)</div>
            <div 
              className="text-2xl font-bold mt-0.5 text-red-400"
              style={{ fontFamily: 'var(--font-stat)' }}
            >
              {player.losses}
            </div>
          </div>

          <div 
            className="p-3.5 rounded-2xl text-center"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
            }}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c8c0ae]/50">Initial Seed</div>
            <div 
              className="text-2xl font-bold mt-0.5"
              style={{ fontFamily: 'var(--font-stat)', color: 'var(--cg-gold-bright)' }}
            >
              #{player.seed}
            </div>
          </div>
        </div>

        {/* Head to Head / Tournament Match Records */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#c9a84c]" />
            <h3 
              className="text-base font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              Knockout Match Ledger & Encounter Record
            </h3>
          </div>

          {playerMatches.length === 0 ? (
            <div 
              className="p-6 text-center rounded-2xl text-[#c8c0ae]/40 text-xs font-mono"
              style={{
                background: 'rgba(10, 10, 11, 0.5)',
                border: '1px dashed rgba(201, 168, 76, 0.15)',
              }}
            >
              No tournament matches scheduled or played yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {playerMatches.map(m => {
                const isWhite = m.whitePlayerId === player.id;
                const opponentId = isWhite ? m.blackPlayerId : m.whitePlayerId;
                const opponent = opponentId ? playerMap.get(opponentId) : null;
                const isWon = m.winnerPlayerId === player.id;
                const isLost = m.loserPlayerId === player.id;
                const badge = formatResultBadge(m.resultType);

                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl flex items-center justify-between text-xs transition-colors"
                    style={{
                      background: 'rgba(10, 10, 11, 0.65)',
                      border: '1px solid rgba(201, 168, 76, 0.12)',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white" style={{ fontFamily: 'var(--font-sans)' }}>{m.roundName}</span>
                        <span className="text-[10px] text-[#c8c0ae]/60">
                          Playing as <strong className="text-[#e8c45a]">{isWhite ? 'White' : 'Black'}</strong>
                        </span>
                        {m.boardNumber && (
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                            style={{
                              background: 'rgba(201, 168, 76, 0.12)',
                              color: 'var(--cg-gold-bright)',
                              border: '1px solid rgba(201, 168, 76, 0.25)',
                            }}
                          >
                            Board {m.boardNumber}
                          </span>
                        )}
                      </div>

                      <div className="text-[#c8c0ae]/80 mt-1">
                        vs <strong className="text-white">{opponent?.name || 'TBD'}</strong> ({opponent?.rollNumber || '-'}, {opponent?.course || ''})
                      </div>
                      {m.resultDetails && (
                        <div className="text-[11px] text-[#c8c0ae]/50 italic mt-0.5">{m.resultDetails}</div>
                      )}
                    </div>

                    <div className="text-right">
                      {m.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                            style={{
                              background: 'rgba(201, 168, 76, 0.15)',
                              border: '1px solid rgba(201, 168, 76, 0.3)',
                              color: 'var(--cg-gold-bright)'
                            }}
                          >
                            {badge.label}
                          </span>
                          {isWon ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-400 font-mono">
                              <CheckCircle2 className="w-4 h-4" /> WIN
                            </span>
                          ) : isLost ? (
                            <span className="flex items-center gap-1 font-bold text-red-400 font-mono">
                              <XCircle className="w-4 h-4" /> LOSS
                            </span>
                          ) : (
                            <span className="font-bold text-[#c8c0ae]/70 font-mono">DRAW</span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#c8c0ae]/70 text-xs font-mono">
                          {m.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#c9a84c]/20">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Printer className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span>Print Contender Dossier</span>
          </button>

          <button
            onClick={onClose}
            className="cg-btn cg-btn-primary px-6 py-2 rounded-xl text-xs font-bold shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};


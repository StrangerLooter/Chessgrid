import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { 
  History, 
  Search, 
  Download, 
  RotateCcw, 
  Award,
  Printer
} from 'lucide-react';
import { exportMatchesCSV } from '../../utils/exportUtils';
import { formatResultBadge } from '../../utils/formatters';
import { getRoundNames } from '../../utils/bracketEngine';

interface HistoryViewProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenUndoModal: (match: Match) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onOpenMatchModal,
  onOpenUndoModal,
}) => {
  const { 
    matches, 
    players, 
    settings, 
    historyLogs, 
    undoLastAction 
  } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [roundFilter, setRoundFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const roundNames = getRoundNames(settings.totalPlayers);

  const completedMatches = matches.filter(m => m.status === 'completed');

  const filtered = completedMatches.filter(m => {
    const whitePlayer = m.whitePlayerId ? playerMap.get(m.whitePlayerId) : null;
    const blackPlayer = m.blackPlayerId ? playerMap.get(m.blackPlayerId) : null;
    const winnerPlayer = m.winnerPlayerId ? playerMap.get(m.winnerPlayerId) : null;

    const matchesSearch =
      (whitePlayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (blackPlayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (winnerPlayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      m.roundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(m.matchNumber).includes(searchQuery);

    const matchesRound = roundFilter === 'all' || m.roundName === roundFilter;
    const matchesResult = resultFilter === 'all' || m.resultType === resultFilter;

    return matchesSearch && matchesRound && matchesResult;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 80% 0%, rgba(201, 168, 76, 0.12) 0%, rgba(17, 17, 20, 0.95) 70%)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(201, 168, 76, 0.12)',
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  color: 'var(--cg-gold-bright)',
                }}
              >
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 
                    className="text-2xl font-bold tracking-wide"
                    style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
                  >
                    Match History & Results Archive
                  </h2>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: 'rgba(201, 168, 76, 0.15)',
                      color: 'var(--cg-gold-bright)',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {completedMatches.length} Games Concluded
                  </span>
                </div>
                <p className="text-xs text-[#c8c0ae]/60 mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  Chronological, immutable ledger of concluded matches and arbiter rulings
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
            {historyLogs.length > 0 && (
              <button
                onClick={undoLastAction}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontFamily: 'var(--font-sans)',
                }}
                title="Undo Last Recorded Action"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo Last Action</span>
              </button>
            )}

            <button
              onClick={() => exportMatchesCSV(matches, players, settings.name)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                color: 'var(--cg-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.5)';
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)';
                e.currentTarget.style.background = 'rgba(17, 17, 20, 0.8)';
              }}
            >
              <Download className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
                color: 'var(--cg-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.5)';
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)';
                e.currentTarget.style.background = 'rgba(17, 17, 20, 0.8)';
              }}
            >
              <Printer className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8c0ae]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by contender name, ID, or round..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder-[#c8c0ae]/30 focus:outline-none transition-all"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={roundFilter}
            onChange={e => setRoundFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">All Bracket Rounds</option>
            {roundNames.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={resultFilter}
            onChange={e => setResultFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">All Result Types</option>
            <option value="white_win">White Won (1 - 0)</option>
            <option value="black_win">Black Won (0 - 1)</option>
            <option value="draw">Draw (Tie-break)</option>
            <option value="walkover_white">Walkover White</option>
            <option value="walkover_black">Walkover Black</option>
            <option value="disqualification">Disqualified</option>
          </select>
        </div>
      </div>

      {/* Match History Table */}
      <div 
        className="overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.9) 100%)',
          border: '1px solid rgba(201, 168, 76, 0.18)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(10, 10, 11, 0.8)',
                  borderBottom: '1px solid rgba(201, 168, 76, 0.15)',
                  color: 'var(--cg-gold)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <th className="py-4 px-4">Match</th>
                <th className="py-4 px-4">Round</th>
                <th className="py-4 px-4">Board</th>
                <th className="py-4 px-4">White Player</th>
                <th className="py-4 px-4">Black Player</th>
                <th className="py-4 px-4 text-center">Score / Outcome</th>
                <th className="py-4 px-4">Advancing Winner</th>
                <th className="py-4 px-4">Details / Notes</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#c8c0ae]/40" style={{ fontFamily: 'var(--font-sans)' }}>
                    {completedMatches.length === 0 ? 'No matches completed yet.' : 'No matches matching active search filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map(match => {
                  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
                  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;
                  const winnerPlayer = match.winnerPlayerId ? playerMap.get(match.winnerPlayerId) : null;
                  const badge = formatResultBadge(match.resultType);

                  return (
                    <tr 
                      key={match.id} 
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#c9a84c]">
                        #{match.matchNumber}
                      </td>

                      <td className="py-3.5 px-4 font-semibold" style={{ color: 'var(--cg-ivory)', fontFamily: 'var(--font-sans)' }}>
                        {match.roundName}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-emerald-400 font-mono text-xs">
                        Board {match.boardNumber || '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--cg-ivory)' }}>
                          <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block shrink-0 shadow-sm" />
                          <span>{whitePlayer?.name || 'TBD'}</span>
                        </div>
                        <div className="text-[10px] text-[#c8c0ae]/50 font-mono">{whitePlayer?.rollNumber || '-'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--cg-ivory)' }}>
                          <span className="w-2.5 h-2.5 rounded-full bg-black border border-[#c9a84c]/50 inline-block shrink-0 shadow-sm" />
                          <span>{blackPlayer?.name || 'TBD'}</span>
                        </div>
                        <div className="text-[10px] text-[#c8c0ae]/50 font-mono">{blackPlayer?.rollNumber || '-'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span 
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold inline-block"
                          style={{
                            background: match.resultType?.includes('win') ? 'rgba(34, 166, 122, 0.15)' : 'rgba(201, 168, 76, 0.15)',
                            border: match.resultType?.includes('win') ? '1px solid rgba(34, 166, 122, 0.3)' : '1px solid rgba(201, 168, 76, 0.3)',
                            color: match.resultType?.includes('win') ? '#34d399' : 'var(--cg-gold-bright)',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#e8c45a] flex items-center gap-1.5" style={{ fontFamily: 'var(--font-cinematic)', fontSize: '0.95rem' }}>
                          <Award className="w-3.5 h-3.5 text-[#c9a84c]" />
                          <span>{winnerPlayer?.name || '-'}</span>
                        </div>
                        <div className="text-[10px] text-[#c8c0ae]/50 font-mono">{winnerPlayer?.course || ''}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#c8c0ae]/70 max-w-xs truncate text-[11px]">
                        {match.resultDetails || match.notes || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenMatchModal(match)}
                            className="p-1.5 rounded-lg text-[#c8c0ae]/60 hover:text-white hover:bg-white/5 transition-colors"
                            title="View Match Info"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenUndoModal(match)}
                            className="p-1.5 rounded-lg text-[#c8c0ae]/60 hover:text-amber-400 hover:bg-white/5 transition-colors"
                            title="Edit Result or Undo"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


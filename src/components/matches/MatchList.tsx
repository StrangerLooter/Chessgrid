import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player } from '../../types/tournament';
import { MatchCard } from './MatchCard';
import { Swords, Search, Download } from 'lucide-react';
import { exportMatchesCSV } from '../../utils/exportUtils';
import { getRoundNames } from '../../utils/bracketEngine';

interface MatchListProps {
  onOpenMatchModal: (match: Match) => void;
  onOpenResultModal: (match: Match) => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  onOpenMatchModal,
  onOpenResultModal,
}) => {
  const { 
    matches, 
    players, 
    settings, 
    startMatch, 
    pauseMatch, 
    resumeMatch, 
    switchActiveClock 
  } = useTournament();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roundFilter, setRoundFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const roundNames = getRoundNames(settings.totalPlayers);
  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  // Filter matches
  const filteredMatches = matches.filter(m => {
    const whitePlayer = m.whitePlayerId ? playerMap.get(m.whitePlayerId) : null;
    const blackPlayer = m.blackPlayerId ? playerMap.get(m.blackPlayerId) : null;

    const matchesSearch =
      (whitePlayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (blackPlayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      m.roundName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(m.matchNumber).includes(searchQuery) ||
      String(m.boardNumber || '').includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'live' && m.status === 'live') ||
      (statusFilter === 'ready' && m.status === 'ready') ||
      (statusFilter === 'upcoming' && m.status === 'upcoming') ||
      (statusFilter === 'completed' && m.status === 'completed');

    const matchesRound = roundFilter === 'all' || m.roundName === roundFilter;

    return matchesSearch && matchesStatus && matchesRound;
  });

  return (
    <div className="space-y-5">
      
      {/* Header & Controls */}
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
            <Swords className="w-5 h-5" style={{ color: 'var(--cg-gold)' }} />
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
              TOURNAMENT COMBAT SCHEDULE
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
              {matches.length} MATCHES
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'rgba(200, 192, 174, 0.6)',
            }}
          >
            Manage live digital clocks, table allocations, and official scorekeeping
          </p>
        </div>

        <button
          onClick={() => exportMatchesCSV(matches, players, settings.name)}
          className="cg-btn cg-btn-ghost"
          title="Export CSV Match History"
        >
          <Download className="w-4 h-4 text-amber-400" />
          Export Match Log
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by player, board #, or match #..."
            className="w-full pl-10 pr-4 py-2 rounded text-xs text-white focus:outline-none"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded text-xs focus:outline-none"
            style={{
              background: 'rgba(17, 17, 20, 0.8)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <option value="all">All Match Statuses</option>
            <option value="live">Live Matches Only</option>
            <option value="ready">Ready to Start</option>
            <option value="upcoming">Upcoming Queue</option>
            <option value="completed">Concluded Games</option>
          </select>

          {roundNames.length > 0 && (
            <select
              value={roundFilter}
              onChange={e => setRoundFilter(e.target.value)}
              className="px-3 py-2 rounded text-xs focus:outline-none"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                color: 'var(--cg-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="all">All Tournament Rounds</option>
              {roundNames.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div
          className="p-12 text-center rounded"
          style={{
            background: 'rgba(17, 17, 20, 0.6)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
            fontFamily: 'var(--font-sans)',
            color: 'rgba(200, 192, 174, 0.4)',
          }}
        >
          No matches found matching your active filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              players={players}
              onOpenMatchModal={onOpenMatchModal}
              onOpenResultModal={onOpenResultModal}
              onStartMatch={(id) => startMatch(id, match.boardNumber || 1)}
              onPauseMatch={pauseMatch}
              onResumeMatch={resumeMatch}
              onSwitchClock={switchActiveClock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;

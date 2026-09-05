import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  Crown,
  UserMinus,
  Shuffle
} from 'lucide-react';
import { exportPlayersCSV } from '../../utils/exportUtils';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface PlayerTableProps {
  onOpenRegisterModal: () => void;
  onOpenEditModal: (player: Player) => void;
  onOpenProfileModal: (player: Player) => void;
  onOpenBulkImport: () => void;
  onOpenShuffleModal: () => void;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  onOpenRegisterModal,
  onOpenEditModal,
  onOpenProfileModal,
  onOpenBulkImport,
  onOpenShuffleModal,
}) => {
  const { players, settings, stats, deletePlayer } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  // Filter players
  const filteredPlayers = players.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.course.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || p.course === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Extract unique courses for filtering
  const courses = Array.from(new Set(players.map(p => p.course)));

  return (
    <div className="space-y-5">
      
      {/* Registration Progress & Header Control */}
      <div
        className="p-6 rounded"
        style={{
          background: 'rgba(17, 17, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(201, 168, 76, 0.22)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(201, 168, 76, 0.08)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2.5">
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
                CONTENDER REGISTRY POOL
              </h2>
              {stats.isReadyToStart ? (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(34, 166, 122, 0.15)',
                    color: 'var(--cg-emerald-bright)',
                    border: '1px solid rgba(34, 166, 122, 0.4)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  ROSTER READY
                </span>
              ) : (
                <span
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(201, 168, 76, 0.12)',
                    color: 'var(--cg-gold)',
                    border: '1px solid rgba(201, 168, 76, 0.3)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {stats.totalRequired - stats.totalRegistered} SLOTS REMAINING
                </span>
              )}
            </div>

            <p
              className="text-xs mt-1"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'rgba(200, 192, 174, 0.6)',
                letterSpacing: '0.04em',
              }}
            >
              Registered <strong style={{ color: 'var(--cg-gold)' }}>{stats.totalRegistered}</strong> of <strong style={{ color: 'var(--cg-ivory)' }}>{stats.totalRequired}</strong> grandmaster seeds
            </p>

            {/* Registration Progress Bar */}
            <div
              className="w-full sm:w-80 rounded-full h-2 mt-3 overflow-hidden"
              style={{ background: 'rgba(201, 168, 76, 0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (stats.totalRegistered / stats.totalRequired) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--cg-gold-dim), var(--cg-gold), var(--cg-gold-bright))',
                  boxShadow: '0 0 10px rgba(201, 168, 76, 0.5)',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {settings.status === 'setup' && (
              <>
                <button
                  onClick={onOpenRegisterModal}
                  disabled={stats.totalRegistered >= stats.totalRequired}
                  className="cg-btn cg-btn-primary"
                  style={{
                    opacity: stats.totalRegistered >= stats.totalRequired ? 0.4 : 1,
                    cursor: stats.totalRegistered >= stats.totalRequired ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Contender
                </button>

                <button
                  onClick={onOpenBulkImport}
                  className="cg-btn cg-btn-ghost"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  Bulk / IEHE Roster
                </button>

                {stats.isReadyToStart && (
                  <button
                    onClick={onOpenShuffleModal}
                    className="cg-btn cg-btn-emerald"
                  >
                    <Shuffle className="w-4 h-4" />
                    Shuffle & Pairings
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => exportPlayersCSV(players, settings.name)}
              className="cg-btn cg-btn-ghost"
              title="Download CSV Roster"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, or course..."
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
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="eliminated">Eliminated</option>
            <option value="registered">Registered</option>
            <option value="champion">Champion</option>
          </select>

          {courses.length > 0 && (
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="px-3 py-2 rounded text-xs focus:outline-none"
              style={{
                background: 'rgba(17, 17, 20, 0.8)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                color: 'var(--cg-ivory)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Players Data Table */}
      <div
        className="overflow-hidden rounded"
        style={{
          background: 'rgba(17, 17, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 168, 76, 0.18)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
                  background: 'rgba(10, 10, 11, 0.8)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--cg-gold)',
                }}
              >
                <th className="py-3.5 px-4">SEED</th>
                <th className="py-3.5 px-4">PLAYER NAME</th>
                <th className="py-3.5 px-4">ROLL NUMBER</th>
                <th className="py-3.5 px-4">DEPARTMENT / COURSE</th>
                <th className="py-3.5 px-4">YEAR & SEC</th>
                <th className="py-3.5 px-4 text-center">RECORD</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody
              className="text-xs"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center"
                    style={{ color: 'rgba(200, 192, 174, 0.4)' }}
                  >
                    No registered players found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map(player => {
                  let statusBadge = (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: 'rgba(34, 166, 122, 0.12)',
                        color: 'var(--cg-emerald-bright)',
                        border: '1px solid rgba(34, 166, 122, 0.3)',
                      }}
                    >
                      Active
                    </span>
                  );

                  if (player.status === 'champion') {
                    statusBadge = (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: 'rgba(201, 168, 76, 0.2)',
                          color: 'var(--cg-gold-bright)',
                          border: '1px solid rgba(201, 168, 76, 0.5)',
                        }}
                      >
                        <Crown className="w-3 h-3" /> Champion
                      </span>
                    );
                  } else if (player.status === 'eliminated') {
                    statusBadge = (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: 'rgba(192, 57, 43, 0.12)',
                          color: 'var(--cg-red-bright)',
                          border: '1px solid rgba(192, 57, 43, 0.3)',
                        }}
                      >
                        <UserMinus className="w-3 h-3" /> Out ({player.eliminatedInRound || 'R1'})
                      </span>
                    );
                  } else if (player.status === 'registered') {
                    statusBadge = (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          background: 'rgba(201, 168, 76, 0.08)',
                          color: 'rgba(200, 192, 174, 0.6)',
                          border: '1px solid rgba(201, 168, 76, 0.2)',
                        }}
                      >
                        Registered
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={player.id}
                      className="transition-colors"
                      style={{
                        borderBottom: '1px solid rgba(201, 168, 76, 0.08)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td
                        className="py-3.5 px-4 font-bold"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--cg-gold)' }}
                      >
                        #{player.seed}
                      </td>

                      <td className="py-3.5 px-4 font-bold" style={{ color: 'var(--cg-ivory)' }}>
                        <button
                          onClick={() => onOpenProfileModal(player)}
                          className="hover:underline text-left flex items-center gap-2.5"
                        >
                          <div
                            className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs"
                            style={{
                              background: 'rgba(201, 168, 76, 0.15)',
                              border: '1px solid rgba(201, 168, 76, 0.35)',
                              color: 'var(--cg-gold-bright)',
                            }}
                          >
                            {player.name.charAt(0)}
                          </div>
                          <span>{player.name}</span>
                        </button>
                      </td>

                      <td
                        className="py-3.5 px-4 font-mono"
                        style={{ color: 'rgba(200, 192, 174, 0.8)' }}
                      >
                        {player.rollNumber}
                      </td>

                      <td className="py-3.5 px-4" style={{ color: 'rgba(200, 192, 174, 0.8)' }}>
                        {player.course}
                      </td>

                      <td className="py-3.5 px-4" style={{ color: 'rgba(200, 192, 174, 0.55)' }}>
                        {player.year} • Sec {player.section}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-emerald-400 font-mono">{player.wins}W</span>
                        <span className="text-slate-500 mx-1 font-mono">-</span>
                        <span className="font-bold text-red-400 font-mono">{player.losses}L</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {statusBadge}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenProfileModal(player)}
                            className="p-1.5 rounded transition-colors text-slate-400 hover:text-white hover:bg-[rgba(201,168,76,0.15)]"
                            title="View Player Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenEditModal(player)}
                            className="p-1.5 rounded transition-colors text-slate-400 hover:text-amber-300 hover:bg-[rgba(201,168,76,0.15)]"
                            title="Edit Player"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {settings.status === 'setup' && (
                            <button
                              onClick={() => setPlayerToDelete(player)}
                              className="p-1.5 rounded transition-colors text-slate-400 hover:text-red-400 hover:bg-[rgba(192,57,43,0.15)]"
                              title="Delete Player"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Delete Player Confirmation */}
      <ConfirmDialog
        isOpen={playerToDelete !== null}
        title="Remove Player?"
        message={`Are you sure you want to remove ${playerToDelete?.name} (${playerToDelete?.rollNumber}) from the tournament registry?`}
        confirmLabel="Delete Player"
        variant="danger"
        onConfirm={() => {
          if (playerToDelete) deletePlayer(playerToDelete.id);
          setPlayerToDelete(null);
        }}
        onCancel={() => setPlayerToDelete(null)}
      />
    </div>
  );
};

export default PlayerTable;

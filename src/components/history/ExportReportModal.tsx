import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { Printer, X, Award, Crown, Shield } from 'lucide-react';
import { formatFullDate, formatResultBadge } from '../../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const { settings, players, matches, stats } = useTournament();

  if (!isOpen) return null;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-8 overflow-y-auto print:p-0 print:border-none print:bg-white print:text-black"
        style={{
          background: 'linear-gradient(135deg, #111114 0%, #0a0a0b 100%)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(201, 168, 76, 0.1)',
        }}
      >
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#c9a84c]/20 no-print">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: 'var(--cg-gold-bright)',
              }}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
              >
                Official Tournament Scorecard & Ledger
              </h3>
              <p className="text-xs text-[#c8c0ae]/50">
                Institutional certification document and tournament record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="cg-btn cg-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT CONTAINER */}
        <div 
          className="space-y-6 text-slate-200 print:text-black font-sans p-6 sm:p-8 rounded-2xl print:border-none print:p-0"
          style={{
            background: 'rgba(10, 10, 11, 0.75)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-[#c9a84c]/30 print:border-black pb-5">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Shield className="w-5 h-5 text-[#c9a84c] print:hidden" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] print:text-black font-mono">
                Official Institutional Record
              </span>
            </div>
            <h1 
              className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white print:text-black"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              {settings.collegeName}
            </h1>
            <h2 
              className="text-base sm:text-lg font-bold text-[#e8c45a] print:text-black mt-1"
              style={{ fontFamily: 'var(--font-cinematic)' }}
            >
              {settings.departmentName}
            </h2>
            <div className="text-xs font-semibold text-[#c8c0ae]/80 print:text-black mt-1.5">
              {settings.name} • Academic Session: <span className="text-white font-mono print:text-black">{settings.academicSession}</span>
            </div>
            <div className="text-xs text-[#c8c0ae]/60 print:text-black mt-0.5 font-mono">
              Date: {formatFullDate(settings.date)} • Venue: {settings.venue}
            </div>
          </div>

          {/* Champion & Podium Standings */}
          {stats.championPlayer && (
            <div 
              className="p-5 rounded-xl text-center space-y-1.5 relative overflow-hidden print:bg-gray-100 print:border-black"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, rgba(10, 10, 11, 0.8) 100%)',
                border: '1px solid rgba(201, 168, 76, 0.4)',
              }}
            >
              <div 
                className="text-xs font-extrabold uppercase tracking-widest text-[#e8c45a] print:text-black flex items-center justify-center gap-1.5"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                <Crown className="w-4 h-4 text-[#c9a84c]" />
                Tournament Grand Champion
              </div>
              <div 
                className="text-3xl font-black text-white print:text-black tracking-wide"
                style={{ fontFamily: 'var(--font-cinematic)' }}
              >
                {stats.championPlayer.name} ({stats.championPlayer.rollNumber})
              </div>
              <div className="text-xs text-[#c8c0ae]/80 print:text-black font-medium">
                {stats.championPlayer.course} • Undefeated Record: {stats.championPlayer.wins} Victories
              </div>
              {stats.runnerUpPlayer && (
                <div className="text-xs text-[#c8c0ae]/60 print:text-black pt-2 border-t border-[#c9a84c]/20 print:border-gray-300 mt-2">
                  Runner-Up Finalist: <strong className="text-white print:text-black">{stats.runnerUpPlayer.name}</strong> ({stats.runnerUpPlayer.rollNumber}, {stats.runnerUpPlayer.course})
                </div>
              )}
            </div>
          )}

          {/* Standings / Registered Players Table */}
          <div className="space-y-2.5">
            <h3 
              className="text-sm font-bold uppercase tracking-wider text-[#e8c45a] print:text-black border-b border-[#c9a84c]/20 print:border-gray-300 pb-1.5"
              style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1rem' }}
            >
              1. Registered Participants & Final Standings
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/30 print:border-black font-bold text-[#c9a84c] print:text-black text-[10px] uppercase">
                  <th className="py-2 px-2">Seed</th>
                  <th className="py-2 px-2">Contender Name</th>
                  <th className="py-2 px-2">Roll Number</th>
                  <th className="py-2 px-2">Course / Dept</th>
                  <th className="py-2 px-2 text-center">Score</th>
                  <th className="py-2 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {players.map(p => (
                  <tr key={p.id}>
                    <td className="py-1.5 px-2 font-mono font-bold text-[#c9a84c]">#{p.seed}</td>
                    <td className="py-1.5 px-2 font-bold text-white print:text-black">{p.name}</td>
                    <td className="py-1.5 px-2 font-mono text-[#c8c0ae]/70">{p.rollNumber}</td>
                    <td className="py-1.5 px-2 text-[#c8c0ae]/80">{p.course} ({p.year})</td>
                    <td className="py-1.5 px-2 text-center font-semibold text-emerald-400 font-mono">{p.wins}W - {p.losses}L</td>
                    <td className="py-1.5 px-2 text-right font-semibold capitalize font-mono text-xs">
                      {p.status === 'champion' ? '🏆 Champion' : p.status === 'eliminated' ? `Out in ${p.eliminatedInRound || 'R1'}` : p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Completed Matches Summary */}
          <div className="space-y-2.5">
            <h3 
              className="text-sm font-bold uppercase tracking-wider text-[#e8c45a] print:text-black border-b border-[#c9a84c]/20 print:border-gray-300 pb-1.5"
              style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1rem' }}
            >
              2. Official Knockout Results Log
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/30 print:border-black font-bold text-[#c9a84c] print:text-black text-[10px] uppercase">
                  <th className="py-2 px-2">Match</th>
                  <th className="py-2 px-2">Round</th>
                  <th className="py-2 px-2">White Player</th>
                  <th className="py-2 px-2">Black Player</th>
                  <th className="py-2 px-2 text-center">Result</th>
                  <th className="py-2 px-2">Winner</th>
                  <th className="py-2 px-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {completedMatches.map(m => {
                  const white = m.whitePlayerId ? playerMap.get(m.whitePlayerId) : null;
                  const black = m.blackPlayerId ? playerMap.get(m.blackPlayerId) : null;
                  const winner = m.winnerPlayerId ? playerMap.get(m.winnerPlayerId) : null;
                  const badge = formatResultBadge(m.resultType);

                  return (
                    <tr key={m.id}>
                      <td className="py-1.5 px-2 font-mono text-[#c9a84c]">#{m.matchNumber}</td>
                      <td className="py-1.5 px-2 font-semibold text-white print:text-black">{m.roundName}</td>
                      <td className="py-1.5 px-2">{white?.name || 'TBD'}</td>
                      <td className="py-1.5 px-2">{black?.name || 'TBD'}</td>
                      <td className="py-1.5 px-2 text-center font-bold font-mono text-[#e8c45a] print:text-black">{badge.label}</td>
                      <td className="py-1.5 px-2 font-bold text-emerald-400 print:text-black">{winner?.name || '-'}</td>
                      <td className="py-1.5 px-2 text-[#c8c0ae]/60 print:text-black text-[11px]">{m.resultDetails || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Certification & Signature Block */}
          <div className="pt-10 mt-8 border-t border-[#c9a84c]/30 print:border-black flex items-center justify-between text-xs">
            <div className="text-center space-y-1">
              <div className="w-52 border-b border-[#c9a84c]/40 print:border-black pb-1.5 mb-1 font-bold text-white print:text-black" style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1rem' }}>
                {settings.organizerName}
              </div>
              <div className="text-[#e8c45a] print:text-black font-semibold">Chief Arbiter / Coordinator</div>
              <div className="text-[10px] text-[#c8c0ae]/50 print:text-black">IEHE Chess Tournament Committee</div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-52 border-b border-[#c9a84c]/40 print:border-black pb-1.5 mb-1 font-bold text-white print:text-black" style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1rem' }}>
                Head of Department
              </div>
              <div className="text-[#e8c45a] print:text-black font-semibold">{settings.departmentName}</div>
              <div className="text-[10px] text-[#c8c0ae]/50 print:text-black">{settings.collegeName}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


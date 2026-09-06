import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player, ResultType, TieBreakMethod, TieBreakInfo } from '../../types/tournament';
import { Award, CheckCircle2, Swords, X } from 'lucide-react';

interface ResultEntryModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResultEntryModal: React.FC<ResultEntryModalProps> = ({
  match,
  isOpen,
  onClose,
}) => {
  const { players, recordResult } = useTournament();

  const [selectedResult, setSelectedResult] = useState<ResultType>('white_win');
  const [winMethod, setWinMethod] = useState('Checkmate');
  const [tieBreakMethod, setTieBreakMethod] = useState<TieBreakMethod>('armageddon');
  const [tieBreakWinnerId, setTieBreakWinnerId] = useState<string>('');
  const [customDetails, setCustomDetails] = useState('');

  if (!isOpen || !match) return null;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    let details = winMethod;
    if (customDetails.trim()) {
      details += ` - ${customDetails.trim()}`;
    }

    let tieBreakInfo: TieBreakInfo | undefined;
    if (selectedResult === 'draw') {
      const winnerId = tieBreakWinnerId || (whitePlayer ? whitePlayer.id : '');
      tieBreakInfo = {
        method: tieBreakMethod,
        winnerId,
        details: `Decided via ${tieBreakMethod.toUpperCase()} tie-break (${playerMap.get(winnerId)?.name} advanced)`,
        timestamp: new Date().toISOString(),
      };
      details = `Draw (${tieBreakInfo.details})`;
    }

    recordResult(match.id, selectedResult, details, tieBreakInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
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

        <div className="flex items-center gap-3.5 mb-5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              Record Arbiter Verdict & Result
            </h3>
            <p className="text-xs text-[#c8c0ae]/60 font-mono">
              {match.roundName} • Match #{match.matchNumber} {match.boardNumber ? `• Board ${match.boardNumber}` : ''}
            </p>
          </div>
        </div>

        {/* Player Matchup Banner */}
        <div 
          className="grid grid-cols-2 gap-3 p-4 rounded-2xl mb-5"
          style={{
            background: 'rgba(10, 10, 11, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block shrink-0 shadow-sm" />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{whitePlayer?.name || 'White'}</div>
              <div className="text-[11px] text-[#c8c0ae]/50 truncate font-mono">{whitePlayer?.rollNumber || '-'}</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 truncate text-right">
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{blackPlayer?.name || 'Black'}</div>
              <div className="text-[11px] text-[#c8c0ae]/50 truncate font-mono">{blackPlayer?.rollNumber || '-'}</div>
            </div>
            <span className="w-3 h-3 rounded-full bg-black border border-[#c9a84c]/50 inline-block shrink-0 shadow-sm" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Outcome Choice Radio Grid */}
          <div>
            <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Select Official Outcome *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* White Wins */}
              <button
                type="button"
                onClick={() => setSelectedResult('white_win')}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'white_win' ? 'rgba(34, 166, 122, 0.18)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'white_win' ? '#34d399' : 'rgba(201, 168, 76, 0.15)',
                  boxShadow: selectedResult === 'white_win' ? '0 0 15px rgba(34, 166, 122, 0.2)' : 'none',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">1 - 0: {whitePlayer?.name || 'White'} Wins</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">White advances to next round</div>
                </div>
                {selectedResult === 'white_win' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>

              {/* Black Wins */}
              <button
                type="button"
                onClick={() => setSelectedResult('black_win')}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'black_win' ? 'rgba(34, 166, 122, 0.18)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'black_win' ? '#34d399' : 'rgba(201, 168, 76, 0.15)',
                  boxShadow: selectedResult === 'black_win' ? '0 0 15px rgba(34, 166, 122, 0.2)' : 'none',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">0 - 1: {blackPlayer?.name || 'Black'} Wins</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">Black advances to next round</div>
                </div>
                {selectedResult === 'black_win' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>

              {/* Draw with Tie Break */}
              <button
                type="button"
                onClick={() => {
                  setSelectedResult('draw');
                  if (!tieBreakWinnerId && whitePlayer) setTieBreakWinnerId(whitePlayer.id);
                }}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'draw' ? 'rgba(201, 168, 76, 0.2)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'draw' ? 'var(--cg-gold-bright)' : 'rgba(201, 168, 76, 0.15)',
                  boxShadow: selectedResult === 'draw' ? '0 0 15px rgba(201, 168, 76, 0.25)' : 'none',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">½ - ½: Draw (Tie-Break Playoff)</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">Requires sudden death / Armageddon</div>
                </div>
                {selectedResult === 'draw' && <CheckCircle2 className="w-4 h-4 text-[#e8c45a] shrink-0" />}
              </button>

              {/* Walkover White */}
              <button
                type="button"
                onClick={() => setSelectedResult('walkover_white')}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'walkover_white' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'walkover_white' ? '#60a5fa' : 'rgba(201, 168, 76, 0.15)',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">Walkover (Black Forfeit)</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">1-0 W/O awarded to White</div>
                </div>
                {selectedResult === 'walkover_white' && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
              </button>

              {/* Walkover Black */}
              <button
                type="button"
                onClick={() => setSelectedResult('walkover_black')}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'walkover_black' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'walkover_black' ? '#60a5fa' : 'rgba(201, 168, 76, 0.15)',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">Walkover (White Forfeit)</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">0-1 W/O awarded to Black</div>
                </div>
                {selectedResult === 'walkover_black' && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
              </button>

              {/* Disqualification */}
              <button
                type="button"
                onClick={() => setSelectedResult('disqualification')}
                className="p-3 rounded-xl border text-left flex items-center justify-between transition-all"
                style={{
                  background: selectedResult === 'disqualification' ? 'rgba(220, 38, 38, 0.18)' : 'rgba(10, 10, 11, 0.65)',
                  borderColor: selectedResult === 'disqualification' ? '#f87171' : 'rgba(201, 168, 76, 0.15)',
                }}
              >
                <div>
                  <div className="text-xs font-bold text-white">Disqualification (Rule Breach)</div>
                  <div className="text-[10px] text-[#c8c0ae]/50">Arbiter disciplinary ruling</div>
                </div>
                {selectedResult === 'disqualification' && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Special Draw Tie-Break Box if Draw Selected */}
          {selectedResult === 'draw' && (
            <div 
              className="p-4 rounded-2xl space-y-3 animate-in fade-in duration-200"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, rgba(10, 10, 11, 0.9) 100%)',
                border: '1px solid rgba(201, 168, 76, 0.35)',
              }}
            >
              <div className="text-xs font-bold text-[#e8c45a] flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-[#c9a84c]" />
                Knockout Tie-Break Decision
              </div>
              <p className="text-[11px] text-[#c8c0ae]/70">
                In a single-elimination knockout format, one contender must advance. Choose the tie-break method and declare the advancing victor:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#c8c0ae]/80 mb-1">Tie-Break Method</label>
                  <select
                    value={tieBreakMethod}
                    onChange={e => setTieBreakMethod(e.target.value as TieBreakMethod)}
                    className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-all"
                    style={{
                      background: 'rgba(10, 10, 11, 0.8)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      color: 'var(--cg-ivory)',
                    }}
                  >
                    <option value="armageddon">Armageddon Match (5m vs 4m + Draw Odds)</option>
                    <option value="blitz">Blitz Sudden Death (3m + 2s)</option>
                    <option value="rapid">Rapid Playoff Match (10m + 5s)</option>
                    <option value="organizer_decision">Chief Arbiter / Organizer Verdict</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#c8c0ae]/80 mb-1">Advancing Winner</label>
                  <select
                    value={tieBreakWinnerId || (whitePlayer?.id || '')}
                    onChange={e => setTieBreakWinnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition-all"
                    style={{
                      background: 'rgba(10, 10, 11, 0.8)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      color: 'var(--cg-ivory)',
                    }}
                  >
                    {whitePlayer && <option value={whitePlayer.id}>{whitePlayer.name} (White)</option>}
                    {blackPlayer && <option value={blackPlayer.id}>{blackPlayer.name} (Black)</option>}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Win Method & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Decisive Method / Factor
              </label>
              <select
                value={winMethod}
                onChange={e => setWinMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                }}
              >
                <option value="Checkmate">Checkmate</option>
                <option value="Resignation">Resignation</option>
                <option value="Time Out (Flag Fall)">Time Out (Flag Fall)</option>
                <option value="Illegal Move (3 strikes)">Illegal Move (3 strikes)</option>
                <option value="Touch-Move Forfeit">Touch-Move Forfeit</option>
                <option value="Walkover">Walkover / Absence</option>
                <option value="Mutual Agreement">Mutual Agreement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Arbiter Notes / Moves (Optional)
              </label>
              <input
                type="text"
                value={customDetails}
                onChange={e => setCustomDetails(e.target.value)}
                placeholder="e.g. Move 34 Sicilian Defense"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c9a84c]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cg-btn cg-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Verdict & Advance Winner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


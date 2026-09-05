import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Match, Player, ResultType } from '../../types/tournament';
import { AlertTriangle, RotateCcw, X, ShieldAlert } from 'lucide-react';

interface UndoResultModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UndoResultModal: React.FC<UndoResultModalProps> = ({ match, isOpen, onClose }) => {
  const { undoOrRepairResult, players } = useTournament();
  const [selectedAction, setSelectedAction] = useState<'undo_to_ready' | 'modify_winner'>('undo_to_ready');
  const [newResult, setNewResult] = useState<ResultType>('black_win');

  if (!isOpen || !match) return null;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const whitePlayer = match.whitePlayerId ? playerMap.get(match.whitePlayerId) : null;
  const blackPlayer = match.blackPlayerId ? playerMap.get(match.blackPlayerId) : null;
  const currentWinner = match.winnerPlayerId ? playerMap.get(match.winnerPlayerId) : null;

  const handleApply = () => {
    if (selectedAction === 'undo_to_ready') {
      undoOrRepairResult(match.id, null);
    } else {
      undoOrRepairResult(match.id, newResult);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-7"
        style={{
          background: 'linear-gradient(135deg, #131317 0%, #0a0a0b 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.15)',
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
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              Arbiter Result Correction & Repair
            </h3>
            <p className="text-xs text-[#c8c0ae]/60 font-mono">
              {match.roundName} • Match #{match.matchNumber}
            </p>
          </div>
        </div>

        {/* Current Result Info */}
        <div 
          className="p-3.5 rounded-xl mb-4 text-xs space-y-1"
          style={{
            background: 'rgba(10, 10, 11, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div className="text-[#c8c0ae]/60">Currently Recorded Advancing Winner:</div>
          <div 
            className="text-base font-bold text-[#e8c45a]"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            {currentWinner?.name || 'Unknown'} ({match.resultType})
          </div>
        </div>

        {/* Safety Warning */}
        <div 
          className="p-3.5 rounded-xl text-xs text-amber-300 mb-5 flex items-start gap-2.5"
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
          }}
        >
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Changing or undoing this result will automatically heal the bracket graph. Any downstream matches previously occupied by <strong>{currentWinner?.name}</strong> will be cleanly reset.
          </p>
        </div>

        {/* Choice of Correction */}
        <div className="space-y-3 mb-6">
          <label
            onClick={() => setSelectedAction('undo_to_ready')}
            className="p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all"
            style={{
              background: selectedAction === 'undo_to_ready' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(10, 10, 11, 0.65)',
              borderColor: selectedAction === 'undo_to_ready' ? '#fbbf24' : 'rgba(201, 168, 76, 0.15)',
            }}
          >
            <input
              type="radio"
              checked={selectedAction === 'undo_to_ready'}
              onChange={() => setSelectedAction('undo_to_ready')}
              className="text-amber-500"
            />
            <div>
              <div className="text-xs font-bold text-white">Reset Match to "Ready to Play"</div>
              <div className="text-[10px] text-[#c8c0ae]/50">Wipe result so game can be replayed or re-clocked</div>
            </div>
          </label>

          <label
            onClick={() => setSelectedAction('modify_winner')}
            className="p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all"
            style={{
              background: selectedAction === 'modify_winner' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(10, 10, 11, 0.65)',
              borderColor: selectedAction === 'modify_winner' ? '#fbbf24' : 'rgba(201, 168, 76, 0.15)',
            }}
          >
            <input
              type="radio"
              checked={selectedAction === 'modify_winner'}
              onChange={() => setSelectedAction('modify_winner')}
              className="text-amber-500"
            />
            <div>
              <div className="text-xs font-bold text-white">Switch to Opposite Winner</div>
              <div className="text-[10px] text-[#c8c0ae]/50">Flip recorded outcome if the wrong player was designated</div>
            </div>
          </label>

          {selectedAction === 'modify_winner' && (
            <div className="pl-6 pt-1">
              <select
                value={newResult || 'black_win'}
                onChange={e => setNewResult(e.target.value as ResultType)}
                className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{
                  background: 'rgba(10, 10, 11, 0.8)',
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  color: 'var(--cg-ivory)',
                }}
              >
                <option value="white_win">White ({whitePlayer?.name}) Wins</option>
                <option value="black_win">Black ({blackPlayer?.name}) Wins</option>
                <option value="walkover_white">Walkover to White</option>
                <option value="walkover_black">Walkover to Black</option>
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c9a84c]/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Apply Correction & Heal Bracket</span>
          </button>
        </div>
      </div>
    </div>
  );
};


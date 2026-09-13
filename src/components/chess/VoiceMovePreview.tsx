import React from 'react';
import type { VoiceMovePreview as IVoiceMovePreview } from '../../services/speech/types';
import { Check, X, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { ChessPieceSvg } from './ChessPieceSvg';

interface VoiceMovePreviewProps {
  previewMove: IVoiceMovePreview | null;
  ambiguousCandidates?: IVoiceMovePreview[];
  isConfirmingResign?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSelectCandidate?: (candidate: IVoiceMovePreview) => void;
  className?: string;
}

export const VoiceMovePreview: React.FC<VoiceMovePreviewProps> = ({
  previewMove,
  ambiguousCandidates = [],
  isConfirmingResign = false,
  onConfirm,
  onCancel,
  onSelectCandidate,
  className = '',
}) => {
  // 1. Resignation Confirmation Dialog
  if (isConfirmingResign) {
    return (
      <div
        className={`w-full max-w-[560px] p-4 rounded-xl border border-red-500/50 bg-gradient-to-r from-red-950/80 via-[#18181d] to-black/90 shadow-[0_0_30px_rgba(239,68,68,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/20 border border-red-500/40 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-red-300 uppercase tracking-wider">
              Resign this game?
            </h4>
            <p className="text-[11px] font-sans text-slate-300">
              Say <span className="font-mono text-red-200 font-bold">"Confirm"</span> or click below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white/15 text-slate-200 transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all cursor-pointer"
          >
            CONFIRM RESIGN
          </button>
        </div>
      </div>
    );
  }

  // 2. Ambiguous Candidates Selector
  if (ambiguousCandidates.length > 0) {
    return (
      <div
        className={`w-full max-w-[560px] p-4 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-[#18181d] to-black/90 shadow-[0_0_25px_rgba(201,168,76,0.2)] space-y-3 animate-in fade-in zoom-in-95 ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              Ambiguous Move Detected
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Multiple pieces can make this move. Choose which one to play:
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {ambiguousCandidates.map((candidate, idx) => (
            <button
              key={idx}
              onClick={() => onSelectCandidate?.(candidate)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer"
            >
              <div className="w-4 h-4">
                <ChessPieceSvg type={candidate.piece} color={candidate.color} />
              </div>
              <span>
                {candidate.from} → {candidate.to} ({candidate.san})
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. Single Candidate Move Preview Confirmation
  if (!previewMove) return null;

  return (
    <div
      className={`w-full max-w-[560px] p-3.5 sm:p-4 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/70 via-[#18181d] to-black/90 shadow-[0_0_30px_rgba(34,166,122,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 animate-in fade-in zoom-in-95 ${className}`}
    >
      {/* Candidate Move Description */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/60 border border-emerald-500/40 p-1">
          <ChessPieceSvg type={previewMove.piece} color={previewMove.color} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
              Move Detected
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {previewMove.san}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-base sm:text-lg font-mono font-bold text-slate-100 mt-0.5">
            <span className="text-amber-300">{previewMove.from.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-emerald-300">{previewMove.to.toUpperCase()}</span>
            {previewMove.promotion && (
              <span className="text-xs font-mono text-purple-300 uppercase">
                (= {previewMove.promotion})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={onCancel}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
          title="Cancel this move"
        >
          <X className="w-3.5 h-3.5" />
          <span>CANCEL</span>
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(34,166,122,0.4)] border border-emerald-400 transition-all cursor-pointer"
          title="Confirm and play this move"
        >
          <Check className="w-4 h-4" />
          <span>CONFIRM</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceMovePreview;

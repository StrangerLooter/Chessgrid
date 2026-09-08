import React from 'react';
import type { EngineEvaluation } from '../../services/chessEngine';

interface EvaluationBarProps {
  evaluation: EngineEvaluation | null;
  isFlipped?: boolean;
  className?: string;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluation,
  isFlipped = false,
  className = '',
}) => {
  // Compute percentage for White advantage (0% = Black winning, 50% = equal, 100% = White winning)
  const getWhiteAdvantagePercent = (): number => {
    if (!evaluation) return 50;

    if (evaluation.isMate && evaluation.mateIn !== undefined) {
      return evaluation.mateIn > 0 ? 100 : 0;
    }

    const score = evaluation.score; // Centipawns from White perspective
    // Sigmoid mapping for smooth bar visual
    const evalPawns = score / 100;
    const clamped = Math.max(-10, Math.min(10, evalPawns));
    return 50 + (clamped / 10) * 45;
  };

  const whitePct = getWhiteAdvantagePercent();
  const blackPct = 100 - whitePct;

  // Format evaluation text
  const getEvalText = (): string => {
    if (!evaluation) return '0.0';
    if (evaluation.isMate && evaluation.mateIn !== undefined) {
      return `M${Math.abs(evaluation.mateIn)}`;
    }
    const val = (evaluation.score / 100).toFixed(1);
    return evaluation.score > 0 ? `+${val}` : val;
  };

  const evalText = getEvalText();
  const isWhiteFavored = (evaluation?.score ?? 0) >= 0;

  return (
    <div
      className={`relative w-7 sm:w-8 h-full rounded-full overflow-hidden flex flex-col justify-between p-1 select-none border border-amber-500/30 shadow-[0_0_15px_rgba(0,0,0,0.8)] ${className}`}
      style={{
        background: '#0e0e12',
        minHeight: '280px',
      }}
      title={`Engine Evaluation: ${evalText} | Depth: ${evaluation?.depth || 0}`}
    >
      {/* Black Section (Top by default) */}
      <div
        className="w-full rounded-t-full transition-all duration-500 ease-out flex items-start justify-center pt-1"
        style={{
          height: `${isFlipped ? whitePct : blackPct}%`,
          background: 'linear-gradient(180deg, #181820 0%, #0a0a0d 100%)',
        }}
      >
        {!isWhiteFavored && (
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-red-400">
            {evalText}
          </span>
        )}
      </div>

      {/* Thin Midpoint Line */}
      <div className="w-full h-[1px] bg-amber-500/40 shrink-0" />

      {/* White Section (Bottom by default) */}
      <div
        className="w-full rounded-b-full transition-all duration-500 ease-out flex items-end justify-center pb-1"
        style={{
          height: `${isFlipped ? blackPct : whitePct}%`,
          background: 'linear-gradient(180deg, #ffffff 0%, #e2d9c5 100%)',
          boxShadow: '0 0 10px rgba(255,255,255,0.4)',
        }}
      >
        {isWhiteFavored && (
          <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neutral-900">
            {evalText}
          </span>
        )}
      </div>
    </div>
  );
};

export default EvaluationBar;

import React, { useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Trophy, Sparkles, X, Printer, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatFullDate } from '../../utils/formatters';

interface ChampionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChampionModal: React.FC<ChampionModalProps> = ({ isOpen, onClose }) => {
  const { stats, settings, matches } = useTournament();
  const champion = stats.championPlayer;
  const runnerUp = stats.runnerUpPlayer;

  useEffect(() => {
    if (isOpen && champion) {
      // Fire celebratory confetti bursts
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen, champion]);

  if (!isOpen || !champion) return null;

  const totalMatches = matches.filter(m => m.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          background: 'linear-gradient(135deg, #16161b 0%, #0a0a0b 100%)',
          border: '1px solid rgba(201, 168, 76, 0.45)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 50px rgba(201, 168, 76, 0.2)',
        }}
      >
        
        {/* Glow ambient effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c9a84c]/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center relative z-10">
          {/* Trophy Header */}
          <div 
            className="inline-flex p-5 rounded-3xl text-[#e8c45a] shadow-2xl mb-4 animate-bounce-slow"
            style={{
              background: 'radial-gradient(circle at center, rgba(201, 168, 76, 0.25) 0%, rgba(10, 10, 11, 0.9) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.4)',
              boxShadow: '0 0 30px rgba(201, 168, 76, 0.3)',
            }}
          >
            <Trophy className="w-14 h-14 drop-shadow-[0_0_20px_rgba(201,168,76,0.6)]" />
          </div>

          <div 
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 font-mono"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.35)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tournament Grand Champion
          </div>

          <h2 
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-cinematic)' }}
          >
            {champion.name}
          </h2>
          <p className="text-sm font-medium text-[#e8c45a] mt-1 font-mono">
            {champion.rollNumber} • {champion.course} ({champion.year})
          </p>

          <p className="text-xs text-[#c8c0ae]/60 mt-1.5">
            {settings.collegeName} • {settings.departmentName}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div 
              className="p-3.5 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(34, 166, 122, 0.25)',
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c8c0ae]/50">Victories</div>
              <div className="text-2xl font-bold text-emerald-400 mt-0.5" style={{ fontFamily: 'var(--font-stat)' }}>
                {champion.wins}
              </div>
            </div>
            <div 
              className="p-3.5 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c8c0ae]/50">Seed Rank</div>
              <div className="text-2xl font-bold text-[#e8c45a] mt-0.5" style={{ fontFamily: 'var(--font-stat)' }}>
                #{champion.seed}
              </div>
            </div>
            <div 
              className="p-3.5 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c8c0ae]/50">Total Matches</div>
              <div className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'var(--font-stat)' }}>
                {totalMatches}
              </div>
            </div>
            <div 
              className="p-3.5 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 11, 0.7)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#c8c0ae]/50">Date</div>
              <div className="text-xs font-bold text-[#c8c0ae] mt-1.5 font-mono">
                {formatFullDate(settings.date)}
              </div>
            </div>
          </div>

          {/* Runner Up Pod */}
          {runnerUp && (
            <div 
              className="flex items-center justify-between p-3.5 rounded-2xl text-left mb-6"
              style={{
                background: 'rgba(10, 10, 11, 0.65)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl text-slate-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Medal className="w-5 h-5 text-[#c8c0ae]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#c8c0ae]/60">Runner-Up Finalist (2nd Place)</div>
                  <div className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.05rem' }}>
                    {runnerUp.name} ({runnerUp.rollNumber})
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#c8c0ae]/80 font-mono">
                {runnerUp.course}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                window.print();
              }}
              className="cg-btn cg-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-transform"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Certificate & Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[#c8c0ae]/70 hover:text-white font-medium text-xs transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Return to Dashboard
            </button>
          </div>

          <div className="mt-5 text-[11px] text-[#c8c0ae]/50 font-mono">
            Certified by Chief Arbiter: <strong className="text-white">{settings.organizerName}</strong> (Tournament Arbiter / Director)
          </div>
        </div>
      </div>
    </div>
  );
};


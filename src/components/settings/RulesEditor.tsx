import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { BookOpen, Save, ShieldCheck } from 'lucide-react';

export const RulesEditor: React.FC = () => {
  const { settings, updateSettings } = useTournament();
  const [rulesText, setRulesText] = useState(settings.rulesText);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ rulesText });
  };

  return (
    <div 
      className="p-6 rounded-2xl space-y-4"
      style={{
        background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.9) 100%)',
        border: '1px solid rgba(201, 168, 76, 0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(201, 168, 76, 0.15)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            color: 'var(--cg-gold-bright)',
          }}
        >
          <BookOpen className="w-4 h-4" />
        </div>
        <h3 
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
        >
          Official Tournament Rules & Arbiter Codex
        </h3>
      </div>
      <p className="text-xs text-[#c8c0ae]/60" style={{ fontFamily: 'var(--font-sans)' }}>
        Edit official guidelines, touch-move policies, and tie-break rules reflected in tournament certificates and scorecards:
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <textarea
          rows={8}
          value={rulesText}
          onChange={e => setRulesText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-xs leading-relaxed focus:outline-none transition-all font-mono"
          style={{
            background: 'rgba(10, 10, 11, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            color: 'var(--cg-ivory)',
          }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-[#c8c0ae]/50 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c9a84c]" />
            Certified by Chief Arbiter: <strong className="text-white ml-0.5">{settings.organizerName}</strong>
          </span>

          <button
            type="submit"
            className="cg-btn cg-btn-primary flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md self-stretch sm:self-auto justify-center"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Update Tournament Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};


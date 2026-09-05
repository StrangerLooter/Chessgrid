import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTournament();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-[#e8c45a]" />;
        let borderStyle = 'border-[rgba(201,168,76,0.3)] bg-[#111114]/95 text-slate-100';

        if (toast.type === 'success') {
          icon = <CheckCircle className="w-5 h-5 text-emerald-400" />;
          borderStyle = 'border-[rgba(34,166,122,0.35)] bg-[#111114]/95 text-slate-100';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-amber-400" />;
          borderStyle = 'border-[rgba(245,158,11,0.35)] bg-[#111114]/95 text-slate-100';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-red-400" />;
          borderStyle = 'border-[rgba(239,68,68,0.35)] bg-[#111114]/95 text-slate-100';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borderStyle}`}
            style={{
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div 
                className="font-bold text-sm leading-tight text-white"
                style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1rem' }}
              >
                {toast.title}
              </div>
              <div className="text-xs text-[#c8c0ae]/70 mt-0.5 leading-snug break-words" style={{ fontFamily: 'var(--font-sans)' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-[#c8c0ae]/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};


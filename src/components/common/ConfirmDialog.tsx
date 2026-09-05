import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  let btnStyle = {
    background: 'linear-gradient(135deg, var(--cg-gold) 0%, var(--cg-gold-dim) 100%)',
    color: '#0a0a0b',
  };

  if (variant === 'danger') {
    btnStyle = {
      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      color: '#ffffff',
    };
  } else if (variant === 'warning') {
    btnStyle = {
      background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
      color: '#0a0a0b',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 rounded-3xl text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150"
        style={{
          background: 'linear-gradient(135deg, #131317 0%, #0a0a0b 100%)',
          border: '1px solid rgba(201, 168, 76, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(201, 168, 76, 0.12)',
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: variant === 'danger' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(201, 168, 76, 0.15)',
              border: variant === 'danger' ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(201, 168, 76, 0.3)',
              color: variant === 'danger' ? '#f87171' : 'var(--cg-gold-bright)',
            }}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 
              className="text-lg font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              {title}
            </h3>
            <p className="text-xs text-[#c8c0ae]/70 mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#c9a84c]/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-5 py-2 text-xs font-bold rounded-xl shadow-lg transition-all"
            style={btnStyle}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};


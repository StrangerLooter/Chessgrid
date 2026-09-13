import React from 'react';
import type { VoiceState, VoiceListenMode, VoiceError } from '../../services/speech/types';
import { VoiceStatus } from './VoiceStatus';
import { Mic, MicOff, Radio, HandMetal, Info, AlertTriangle } from 'lucide-react';

interface VoiceControlProps {
  isSupported: boolean;
  enabled: boolean;
  status: VoiceState;
  listenMode: VoiceListenMode;
  isPushToTalkActive: boolean;
  transcript: string;
  feedbackMessage: string | null;
  error: VoiceError | null;
  onToggleEnabled: () => void;
  onSetListenMode: (mode: VoiceListenMode) => void;
  onStartPushToTalk: () => void;
  onStopPushToTalk: () => void;
  className?: string;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  isSupported,
  enabled,
  status,
  listenMode,
  isPushToTalkActive,
  transcript,
  feedbackMessage,
  error,
  onToggleEnabled,
  onSetListenMode,
  onStartPushToTalk,
  onStopPushToTalk,
  className = '',
}) => {
  if (!isSupported) {
    return (
      <div className={`p-4 rounded-xl glass-panel border border-white/10 space-y-2 text-slate-400 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <MicOff className="w-4 h-4 text-slate-500" />
            <span>VOICE CONTROL</span>
          </div>
          <VoiceStatus status="UNSUPPORTED" />
        </div>
        <p className="text-xs text-slate-500">
          Speech recognition is not supported in this browser. Standard mouse and touch controls remain active.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl glass-panel border border-amber-500/20 space-y-3 ${className}`}>
      {/* ── Header: Title + Status + Master Toggle ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${enabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(34,166,122,0.8)]' : 'bg-slate-600'}`} />
          <span
            className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Voice Control
          </span>
          <VoiceStatus status={status} />
        </div>

        {/* Master ON/OFF Switch */}
        <button
          onClick={onToggleEnabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/50 ${
            enabled ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-white/10'
          }`}
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle Voice Control"
          title={enabled ? 'Turn Voice Control Off' : 'Turn Voice Control On'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* ── Expanded Voice Options when Enabled ── */}
      {enabled && (
        <div className="space-y-3 pt-1 border-t border-white/5 animate-in fade-in duration-200">
          {/* Mode Selector: Continuous vs Push-to-Talk */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-black/40 border border-white/5">
            <button
              onClick={() => onSetListenMode('continuous')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                listenMode === 'continuous'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>Continuous</span>
            </button>

            <button
              onClick={() => onSetListenMode('push_to_talk')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                listenMode === 'push_to_talk'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HandMetal className="w-3 h-3" />
              <span>Push-to-Talk</span>
            </button>
          </div>

          {/* Push-to-Talk Button (when in push_to_talk mode) */}
          {listenMode === 'push_to_talk' && (
            <div className="pt-1">
              <button
                onMouseDown={onStartPushToTalk}
                onMouseUp={onStopPushToTalk}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onStartPushToTalk();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onStopPushToTalk();
                }}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 select-none cursor-pointer transition-all active:scale-95 shadow-md ${
                  isPushToTalkActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_20px_rgba(34,166,122,0.5)] border border-emerald-400'
                    : 'bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30'
                }`}
              >
                <Mic className={`w-4 h-4 ${isPushToTalkActive ? 'animate-bounce' : ''}`} />
                <span>{isPushToTalkActive ? 'LISTENING... RELEASE WHEN DONE' : 'HOLD TO SPEAK MOVE'}</span>
              </button>
            </div>
          )}

          {/* Latest Spoken Transcript */}
          {transcript && (
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 flex items-start gap-2">
              <Mic className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Heard</span>
                <span className="text-xs font-mono text-slate-100 break-words font-medium">"{transcript}"</span>
              </div>
            </div>
          )}

          {/* Feedback or Command Guidance */}
          {feedbackMessage ? (
            <div className="text-[11px] font-mono text-amber-300/90 flex items-center gap-1.5 px-1">
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 px-1">
              <span>Try: "Knight to f3", "e4", "Castle kingside", "Takes c4"</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceControl;

import React from 'react';
import type { VoiceState } from '../../services/speech/types';
import { Mic, MicOff, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface VoiceStatusProps {
  status: VoiceState;
  className?: string;
}

export const VoiceStatus: React.FC<VoiceStatusProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'OFF':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/5 text-slate-400 border border-white/10 ${className}`}>
          <MicOff className="w-3 h-3 opacity-60" />
          <span>VOICE OFF</span>
        </span>
      );

    case 'READY':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>READY</span>
        </span>
      );

    case 'LISTENING':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(34,166,122,0.3)] ${className}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Mic className="w-3 h-3 text-emerald-300 animate-pulse" />
          <span>LISTENING</span>
        </span>
      );

    case 'PROCESSING':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40 ${className}`}>
          <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
          <span>PROCESSING</span>
        </span>
      );

    case 'MOVE_DETECTED':
    case 'AWAITING_CONFIRMATION':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400 shadow-[0_0_12px_rgba(34,166,122,0.4)] ${className}`}>
          <Sparkles className="w-3 h-3 text-emerald-300 animate-bounce" />
          <span>CONFIRM MOVE</span>
        </span>
      );

    case 'CONFIRMING_RESIGN':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/25 text-red-200 border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)] ${className}`}>
          <AlertCircle className="w-3 h-3 text-red-300" />
          <span>CONFIRM RESIGN</span>
        </span>
      );

    case 'EXECUTING':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/25 text-amber-300 border border-amber-400 ${className}`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>EXECUTING</span>
        </span>
      );

    case 'ERROR':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30 ${className}`}>
          <AlertCircle className="w-3 h-3" />
          <span>ERROR</span>
        </span>
      );

    case 'UNSUPPORTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/5 text-slate-500 border border-white/5 ${className}`}>
          <span>NOT SUPPORTED</span>
        </span>
      );

    default:
      return null;
  }
};

export default VoiceStatus;

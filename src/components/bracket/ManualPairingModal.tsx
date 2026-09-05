import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { Shuffle, ArrowLeftRight, Check, X } from 'lucide-react';

interface ManualPairingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualPairingModal: React.FC<ManualPairingModalProps> = ({ isOpen, onClose }) => {
  const { 
    players, 
    shuffleAndPairPlayers, 
    confirmPairings 
  } = useTournament();

  const [pairings, setPairings] = useState<{ white: Player | null; black: Player | null }[]>(() => {
    return shuffleAndPairPlayers(false);
  });

  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<string | null>(null);
  const [isShufflingAnim, setIsShufflingAnim] = useState(false);

  if (!isOpen) return null;

  const handleReshuffle = () => {
    setIsShufflingAnim(true);
    setTimeout(() => {
      const fresh = shuffleAndPairPlayers(false);
      setPairings(fresh);
      setSelectedPlayerForSwap(null);
      setIsShufflingAnim(false);
    }, 400);
  };

  const handlePlayerClick = (playerId: string | null) => {
    if (!playerId) return;

    if (!selectedPlayerForSwap) {
      setSelectedPlayerForSwap(playerId);
    } else if (selectedPlayerForSwap === playerId) {
      setSelectedPlayerForSwap(null);
    } else {
      // Swap players in local pairings state
      setPairings(prev => {
        return prev.map(pair => {
          let w = pair.white;
          let b = pair.black;

          const pA = players.find(p => p.id === selectedPlayerForSwap) || null;
          const pB = players.find(p => p.id === playerId) || null;

          if (w?.id === selectedPlayerForSwap) w = pB;
          else if (w?.id === playerId) w = pA;

          if (b?.id === selectedPlayerForSwap) b = pB;
          else if (b?.id === playerId) b = pA;

          return { white: w, black: b };
        });
      });

      setSelectedPlayerForSwap(null);
    }
  };

  const handleConfirm = () => {
    confirmPairings(pairings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: 'var(--cg-gold-bright)',
              }}
            >
              <Shuffle className={`w-6 h-6 ${isShufflingAnim ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
              >
                Ceremonial Draw & Pairing Chamber
              </h3>
              <p className="text-xs text-[#c8c0ae]/60">
                Review randomized matchups or click any two contenders to manually swap positions
              </p>
            </div>
          </div>

          <button
            onClick={handleReshuffle}
            disabled={isShufflingAnim}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm self-stretch sm:self-auto justify-center"
            style={{
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              color: 'var(--cg-gold-bright)',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
            }}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShufflingAnim ? 'animate-spin' : ''}`} />
            <span>Shuffle Draw</span>
          </button>
        </div>

        {selectedPlayerForSwap && (
          <div 
            className="p-3 mb-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.4)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <span className="flex items-center gap-2 font-medium">
              <ArrowLeftRight className="w-4 h-4 text-[#e8c45a]" />
              Selected <strong>{players.find(p => p.id === selectedPlayerForSwap)?.name}</strong> for swapping. Click another player to swap positions.
            </span>
            <button
              onClick={() => setSelectedPlayerForSwap(null)}
              className="text-xs underline hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Pairings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {pairings.map((pair, index) => {
            const isWhiteSelected = pair.white?.id === selectedPlayerForSwap;
            const isBlackSelected = pair.black?.id === selectedPlayerForSwap;

            return (
              <div
                key={index}
                className="p-4 rounded-2xl relative space-y-2.5 transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.75)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                }}
              >
                <div className="flex items-center justify-between text-xs text-[#c8c0ae]/60">
                  <span className="font-bold text-[#c9a84c] font-mono">Match #{index + 1} (Board {index + 1})</span>
                  <span className="text-[10px] text-[#c8c0ae]/40 font-mono">Round 1</span>
                </div>

                {/* White Player */}
                <button
                  type="button"
                  onClick={() => handlePlayerClick(pair.white?.id || null)}
                  className="w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all"
                  style={{
                    background: isWhiteSelected
                      ? 'rgba(201, 168, 76, 0.25)'
                      : 'rgba(17, 17, 20, 0.8)',
                    borderColor: isWhiteSelected ? 'var(--cg-gold-bright)' : 'rgba(201, 168, 76, 0.15)',
                    boxShadow: isWhiteSelected ? '0 0 15px rgba(201, 168, 76, 0.25)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400 inline-block shadow-sm" />
                    <span className="font-bold text-xs text-white">{pair.white?.name || 'Empty'}</span>
                    <span className="text-[10px] text-[#c8c0ae]/50 font-mono">({pair.white?.rollNumber || '-'})</span>
                  </div>
                  <span className="text-[10px] text-[#c9a84c] font-mono font-bold">Seed #{pair.white?.seed || '-'}</span>
                </button>

                <div className="text-center text-[10px] font-bold text-[#c9a84c]/60 uppercase font-mono tracking-widest">
                  VS
                </div>

                {/* Black Player */}
                <button
                  type="button"
                  onClick={() => handlePlayerClick(pair.black?.id || null)}
                  className="w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all"
                  style={{
                    background: isBlackSelected
                      ? 'rgba(201, 168, 76, 0.25)'
                      : 'rgba(17, 17, 20, 0.8)',
                    borderColor: isBlackSelected ? 'var(--cg-gold-bright)' : 'rgba(201, 168, 76, 0.15)',
                    boxShadow: isBlackSelected ? '0 0 15px rgba(201, 168, 76, 0.25)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black border border-[#c9a84c]/40 inline-block shadow-sm" />
                    <span className="font-bold text-xs text-white">{pair.black?.name || 'Empty'}</span>
                    <span className="text-[10px] text-[#c8c0ae]/50 font-mono">({pair.black?.rollNumber || '-'})</span>
                  </div>
                  <span className="text-[10px] text-[#c9a84c] font-mono font-bold">Seed #{pair.black?.seed || '-'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#c9a84c]/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReshuffle}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                color: 'var(--cg-ivory)',
              }}
            >
              Shuffle Again
            </button>
            <button
              onClick={handleConfirm}
              className="cg-btn cg-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Pairings & Launch Round 1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Upload, Sparkles, X } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const { bulkAddPlayers } = useTournament();
  const [textInput, setTextInput] = useState('');

  if (!isOpen) return null;

  const sampleMastersRoster = [
    { seed: 1, name: 'Alexander Chen', rollNumber: 'CG-GM-101', course: 'Grandmaster (FIDE 2640)', year: 'Masters Tier', semester: 'Division I', section: 'A' },
    { seed: 2, name: 'Elena Rostova', rollNumber: 'CG-GM-102', course: 'Grandmaster (FIDE 2595)', year: 'Masters Tier', semester: 'Division I', section: 'A' },
    { seed: 3, name: 'Marcus Vance', rollNumber: 'CG-IM-103', course: 'International Master (FIDE 2480)', year: 'Pro Tier', semester: 'Division I', section: 'B' },
    { seed: 4, name: 'Sofia Lindqvist', rollNumber: 'CG-WGM-104', course: 'Woman Grandmaster (FIDE 2450)', year: 'Pro Tier', semester: 'Division I', section: 'A' },
    { seed: 5, name: 'Vikram Patel', rollNumber: 'CG-FM-105', course: 'FIDE Master (FIDE 2390)', year: 'Candidate Tier', semester: 'Division I', section: 'A' },
    { seed: 6, name: 'Julian Thorne', rollNumber: 'CG-IM-106', course: 'International Master (FIDE 2420)', year: 'Pro Tier', semester: 'Division I', section: 'B' },
    { seed: 7, name: 'Dmitri Volkov', rollNumber: 'CG-FM-107', course: 'FIDE Master (FIDE 2375)', year: 'Candidate Tier', semester: 'Division I', section: 'B' },
    { seed: 8, name: 'Arthur Pendelton', rollNumber: 'CG-CM-108', course: 'Candidate Master (FIDE 2290)', year: 'Candidate Tier', semester: 'Division I', section: 'A' },
    { seed: 9, name: 'Kaelen Voss', rollNumber: 'CG-CM-109', course: 'Candidate Master (FIDE 2260)', year: 'Candidate Tier', semester: 'Division I', section: 'B' },
    { seed: 10, name: 'Siddharth Rao', rollNumber: 'CG-FM-110', course: 'FIDE Master (FIDE 2340)', year: 'Pro Tier', semester: 'Division I', section: 'A' },
    { seed: 11, name: 'Priya Nair', rollNumber: 'CG-WIM-111', course: 'Woman International Master (FIDE 2310)', year: 'Pro Tier', semester: 'Division I', section: 'A' },
    { seed: 12, name: 'Ananya Sharma', rollNumber: 'CG-WFM-112', course: 'Woman FIDE Master (FIDE 2240)', year: 'Candidate Tier', semester: 'Division I', section: 'A' },
    { seed: 13, name: 'Viktor Hauer', rollNumber: 'CG-OP-113', course: 'Rated Open (FIDE 2180)', year: 'Challenger Tier', semester: 'Division I', section: 'A' },
    { seed: 14, name: 'Devon Lee', rollNumber: 'CG-OP-114', course: 'Rated Open (FIDE 2150)', year: 'Challenger Tier', semester: 'Division I', section: 'C' },
    { seed: 15, name: 'Mateo Silva', rollNumber: 'CG-OP-115', course: 'Rated Open (FIDE 2120)', year: 'Challenger Tier', semester: 'Division I', section: 'B' },
    { seed: 16, name: 'Gabriel Dubois', rollNumber: 'CG-OP-116', course: 'Rated Open (FIDE 2090)', year: 'Challenger Tier', semester: 'Division I', section: 'A' },
  ];

  const handleLoadSample = () => {
    bulkAddPlayers(sampleMastersRoster);
    onClose();
  };

  const handleCustomImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // Parse lines in format: Name, PlayerID, Title/Rating
    const lines = textInput.split('\n').filter(l => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        seed: idx + 1,
        name: parts[0] || `Contender ${idx + 1}`,
        rollNumber: parts[1] || `CG-ID-${1000 + idx}`,
        course: parts[2] || 'Rated Player (Open)',
        year: 'Masters Tier',
        semester: 'Division I',
        section: 'A',
      };
    });

    if (parsed.length > 0) {
      bulkAddPlayers(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
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

        <div className="flex items-center gap-3.5 mb-6">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              Bulk Roster Ingestion
            </h3>
            <p className="text-xs text-[#c8c0ae]/60">Rapidly populate the tournament seed pool</p>
          </div>
        </div>

        {/* 1-Click Masters Pre-Filled Roster Button */}
        <div 
          className="p-4 rounded-2xl mb-5"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, rgba(10, 10, 11, 0.8) 100%)',
            border: '1px solid rgba(201, 168, 76, 0.35)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div 
                className="text-sm font-bold flex items-center gap-1.5"
                style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-gold-bright)', fontSize: '1.05rem' }}
              >
                <Sparkles className="w-4 h-4 text-[#c9a84c]" />
                Populate with Grandmasters Roster
              </div>
              <p className="text-xs text-[#c8c0ae]/70 mt-0.5">
                Instantly populate Alexander Chen, Elena Rostova, Marcus Vance, and 13 other rated grandmasters and contenders.
              </p>
            </div>
            <button
              onClick={handleLoadSample}
              className="cg-btn cg-btn-primary px-4 py-2 rounded-xl text-xs font-bold shrink-0 shadow-md"
            >
              Load Roster
            </button>
          </div>
        </div>

        {/* Custom Text/CSV Paste */}
        <form onSubmit={handleCustomImport} className="space-y-3">
          <label className="block text-xs font-semibold text-[#c8c0ae]/80" style={{ fontFamily: 'var(--font-sans)' }}>
            Or Paste Custom CSV List (Name, Player ID, Rating/Title)
          </label>
          <textarea
            rows={5}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder={`Alexander Chen, CG-GM-101, Grandmaster (2640)\nElena Rostova, CG-GM-102, Grandmaster (2595)\nMarcus Vance, CG-IM-103, International Master (2480)`}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono focus:outline-none transition-all"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
            }}
          />
          <p className="text-[11px] text-[#c8c0ae]/50">
            Format: One contender per line separated by commas.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="cg-btn cg-btn-primary px-5 py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import Contenders
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BulkImportModal;

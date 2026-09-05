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

  const sampleIEHERoster = [
    { seed: 1, name: 'Ram', rollNumber: 'IEHE-PHY-2401', course: 'M.Sc Physics', year: '2nd Year', semester: 'Semester III', section: 'A' },
    { seed: 2, name: 'Lucky', rollNumber: 'IEHE-PHY-2402', course: 'M.Sc Physics', year: '2nd Year', semester: 'Semester III', section: 'A' },
    { seed: 3, name: 'Aman', rollNumber: 'IEHE-CS-2415', course: 'B.Sc Computer Science', year: '3rd Year', semester: 'Semester V', section: 'B' },
    { seed: 4, name: 'Rahul', rollNumber: 'IEHE-PHY-2510', course: 'B.Sc Physics Hons', year: '1st Year', semester: 'Semester I', section: 'A' },
    { seed: 5, name: 'Aditya', rollNumber: 'IEHE-MAT-2408', course: 'M.Sc Mathematics', year: '2nd Year', semester: 'Semester III', section: 'A' },
    { seed: 6, name: 'Rohan', rollNumber: 'IEHE-STA-2412', course: 'B.Sc Statistics', year: '2nd Year', semester: 'Semester III', section: 'B' },
    { seed: 7, name: 'Vivek', rollNumber: 'IEHE-PHY-2422', course: 'M.Sc Physics', year: '1st Year', semester: 'Semester I', section: 'B' },
    { seed: 8, name: 'Arjun', rollNumber: 'IEHE-CS-2504', course: 'B.Sc Computer Science', year: '1st Year', semester: 'Semester I', section: 'A' },
    { seed: 9, name: 'Kunal', rollNumber: 'IEHE-PHY-2512', course: 'B.Sc Physics Hons', year: '1st Year', semester: 'Semester I', section: 'B' },
    { seed: 10, name: 'Siddharth', rollNumber: 'IEHE-CS-2409', course: 'B.Sc Computer Science', year: '2nd Year', semester: 'Semester III', section: 'A' },
    { seed: 11, name: 'Priya', rollNumber: 'IEHE-MAT-2403', course: 'M.Sc Mathematics', year: '2nd Year', semester: 'Semester III', section: 'A' },
    { seed: 12, name: 'Ananya', rollNumber: 'IEHE-PHY-2405', course: 'M.Sc Physics', year: '1st Year', semester: 'Semester I', section: 'A' },
    { seed: 13, name: 'Vikram', rollNumber: 'IEHE-STA-2418', course: 'B.Sc Statistics', year: '3rd Year', semester: 'Semester V', section: 'A' },
    { seed: 14, name: 'Dev', rollNumber: 'IEHE-CS-2519', course: 'B.Sc Computer Science', year: '1st Year', semester: 'Semester I', section: 'C' },
    { seed: 15, name: 'Manish', rollNumber: 'IEHE-PHY-2430', course: 'B.Sc Physics Hons', year: '2nd Year', semester: 'Semester III', section: 'B' },
    { seed: 16, name: 'Gaurav', rollNumber: 'IEHE-MAT-2501', course: 'B.Sc Mathematics', year: '1st Year', semester: 'Semester I', section: 'A' },
  ];

  const handleLoadSample = () => {
    bulkAddPlayers(sampleIEHERoster);
    onClose();
  };

  const handleCustomImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // Parse lines in format: Name, RollNumber, Course
    const lines = textInput.split('\n').filter(l => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      return {
        seed: idx + 1,
        name: parts[0] || `Player ${idx + 1}`,
        rollNumber: parts[1] || `IEHE-GEN-${1000 + idx}`,
        course: parts[2] || 'B.Sc Physics Hons',
        year: '1st Year',
        semester: 'Semester I',
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

        {/* 1-Click IEHE Pre-Filled Roster Button */}
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
                Populate with Official IEHE Championship Roster
              </div>
              <p className="text-xs text-[#c8c0ae]/70 mt-0.5">
                Instantly populate Ram, Lucky, Aman, Rahul, and 12 other IEHE department players.
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
            Or Paste Custom CSV List (Name, Roll Number, Course)
          </label>
          <textarea
            rows={5}
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder={`Ram Vishwakarma, IEHE-PHY-2401, M.Sc Physics\nLucky, IEHE-PHY-2402, M.Sc Physics\nAman, IEHE-CS-2415, B.Sc Computer Science`}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
            style={{
              background: 'rgba(10, 10, 11, 0.7)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--cg-ivory)',
            }}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c9a84c]/20">
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
              className="cg-btn cg-btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md disabled:opacity-40 disabled:pointer-events-none"
            >
              Import Players
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


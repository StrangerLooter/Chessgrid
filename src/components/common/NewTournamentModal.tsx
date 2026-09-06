import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { TournamentSize, TimeControlType } from '../../types/tournament';
import { DEMO_PLAYERS } from '../../data/demoData';
import { 
  Trophy, 
  Building2, 
  Clock, 
  Users, 
  Sparkles, 
  X, 
  Layers, 
  Check
} from 'lucide-react';

interface NewTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOURNAMENT_SIZES: { size: TournamentSize; label: string; rounds: number; desc: string }[] = [
  { size: 2, label: '2 Contenders', rounds: 1, desc: 'Finals (1 Round)' },
  { size: 4, label: '4 Contenders', rounds: 2, desc: 'Semifinals & Finals (2 Rounds)' },
  { size: 8, label: '8 Contenders', rounds: 3, desc: 'Quarterfinals to Finals (3 Rounds)' },
  { size: 16, label: '16 Contenders', rounds: 4, desc: 'Round of 16 to Finals (4 Rounds)' },
  { size: 32, label: '32 Contenders', rounds: 5, desc: '5 Knockout Rounds' },
  { size: 64, label: '64 Contenders', rounds: 6, desc: '6 Knockout Rounds' },
  { size: 128, label: '128 Contenders', rounds: 7, desc: '7 Knockout Rounds' },
];

const TIME_PRESETS = [
  { label: '3 + 2 Blitz', type: 'blitz' as TimeControlType, min: 3, inc: 2, tag: 'Fast Pace' },
  { label: '5 + 3 Blitz', type: 'blitz' as TimeControlType, min: 5, inc: 3, tag: 'Standard Blitz' },
  { label: '10 + 5 Rapid', type: 'rapid' as TimeControlType, min: 10, inc: 5, tag: 'Collegiate Rapid' },
  { label: '15 + 10 Rapid', type: 'rapid' as TimeControlType, min: 15, inc: 10, tag: 'FIDE Rapid' },
  { label: '30 + 0 Classical', type: 'classical' as TimeControlType, min: 30, inc: 0, tag: 'Classical' },
];

export const NewTournamentModal: React.FC<NewTournamentModalProps> = ({ isOpen, onClose }) => {
  const { startNewTournament } = useTournament();

  const [name, setName] = useState('IEHE Department Chess Championship 2026');
  const [collegeName, setCollegeName] = useState('Institute for Excellence in Higher Education (IEHE)');
  const [departmentName, setDepartmentName] = useState('Department of Physics');
  const [academicSession, setAcademicSession] = useState('2025-2026');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState('Auditorium Hall B, IEHE Campus');
  const [organizerName, setOrganizerName] = useState('Ram Vishwakarma');
  
  const [totalPlayers, setTotalPlayers] = useState<TournamentSize>(8);
  const [tcType, setTcType] = useState<TimeControlType>('rapid');
  const [tcMinutes, setTcMinutes] = useState(10);
  const [tcIncrement, setTcIncrement] = useState(5);
  const [rosterOption, setRosterOption] = useState<'empty' | 'sample'>('empty');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof TIME_PRESETS[0]) => {
    setTcType(preset.type);
    setTcMinutes(preset.min);
    setTcIncrement(preset.inc);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    let initialPlayers = undefined;
    if (rosterOption === 'sample') {
      // slice demo players according to capacity
      initialPlayers = DEMO_PLAYERS.slice(0, totalPlayers).map((p, idx) => ({
        ...p,
        seed: idx + 1,
        status: 'registered' as const,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        currentRound: 'Round 1',
        score: 0,
      }));
    }

    startNewTournament(
      {
        name: name.trim() || 'New Chess Championship',
        collegeName: collegeName.trim() || 'Collegiate Arena',
        departmentName: departmentName.trim() || 'General Department',
        academicSession: academicSession.trim() || '2025-2026',
        date,
        venue: venue.trim() || 'Main Campus Hall',
        organizerName: organizerName.trim() || 'Chief Arbiter',
        totalPlayers,
        status: 'setup',
        defaultTimeControl: {
          type: tcType,
          initialMinutes: Number(tcMinutes),
          incrementSeconds: Number(tcIncrement),
          label: `${tcMinutes} + ${tcIncrement} ${tcType.toUpperCase()}`,
        },
        maxBoards: Math.max(2, Math.floor(totalPlayers / 4)),
      },
      initialPlayers
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl text-slate-100 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(145deg, #141418 0%, #0a0a0c 100%)',
          border: '1px solid rgba(201, 168, 76, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(201, 168, 76, 0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.25) 0%, rgba(201, 168, 76, 0.08) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.45)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: '1.75rem',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: 'var(--cg-ivory)',
                lineHeight: 1.1,
              }}
            >
              CREATE NEW TOURNAMENT
            </h2>
            <p className="text-xs text-[rgba(200,192,174,0.65)] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              Configure institutional metadata, knockout tree scale, time clocks, and roster initialization
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          
          {/* Section 1: Tournament Details */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)]">
              <Building2 className="w-4 h-4" />
              <span>1. Institutional & Event Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Tournament Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. IEHE Grandmaster Invitational 2026"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Department / Branch *
                </label>
                <input
                  type="text"
                  required
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={academicSession}
                  onChange={e => setAcademicSession(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Tournament Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="Campus Sports Hall B"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1">
                  Chief Arbiter / Organizer
                </label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={e => setOrganizerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.25)] text-white focus:outline-none focus:border-[var(--cg-gold)]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tournament Bracket Capacity */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)]">
              <Users className="w-4 h-4" />
              <span>2. Bracket Scale & Player Capacity</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TOURNAMENT_SIZES.map(item => {
                const isSelected = totalPlayers === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setTotalPlayers(item.size)}
                    className="flex flex-col items-start p-3 rounded-xl text-left transition-all relative overflow-hidden"
                    style={{
                      background: isSelected ? 'rgba(201, 168, 76, 0.18)' : 'rgba(15, 15, 18, 0.6)',
                      border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201, 168, 76, 0.15)'}`,
                      boxShadow: isSelected ? '0 0 15px rgba(201, 168, 76, 0.25)' : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm font-mono text-[var(--cg-ivory)]">
                        {item.size} Players
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[var(--cg-gold)]" />}
                    </div>
                    <span className="text-[10px] text-[rgba(200,192,174,0.6)] mt-1">
                      {item.rounds} {item.rounds === 1 ? 'Round' : 'Rounds'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Time Control */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)]">
              <Clock className="w-4 h-4" />
              <span>3. Time Control & Arbiter Clock</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {TIME_PRESETS.map((preset, idx) => {
                const isActive = tcMinutes === preset.min && tcIncrement === preset.inc && tcType === preset.type;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all"
                    style={{
                      background: isActive ? 'rgba(201, 168, 76, 0.2)' : 'rgba(15, 15, 18, 0.7)',
                      border: `1px solid ${isActive ? 'var(--cg-gold)' : 'rgba(201, 168, 76, 0.2)'}`,
                      color: isActive ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#c8c0ae]/70 mb-1">Clock Mode</label>
                <select
                  value={tcType}
                  onChange={e => setTcType(e.target.value as TimeControlType)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#0f0f12] border border-[rgba(201,168,76,0.2)] text-white focus:outline-none"
                >
                  <option value="bullet">Bullet</option>
                  <option value="blitz">Blitz</option>
                  <option value="rapid">Rapid</option>
                  <option value="classical">Classical</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#c8c0ae]/70 mb-1">Minutes per Side</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={tcMinutes}
                  onChange={e => setTcMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-[#0f0f12] border border-[rgba(201,168,76,0.2)] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#c8c0ae]/70 mb-1">Increment (Sec)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={tcIncrement}
                  onChange={e => setTcIncrement(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-[#0f0f12] border border-[rgba(201,168,76,0.2)] text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Initial Roster Mode */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-[var(--cg-gold)]">
              <Layers className="w-4 h-4" />
              <span>4. Initial Roster Setup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRosterOption('empty')}
                className="p-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: rosterOption === 'empty' ? 'rgba(34, 166, 122, 0.15)' : 'rgba(15, 15, 18, 0.6)',
                  border: `1px solid ${rosterOption === 'empty' ? 'var(--cg-emerald)' : 'rgba(201, 168, 76, 0.15)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Start Fresh (Empty Roster)</span>
                  {rosterOption === 'empty' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-[rgba(200,192,174,0.6)] mt-1">
                  0 players registered. Add contenders manually or import via CSV file.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRosterOption('sample')}
                className="p-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: rosterOption === 'sample' ? 'rgba(201, 168, 76, 0.18)' : 'rgba(15, 15, 18, 0.6)',
                  border: `1px solid ${rosterOption === 'sample' ? 'var(--cg-gold)' : 'rgba(201, 168, 76, 0.15)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">Pre-load Sample Roster</span>
                  {rosterOption === 'sample' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-[rgba(200,192,174,0.6)] mt-1">
                  Pre-fills sample collegiate players for instant bracket and timer testing.
                </p>
              </button>
            </div>
          </div>

          {/* Submit / Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cg-btn cg-btn-primary px-6 py-2.5"
            >
              <Sparkles className="w-4 h-4" />
              Launch Tournament
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewTournamentModal;

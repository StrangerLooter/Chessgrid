import React, { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { UserPlus, UserCheck, X } from 'lucide-react';

interface PlayerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
}

const PLAYER_CATEGORIES = [
  'Grandmaster (GM)',
  'International Master (IM)',
  'FIDE Master (FM)',
  'Candidate Master (CM)',
  'Rated Open (2000-2400)',
  'Rated Intermediate (1600-2000)',
  'Club Challenger (Open)',
  'Junior / Youth Division',
];

export const PlayerRegistrationModal: React.FC<PlayerRegistrationModalProps> = ({
  isOpen,
  onClose,
  playerToEdit,
}) => {
  const { addPlayer, updatePlayer } = useTournament();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState(PLAYER_CATEGORIES[0]);
  const [year, setYear] = useState('Masters Tier');
  const [semester, setSemester] = useState('Division I');
  const [section, setSection] = useState('A');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setRollNumber(playerToEdit.rollNumber);
      setCourse(playerToEdit.course);
      setYear(playerToEdit.year);
      setSemester(playerToEdit.semester);
      setSection(playerToEdit.section);
      setPhone(playerToEdit.phone || '');
      setEmail(playerToEdit.email || '');
    } else {
      setName('');
      setRollNumber('');
      setCourse(PLAYER_CATEGORIES[0]);
      setYear('Masters Tier');
      setSemester('Division I');
      setSection('A');
      setPhone('');
      setEmail('');
    }
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;

    if (playerToEdit) {
      updatePlayer(playerToEdit.id, {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        course,
        year,
        semester,
        section,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });
      onClose();
    } else {
      const success = addPlayer({
        seed: 0, // Assigned automatically
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        course,
        year,
        semester,
        section,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });
      if (success) {
        onClose();
      }
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
            {playerToEdit ? <UserCheck className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <div>
            <h3 
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              {playerToEdit ? 'Edit Contender Profile' : 'Register Tournament Contender'}
            </h3>
            <p className="text-xs text-[#c8c0ae]/60">
              {playerToEdit ? 'Update participant record, rating, and organization credentials' : 'Add eligible contender into the knockout seed pool'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name & Player ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Contender Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alexander Chen"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Player ID / FIDE ID *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                placeholder="e.g. CG-GM-101"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                }}
              />
            </div>
          </div>

          {/* Rating Title & Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Title / Rating Tier *
              </label>
              <select
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.9)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {PLAYER_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ background: '#111114', color: '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Competitive Tier *
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.9)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="Masters Tier" style={{ background: '#111114', color: '#fff' }}>Masters Tier</option>
                <option value="Pro Tier" style={{ background: '#111114', color: '#fff' }}>Pro Tier</option>
                <option value="Candidate Tier" style={{ background: '#111114', color: '#fff' }}>Candidate Tier</option>
                <option value="Challenger Tier" style={{ background: '#111114', color: '#fff' }}>Challenger Tier</option>
              </select>
            </div>
          </div>

          {/* Division & Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Division
              </label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.9)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="Division I" style={{ background: '#111114', color: '#fff' }}>Division I</option>
                <option value="Division II" style={{ background: '#111114', color: '#fff' }}>Division II</option>
                <option value="Open Pool" style={{ background: '#111114', color: '#fff' }}>Open Pool</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Group / Section
              </label>
              <input
                type="text"
                value={section}
                onChange={e => setSection(e.target.value)}
                placeholder="A"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all uppercase"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="player@chessgrid.org"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#c9a84c]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#c8c0ae]/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cg-btn cg-btn-primary px-6 py-2.5 text-xs font-bold shadow-lg"
            >
              {playerToEdit ? 'Save Changes' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerRegistrationModal;

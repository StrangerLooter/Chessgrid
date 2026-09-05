import React, { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { Player } from '../../types/tournament';
import { UserPlus, UserCheck, X } from 'lucide-react';

interface PlayerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerToEdit?: Player | null;
}

export const PlayerRegistrationModal: React.FC<PlayerRegistrationModalProps> = ({
  isOpen,
  onClose,
  playerToEdit,
}) => {
  const { addPlayer, updatePlayer } = useTournament();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState('B.Sc Physics Hons');
  const [year, setYear] = useState('1st Year');
  const [semester, setSemester] = useState('Semester I');
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
      setCourse('B.Sc Physics Hons');
      setYear('1st Year');
      setSemester('Semester I');
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
              {playerToEdit ? 'Update participant record and department affiliation' : 'Add eligible student into the knockout seed pool'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name & Roll Number */}
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
                placeholder="e.g. Ram Vishwakarma"
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
                College Roll Number *
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                placeholder="e.g. IEHE-PHY-2401"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                }}
              />
            </div>
          </div>

          {/* Course & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Department Degree Course *
              </label>
              <select
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="B.Sc Physics Hons">B.Sc Physics Hons</option>
                <option value="M.Sc Physics">M.Sc Physics</option>
                <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                <option value="M.Sc Computer Science">M.Sc Computer Science</option>
                <option value="B.Sc Mathematics">B.Sc Mathematics</option>
                <option value="M.Sc Mathematics">M.Sc Mathematics</option>
                <option value="B.Sc Statistics">B.Sc Statistics</option>
                <option value="B.Com Hons">B.Com Hons</option>
                <option value="B.A. Hons">B.A. Hons</option>
                <option value="Other Department">Other Department</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Academic Year *
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Postgraduate 1st Yr">Postgraduate 1st Yr</option>
                <option value="Postgraduate 2nd Yr">Postgraduate 2nd Yr</option>
              </select>
            </div>
          </div>

          {/* Semester & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Semester
              </label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                style={{
                  background: 'rgba(10, 10, 11, 0.7)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: 'var(--cg-ivory)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option value="Semester I">Semester I</option>
                <option value="Semester II">Semester II</option>
                <option value="Semester III">Semester III</option>
                <option value="Semester IV">Semester IV</option>
                <option value="Semester V">Semester V</option>
                <option value="Semester VI">Semester VI</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Section / Batch
              </label>
              <input
                type="text"
                value={section}
                onChange={e => setSection(e.target.value)}
                placeholder="A / B / C"
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

          {/* Optional Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                College Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@iehe.ac.in"
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


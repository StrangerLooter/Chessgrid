import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import type { TournamentSize, TimeControlType } from '../../types/tournament';
import { 
  Settings2, 
  Users, 
  Save, 
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Clock,
  Building
} from 'lucide-react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const TournamentSettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    startNewTournament, 
    loadDemoTournament 
  } = useTournament();

  const [name, setName] = useState(settings.name);
  const [collegeName, setCollegeName] = useState(settings.collegeName);
  const [departmentName, setDepartmentName] = useState(settings.departmentName);
  const [academicSession, setAcademicSession] = useState(settings.academicSession);
  const [date, setDate] = useState(settings.date);
  const [venue, setVenue] = useState(settings.venue);
  const [organizerName, setOrganizerName] = useState(settings.organizerName);
  const [totalPlayers, setTotalPlayers] = useState<TournamentSize>(settings.totalPlayers);

  const [tcType, setTcType] = useState<TimeControlType>(settings.defaultTimeControl.type);
  const [tcMinutes, setTcMinutes] = useState(settings.defaultTimeControl.initialMinutes);
  const [tcIncrement, setTcIncrement] = useState(settings.defaultTimeControl.incrementSeconds);

  const [showNewTournConfirm, setShowNewTournConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name: name.trim(),
      collegeName: collegeName.trim(),
      departmentName: departmentName.trim(),
      academicSession: academicSession.trim(),
      date,
      venue: venue.trim(),
      organizerName: organizerName.trim(),
      defaultTimeControl: {
        type: tcType,
        initialMinutes: Number(tcMinutes),
        incrementSeconds: Number(tcIncrement),
        label: `${tcMinutes} + ${tcIncrement} ${tcType.toUpperCase()}`,
      },
    });
  };

  const handleApplySizeChange = (newSize: TournamentSize) => {
    setTotalPlayers(newSize);
    setShowNewTournConfirm(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div 
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 80% 0%, rgba(201, 168, 76, 0.12) 0%, rgba(17, 17, 20, 0.95) 70%)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7)',
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              color: 'var(--cg-gold-bright)',
            }}
          >
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h2 
              className="text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              Tournament Governance & Configuration
            </h2>
            <p className="text-xs text-[#c8c0ae]/60 mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              Customize institutional parameters, bracket capacity, chess clocks, and database reset controls
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form 
            onSubmit={handleSaveGeneral} 
            className="p-6 rounded-2xl space-y-5"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.9) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.18)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)',
            }}
          >
            <h3 
              className="text-lg font-bold pb-3 border-b border-[#c9a84c]/15 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              <Building className="w-4 h-4 text-[#c9a84c]" />
              Institutional & Event Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Tournament Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  Organization / Club / Host *
                </label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Category / Division / Section *
                </label>
                <input
                  type="text"
                  required
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
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
                  Academic Session *
                </label>
                <input
                  type="text"
                  required
                  value={academicSession}
                  onChange={e => setAcademicSession(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                  style={{
                    background: 'rgba(10, 10, 11, 0.7)',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    color: 'var(--cg-ivory)',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Tournament Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
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
                  Venue Location
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
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
                  Chief Arbiter / Coordinator
                </label>
                <input
                  type="text"
                  value={organizerName}
                  onChange={e => setOrganizerName(e.target.value)}
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

            <h3 
              className="text-lg font-bold pt-4 border-t border-[#c9a84c]/15 mb-2 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              <Clock className="w-4 h-4 text-[#c9a84c]" />
              Default Chess Clock Standard
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Preset Standard
                </label>
                <select
                  value={tcType}
                  onChange={e => {
                    const type = e.target.value as TimeControlType;
                    setTcType(type);
                    if (type === 'bullet') { setTcMinutes(3); setTcIncrement(0); }
                    else if (type === 'blitz') { setTcMinutes(5); setTcIncrement(3); }
                    else if (type === 'rapid') { setTcMinutes(10); setTcIncrement(5); }
                    else if (type === 'classical') { setTcMinutes(15); setTcIncrement(10); }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                  style={{
                    background: 'rgba(10, 10, 11, 0.7)',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    color: 'var(--cg-ivory)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <option value="rapid">10 + 5 (Rapid - Recommended)</option>
                  <option value="blitz">5 + 3 (Blitz)</option>
                  <option value="bullet">3 + 0 (Bullet)</option>
                  <option value="classical">15 + 10 (Classical)</option>
                  <option value="custom">Custom Time Control</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c8c0ae]/80 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Base Minutes per Player
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={tcMinutes}
                  onChange={e => setTcMinutes(Number(e.target.value))}
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
                  Increment (Seconds/Move)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={tcIncrement}
                  onChange={e => setTcIncrement(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-all font-mono"
                  style={{
                    background: 'rgba(10, 10, 11, 0.7)',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    color: 'var(--cg-ivory)',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="submit"
                className="cg-btn cg-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] transition-transform"
              >
                <Save className="w-4 h-4" />
                <span>Save Tournament Parameters</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Tournament Sizing & Danger Zone */}
        <div className="space-y-6">
          
          {/* Sizing Card */}
          <div 
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.9) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.18)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)',
            }}
          >
            <h3 
              className="text-lg font-bold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
            >
              <Users className="w-4 h-4 text-[#c9a84c]" />
              Bracket Capacity & Seed Pool
            </h3>
            <p className="text-xs text-[#c8c0ae]/60" style={{ fontFamily: 'var(--font-sans)' }}>
              Standard knockout bracket tree (powers of 2):
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {([2, 4, 8, 16, 32, 64, 128] as TournamentSize[]).map(size => {
                const isSelected = settings.totalPlayers === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleApplySizeChange(size)}
                    className="p-3 rounded-xl border text-center transition-all"
                    style={{
                      background: isSelected
                        ? 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.2) 0%, rgba(10, 10, 11, 0.9) 100%)'
                        : 'rgba(10, 10, 11, 0.6)',
                      borderColor: isSelected ? 'var(--cg-gold-bright)' : 'rgba(201, 168, 76, 0.15)',
                      boxShadow: isSelected ? '0 0 15px rgba(201, 168, 76, 0.2)' : 'none',
                    }}
                  >
                    <div 
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'var(--font-stat)',
                        color: isSelected ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {size} CONTENDERS
                    </div>
                    <div className="text-[10px] text-[#c8c0ae]/50 mt-0.5 font-mono">
                      {Math.log2(size)} Knockout Rounds
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Danger Zone Controls */}
          <div 
            className="p-6 rounded-2xl space-y-3"
            style={{
              background: 'radial-gradient(ellipse at 80% 0%, rgba(220, 38, 38, 0.08) 0%, rgba(17, 17, 20, 0.9) 70%)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
            }}
          >
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2" style={{ fontFamily: 'var(--font-cinematic)', fontSize: '1.05rem' }}>
              <AlertTriangle className="w-4 h-4" />
              Tournament Administrative Operations
            </h3>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-[#e8c45a] transition-all"
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                border: '1px solid rgba(201, 168, 76, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Reload Sample Masters Demo</span>
            </button>

            <button
              onClick={() => setShowNewTournConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-300 transition-all"
              style={{
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Initialize Clean Tournament</span>
            </button>
          </div>
        </div>
      </div>

      {/* Start New Tournament Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showNewTournConfirm}
        title="Initialize New Tournament?"
        message={`This will reset the current bracket and create a new ${totalPlayers}-player tournament for "${name}". Any existing unregistered players will be cleared.`}
        confirmLabel="Create Tournament"
        variant="warning"
        onConfirm={() => {
          startNewTournament({
            name,
            collegeName,
            departmentName,
            academicSession,
            date,
            venue,
            organizerName,
            totalPlayers,
          });
          setShowNewTournConfirm(false);
        }}
        onCancel={() => setShowNewTournConfirm(false)}
      />

      {/* Reload Demo Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reload Sample Masters Championship?"
        message="This will reload the pre-configured 8-player Masters Championship dataset with live matches, results, and round states."
        confirmLabel="Reload Demo"
        variant="primary"
        onConfirm={() => {
          loadDemoTournament();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};


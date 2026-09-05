import React, { useRef } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Download, Upload, Database, HardDriveDownload, HardDriveUpload } from 'lucide-react';
import { exportTournamentJSON } from '../../utils/exportUtils';

export const BackupRestore: React.FC = () => {
  const { 
    settings, 
    players, 
    matches, 
    announcements, 
    addToast
  } = useTournament();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportTournamentJSON(settings, players, matches, announcements);
    addToast('success', 'Backup Exported', 'Tournament JSON backup downloaded to device.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings && parsed.players && parsed.matches) {
          localStorage.setItem('chess_tm_settings_v1', JSON.stringify(parsed.settings));
          localStorage.setItem('chess_tm_players_v1', JSON.stringify(parsed.players));
          localStorage.setItem('chess_tm_matches_v1', JSON.stringify(parsed.matches));
          if (parsed.announcements) {
            localStorage.setItem('chess_tm_announcements_v1', JSON.stringify(parsed.announcements));
          }
          window.location.reload();
        } else {
          addToast('error', 'Invalid Format', 'JSON file does not match tournament schema.');
        }
      } catch {
        addToast('error', 'Parse Error', 'Failed to read JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="p-6 rounded-2xl space-y-4"
      style={{
        background: 'linear-gradient(135deg, rgba(24, 24, 29, 0.75) 0%, rgba(17, 17, 20, 0.9) 100%)',
        border: '1px solid rgba(201, 168, 76, 0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(201, 168, 76, 0.15)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            color: 'var(--cg-gold-bright)',
          }}
        >
          <Database className="w-4 h-4" />
        </div>
        <h3 
          className="text-lg font-bold"
          style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
        >
          Tournament Data Vault & Replication
        </h3>
      </div>
      <p className="text-xs text-[#c8c0ae]/60" style={{ fontFamily: 'var(--font-sans)' }}>
        Export full tournament state snapshot for safekeeping or transfer tournament data across arbiters' devices:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Export Card */}
        <div 
          className="p-5 rounded-xl space-y-3"
          style={{
            background: 'rgba(10, 10, 11, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--cg-ivory)' }}>
            <HardDriveDownload className="w-4 h-4 text-[#c9a84c]" />
            Export Tournament Archive (.JSON)
          </div>
          <p className="text-[11px] text-[#c8c0ae]/50 leading-relaxed">
            Download complete state including players, active clocks, pairings, and bracket results.
          </p>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
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
            <Download className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span>Download JSON Snapshot</span>
          </button>
        </div>

        {/* Import Card */}
        <div 
          className="p-5 rounded-xl space-y-3"
          style={{
            background: 'rgba(10, 10, 11, 0.7)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--cg-ivory)' }}>
            <HardDriveUpload className="w-4 h-4 text-emerald-400" />
            Restore from Tournament Snapshot
          </div>
          <p className="text-[11px] text-[#c8c0ae]/50 leading-relaxed">
            Load an existing tournament JSON file to immediately resume match management on this device.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'rgba(34, 166, 122, 0.1)',
              border: '1px solid rgba(34, 166, 122, 0.25)',
              color: '#34d399',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(34, 166, 122, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(34, 166, 122, 0.1)';
            }}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import & Load JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};


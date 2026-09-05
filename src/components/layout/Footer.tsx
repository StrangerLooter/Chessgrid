import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useTournament();

  return (
    <footer
      className="mt-auto py-6 text-xs no-print"
      style={{
        background: 'rgba(10, 10, 11, 0.95)',
        borderTop: '1px solid rgba(201, 168, 76, 0.15)',
        color: 'rgba(200, 192, 174, 0.5)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong style={{ color: 'var(--cg-ivory)' }}>{settings.name}</strong> • {settings.collegeName} ({settings.academicSession})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-center">
          <span>Official Arbitrated System</span>
          <span style={{ color: 'var(--cg-gold)' }}>•</span>
          <span>Developed with <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" /> for IEHE by <strong style={{ color: 'var(--cg-gold)' }}>Ram Vishwakarma</strong></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

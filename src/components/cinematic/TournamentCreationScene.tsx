import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTournament } from '../../context/TournamentContext';
import { useScroll } from '../../context/ScrollContext';
import type { TournamentSize, TimeControlType } from '../../types/tournament';
import { 
  Trophy, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Settings2,
  MapPin,
  Building2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface TournamentCreationSceneProps {
  onOpenNewTournament?: () => void;
  onCommandCenter?: () => void;
}

const FORMATS = [
  { id: 'knockout', name: 'Knockout Elimination', desc: 'Single loss elimination bracket with instant progression.', icon: '⚔' },
  { id: 'double_elimination', name: 'Double Elimination', desc: 'Winners and losers brackets ensuring secondary chances.', icon: '♜' },
  { id: 'swiss', name: 'Swiss System', desc: 'Non-elimination rounds pairing players with equal scores.', icon: '⇌' },
  { id: 'round_robin', name: 'Round Robin', desc: 'Every contender faces every other participant.', icon: '♟' },
];

const TIME_CONTROLS: { label: string; type: TimeControlType; initialMinutes: number; incrementSeconds: number; desc: string }[] = [
  { label: '3 + 2', type: 'blitz', initialMinutes: 3, incrementSeconds: 2, desc: '3 min base + 2s increment' },
  { label: '5 + 0', type: 'blitz', initialMinutes: 5, incrementSeconds: 0, desc: '5 min sudden death' },
  { label: '10 + 5', type: 'rapid', initialMinutes: 10, incrementSeconds: 5, desc: '10 min base + 5s increment' },
  { label: '15 + 10', type: 'classical', initialMinutes: 15, incrementSeconds: 10, desc: '15 min base + 10s increment' },
];

const CAPACITIES: TournamentSize[] = [8, 16, 32, 64];

export const TournamentCreationScene: React.FC<TournamentCreationSceneProps> = ({
  onOpenNewTournament,
  onCommandCenter,
}) => {
  const { settings, updateSettings, players } = useTournament();
  const { waypoint, waypointProgress } = useScroll();

  const [selectedFormat, setSelectedFormat] = useState('knockout');
  const [selectedTimeControl, setSelectedTimeControl] = useState('10 + 5');
  const [selectedCapacity, setSelectedCapacity] = useState<TournamentSize>(settings.totalPlayers || 16);
  const [tournamentName, setTournamentName] = useState(settings.name || 'ChessGrid Masters Open Championship 2026');
  const [organization, setOrganization] = useState(settings.collegeName || 'Global Chess Federation & Arena Hub');
  const [venue, setVenue] = useState(settings.venue || 'Grand Arena Stage & Broadcast Hall');
  const [isSaved, setIsSaved] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Trigger reveal animation when scrolling to tournament waypoint
  useEffect(() => {
    if (waypoint === 'tournament' && waypointProgress > 0.1 && !isRevealed) {
      setIsRevealed(true);
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll('[data-reveal]'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }
        );
      }
    }
  }, [waypoint, waypointProgress, isRevealed]);

  const handleApplyPreset = () => {
    soundEffects.playPieceMove();
    const tcObj = TIME_CONTROLS.find(t => t.label === selectedTimeControl) || TIME_CONTROLS[2];
    updateSettings({
      name: tournamentName,
      collegeName: organization,
      venue: venue,
      totalPlayers: selectedCapacity,
      defaultTimeControl: {
        type: tcObj.type,
        initialMinutes: tcObj.initialMinutes,
        incrementSeconds: tcObj.incrementSeconds,
        label: tcObj.label,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <section
      id="cg-section-tournament-creation"
      ref={containerRef}
      aria-label="Tournament Creation & Governance Engine"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '6rem 1.5rem',
        background: 'transparent',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* 3D background ambient grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }} data-reveal>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              marginBottom: '1rem',
            }}
          >
            <Settings2 className="w-3.5 h-3.5" style={{ color: 'var(--cg-gold)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'var(--cg-gold)',
                textTransform: 'uppercase',
              }}
            >
              CHAPTER 02 — TOURNAMENT CREATION & GOVERNANCE
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: 'var(--cg-ivory)',
              lineHeight: 1.15,
              margin: '0 0 1rem',
            }}
          >
            Orchestrate Any Tournament Worldwide
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              color: 'var(--cg-ivory-dim)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Designed for clubs, federations, schools, community leagues, and open world championships. Configure brackets, time controls, and seeding logic in seconds.
          </p>
        </div>

        {/* Futuristic Configuration Deck */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Organization & Arena Info */}
          <div
            data-reveal
            style={{
              background: 'rgba(15,15,18,0.75)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cg-gold)',
                }}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-cinematic)',
                    fontSize: '1.3rem',
                    color: 'var(--cg-ivory)',
                    margin: 0,
                  }}
                >
                  Event & Organization
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(200,192,174,0.5)',
                    letterSpacing: '0.1em',
                  }}
                >
                  OFFICIAL METADATA
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--cg-gold)',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  Tournament Name
                </label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(8,8,10,0.85)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '6px',
                    color: 'var(--cg-ivory)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--cg-gold)',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  Organizer / Federation / Club
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(8,8,10,0.85)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '6px',
                    color: 'var(--cg-ivory)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'var(--cg-gold)',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  Venue & Stage Location
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin className="w-4 h-4" style={{ color: 'rgba(201,168,76,0.6)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(8,8,10,0.85)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '6px',
                      color: 'var(--cg-ivory)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Format & Player Capacity */}
          <div
            data-reveal
            style={{
              background: 'rgba(15,15,18,0.75)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cg-gold)',
                }}
              >
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-cinematic)',
                    fontSize: '1.3rem',
                    color: 'var(--cg-ivory)',
                    margin: 0,
                  }}
                >
                  Tournament System
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(200,192,174,0.5)',
                    letterSpacing: '0.1em',
                  }}
                >
                  FORMAT & BRACKET ENGINE
                </span>
              </div>
            </div>

            {/* Format Selection Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {FORMATS.map((f) => {
                const isSelected = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFormat(f.id);
                      soundEffects.playPieceMove();
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem',
                      background: isSelected ? 'rgba(201,168,76,0.12)' : 'rgba(8,8,10,0.7)',
                      border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201,168,76,0.15)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                      {isSelected && <Sparkles className="w-3 h-3" style={{ color: 'var(--cg-gold)' }} />}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {f.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.6rem',
                        color: 'rgba(200,192,174,0.5)',
                        lineHeight: 1.3,
                      }}
                    >
                      {f.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Capacity Pills */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--cg-gold)',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                Player Capacity Bracket
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {CAPACITIES.map((cap) => {
                  const isSelected = selectedCapacity === cap;
                  return (
                    <button
                      key={cap}
                      onClick={() => {
                        setSelectedCapacity(cap);
                        soundEffects.playPieceMove();
                      }}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0',
                        textAlign: 'center',
                        background: isSelected ? 'rgba(201,168,76,0.18)' : 'rgba(8,8,10,0.8)',
                        border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201,168,76,0.15)'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-stat)',
                          fontSize: '1.2rem',
                          color: isSelected ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                          lineHeight: 1,
                        }}
                      >
                        {cap}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          color: 'rgba(200,192,174,0.4)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        PLAYERS
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Clocks & Seeding Rules */}
          <div
            data-reveal
            style={{
              background: 'rgba(15,15,18,0.75)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cg-gold)',
                }}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-cinematic)',
                    fontSize: '1.3rem',
                    color: 'var(--cg-ivory)',
                    margin: 0,
                  }}
                >
                  Time Control & Rules
                </h3>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(200,192,174,0.5)',
                    letterSpacing: '0.1em',
                  }}
                >
                  ARBITER & CLOCK STANDARDS
                </span>
              </div>
            </div>

            {/* Time Control Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {TIME_CONTROLS.map((tc) => {
                const isSelected = selectedTimeControl === tc.label;
                return (
                  <button
                    key={tc.label}
                    onClick={() => {
                      setSelectedTimeControl(tc.label);
                      soundEffects.playPieceMove();
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem',
                      background: isSelected ? 'rgba(201,168,76,0.12)' : 'rgba(8,8,10,0.7)',
                      border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201,168,76,0.15)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-stat)',
                        fontSize: '1.1rem',
                        color: isSelected ? 'var(--cg-gold-bright)' : 'var(--cg-ivory)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {tc.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--cg-gold)',
                        textTransform: 'uppercase',
                        margin: '0.15rem 0',
                      }}
                    >
                      {tc.type}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        color: 'rgba(200,192,174,0.45)',
                      }}
                    >
                      {tc.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Seeding & Rules Note */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(34,166,122,0.06)',
                border: '1px solid rgba(34,166,122,0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--cg-emerald-bright)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--cg-ivory)',
                    margin: '0 0 0.2rem',
                  }}
                >
                  Arbiter Auto-Seeding Enabled
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.65rem',
                    color: 'rgba(200,192,174,0.6)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Universal pairing engine automatically implements FIDE deterministic seeding brackets and bye distributions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Launch Hub */}
        <div
          data-reveal
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            padding: '1.5rem 2rem',
            background: 'rgba(10,10,11,0.9)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--cg-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Users className="w-4 h-4" />
              <span>ACTIVE ROSTER: {players.length} CONTENDERS</span>
            </div>
            {isSaved && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--cg-emerald-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ARENA CONFIG APPLIED</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleApplyPreset}
              style={{
                padding: '0.75rem 1.4rem',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: '8px',
                color: 'var(--cg-gold-bright)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              SAVE ARENA CONFIG
            </button>

            {onOpenNewTournament ? (
              <button
                onClick={onOpenNewTournament}
                style={{
                  padding: '0.75rem 1.6rem',
                  background: 'linear-gradient(135deg, var(--cg-gold) 0%, #997828 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0a0a0b',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>CREATE TOURNAMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : onCommandCenter ? (
              <button
                onClick={onCommandCenter}
                style={{
                  padding: '0.75rem 1.6rem',
                  background: 'linear-gradient(135deg, var(--cg-gold) 0%, #997828 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0a0a0b',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentCreationScene;

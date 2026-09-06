import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Sparkles } from '@react-three/drei';
import { 
  King3D, 
  Queen3D, 
  Rook3D, 
  Bishop3D, 
  Knight3D, 
  Pawn3D 
} from './three/ChessPieceGeometries';
import { soundEffects } from '../../utils/soundEffects';
import { Sparkles as SparklesIcon, Swords, RotateCw } from 'lucide-react';

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type MaterialType = 'gold' | 'ivory' | 'obsidian' | 'emerald';

interface PieceInfo {
  type: PieceType;
  name: string;
  points: string;
  role: string;
  description: string;
  tacticalQuote: string;
  moves: string;
}

const PIECE_DATA: Record<PieceType, PieceInfo> = {
  king: {
    type: 'king',
    name: 'The Sovereign King',
    points: 'Infinite',
    role: 'Commander & Heart of the Arena',
    description: 'The decisive piece whose fate dictates the outcome of the battle. Moves one square in any direction.',
    tacticalQuote: '“In the endgame, the King transforms from a protected monarch into an aggressive conqueror.”',
    moves: '1 square in any direction • Castling rights',
  },
  queen: {
    type: 'queen',
    name: 'The Grandmaster Queen',
    points: '9 Points',
    role: 'Supreme Tactical Dominator',
    description: 'The most versatile and powerful piece on the board, combining the range of both the Rook and Bishop.',
    tacticalQuote: '“The Queen commands every diagonal and file with lethal tactical geometry.”',
    moves: 'Any number of squares along ranks, files, or diagonals',
  },
  rook: {
    type: 'rook',
    name: 'The Fortress Rook',
    points: '5 Points',
    role: 'Heavy Artillery & Open File Infiltrator',
    description: 'Specializes in seizing open files, controlling the 7th rank, and anchoring powerful battery formations.',
    tacticalQuote: '“Place your rooks on open files and watch the enemy defenses crumble.”',
    moves: 'Any number of squares vertically or horizontally',
  },
  bishop: {
    type: 'bishop',
    name: 'The Diagonal Bishop',
    points: '3 Points',
    role: 'Long-Range Diagonal Sniper',
    description: 'Slices across the board along unbroken color diagonals, exerting cross-board pressure.',
    tacticalQuote: '“The Bishop pair cuts through enemy ranks like surgical lasers.”',
    moves: 'Any number of squares diagonally',
  },
  knight: {
    type: 'knight',
    name: 'The Leaping Knight',
    points: '3 Points',
    role: 'Subversive Outpost Tactician',
    description: 'The only piece that can jump over other combatants, delivering unpredictable tactical forks.',
    tacticalQuote: '“A Knight on the rim is dim, but a central outpost is devastating.”',
    moves: 'L-shape (2 squares in one direction, 1 square perpendicular)',
  },
  pawn: {
    type: 'pawn',
    name: 'The Valiant Pawn',
    points: '1 Point (Potential Queen)',
    role: 'Structure Architect & Future Champion',
    description: 'The soul of chess. Dictates pawn structure, space control, and the potential for glorious coronation.',
    tacticalQuote: '“Pawns are the soul of the game; every step forward is irreversible.”',
    moves: '1 step forward (2 on first move), captures diagonally',
  },
};

export const InteractivePieceVisualizer: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<PieceType>('king');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('gold');

  const info = PIECE_DATA[selectedPiece];

  const handleSelectPiece = (type: PieceType) => {
    setSelectedPiece(type);
    soundEffects.playPieceMove();
  };

  const handleSelectMaterial = (mat: MaterialType) => {
    setSelectedMaterial(mat);
    soundEffects.playClockClick();
  };

  return (
    <section
      id="cg-section-piece-visualizer"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      style={{ zIndex: 20 }}
    >
      <div
        className="p-8 sm:p-12 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.9) 0%, rgba(10, 10, 12, 0.98) 100%)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(201, 168, 76, 0.28)',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px rgba(201,168,76,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded text-[11px] font-mono tracking-widest bg-[rgba(201,168,76,0.12)] text-[var(--cg-gold)] border border-[rgba(201,168,76,0.3)]">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>3D CHESS ARTIFACT INSPECTOR</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 400,
                letterSpacing: '0.04em',
                color: 'var(--cg-ivory)',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              INTERACTIVE PIECE SHOWCASE
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(200,192,174,0.65)]" style={{ fontFamily: 'var(--font-sans)' }}>
              Inspect procedural 3D lathe geometries in real-time. Rotate and switch materials to examine every curve.
            </p>
          </div>

          {/* Material Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[rgba(200,192,174,0.5)] mr-1">MATERIAL:</span>
            {[
              { id: 'gold' as MaterialType, label: 'Grandmaster Gold', color: '#e8c45a' },
              { id: 'ivory' as MaterialType, label: 'Royal Ivory', color: '#f0ece1' },
              { id: 'obsidian' as MaterialType, label: 'Dark Obsidian', color: '#2a2b33' },
              { id: 'emerald' as MaterialType, label: 'Emerald Matrix', color: '#22a67a' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleSelectMaterial(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedMaterial === m.id
                    ? 'bg-[rgba(201,168,76,0.22)] border-[var(--cg-gold)] text-white shadow-lg'
                    : 'bg-[#141418] border-white/10 text-slate-400 hover:text-white'
                }`}
                style={{ border: `1px solid ${selectedMaterial === m.id ? 'var(--cg-gold)' : 'rgba(255,255,255,0.1)'}` }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main 3D Canvas + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
          
          {/* Left: 3D Viewport */}
          <div className="lg:col-span-7 h-[380px] sm:h-[440px] rounded-2xl relative overflow-hidden bg-[#0a0a0c] border border-[rgba(201,168,76,0.2)] shadow-2xl">
            {/* 3D Canvas */}
            <Canvas
              shadows
              camera={{ position: [0, 1.2, 3.8], fov: 42 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow color="#fff4d0" />
              <pointLight position={[-5, -2, -3]} intensity={0.8} color="#22a67a" />
              <pointLight position={[0, 4, 2]} intensity={1.2} color="#c9a84c" />

              <Stars radius={40} depth={20} count={300} factor={3} saturation={0.5} fade />
              <Sparkles count={40} scale={4} size={2} speed={0.4} color="#e8c45a" opacity={0.6} />

              <Suspense fallback={null}>
                <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
                  <group position={[0, -0.6, 0]}>
                    {selectedPiece === 'king' && <King3D scale={1.25} materialType={selectedMaterial} />}
                    {selectedPiece === 'queen' && <Queen3D scale={1.25} materialType={selectedMaterial} />}
                    {selectedPiece === 'rook' && <Rook3D scale={1.25} materialType={selectedMaterial} />}
                    {selectedPiece === 'bishop' && <Bishop3D scale={1.25} materialType={selectedMaterial} />}
                    {selectedPiece === 'knight' && <Knight3D scale={1.25} materialType={selectedMaterial} />}
                    {selectedPiece === 'pawn' && <Pawn3D scale={1.3} materialType={selectedMaterial} />}
                  </group>
                </Float>
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.8}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={(3 * Math.PI) / 4}
              />
            </Canvas>

            {/* Orbit hint overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-mono text-[rgba(200,192,174,0.5)] pointer-events-none">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
              <span>Drag to orbit 360° • Auto-rotating</span>
            </div>
          </div>

          {/* Right: Piece Selector & Tactical Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Piece Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
              {(['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'] as PieceType[]).map(type => {
                const isSelected = selectedPiece === type;
                const icons: Record<PieceType, string> = {
                  king: '♚',
                  queen: '♛',
                  rook: '♜',
                  bishop: '♝',
                  knight: '♞',
                  pawn: '♟',
                };
                return (
                  <button
                    key={type}
                    onClick={() => handleSelectPiece(type)}
                    className="p-3 rounded-xl flex flex-col items-center gap-1 transition-all"
                    style={{
                      background: isSelected ? 'rgba(201, 168, 76, 0.2)' : 'rgba(18, 18, 22, 0.6)',
                      border: `1px solid ${isSelected ? 'var(--cg-gold)' : 'rgba(201, 168, 76, 0.15)'}`,
                      boxShadow: isSelected ? '0 0 15px rgba(201, 168, 76, 0.3)' : 'none',
                    }}
                  >
                    <span className="text-2xl">{icons[type]}</span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200">
                      {type}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tactical Intel Box */}
            <div
              className="p-6 rounded-2xl space-y-4"
              style={{
                background: 'rgba(14, 14, 17, 0.85)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[var(--cg-gold)] uppercase tracking-widest">
                    {info.role}
                  </span>
                  <h3
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-cinematic)', color: 'var(--cg-ivory)' }}
                  >
                    {info.name}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-[rgba(201,168,76,0.15)] text-[var(--cg-gold-bright)] border border-[rgba(201,168,76,0.35)]">
                  {info.points}
                </span>
              </div>

              <p className="text-xs text-[rgba(200,192,174,0.8)] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                {info.description}
              </p>

              <blockquote className="p-3 rounded-xl bg-black/40 border-l-2 border-[var(--cg-gold)] text-[11px] italic text-[rgba(200,192,174,0.7)]">
                {info.tacticalQuote}
              </blockquote>

              <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--cg-emerald-bright)]">
                <Swords className="w-3.5 h-3.5" />
                <span>Move rule: {info.moves}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractivePieceVisualizer;

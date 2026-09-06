import React, { useState, useCallback } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { LoadingScreen } from './components/cinematic/LoadingScreen';
import { CinematicShell } from './components/cinematic/CinematicShell';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicDisplayMode } from './components/projector/PublicDisplayMode';

// Dashboard
import { TournamentOverview } from './components/dashboard/TournamentOverview';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { RoundProgress } from './components/dashboard/RoundProgress';
import { ActiveMatchesWidget } from './components/dashboard/ActiveMatchesWidget';
import { UpcomingMatchesWidget } from './components/dashboard/UpcomingMatchesWidget';
import { AnnouncementsWidget } from './components/dashboard/AnnouncementsWidget';

// Players
import { PlayerTable } from './components/players/PlayerTable';
import { PlayerRegistrationModal } from './components/players/PlayerRegistrationModal';
import { PlayerProfileModal } from './components/players/PlayerProfileModal';
import { BulkImportModal } from './components/players/BulkImportModal';

// Bracket & Pairing
import { KnockoutBracket } from './components/bracket/KnockoutBracket';
import { ManualPairingModal } from './components/bracket/ManualPairingModal';

// Matches
import { MatchList } from './components/matches/MatchList';
import { MatchDetailsModal } from './components/matches/MatchDetailsModal';
import { ResultEntryModal } from './components/matches/ResultEntryModal';
import { UndoResultModal } from './components/matches/UndoResultModal';

// Live & Boards
import { LiveMatchesView } from './components/live/LiveMatchesView';
import { BoardManagement } from './components/live/BoardManagement';

// History & Reports
import { EliminatedView } from './components/eliminated/EliminatedView';
import { HistoryView } from './components/history/HistoryView';
import { ExportReportModal } from './components/history/ExportReportModal';
import { NewTournamentModal } from './components/common/NewTournamentModal';

// Settings
import { TournamentSettingsView } from './components/settings/TournamentSettings';
import { RulesEditor } from './components/settings/RulesEditor';
import { BackupRestore } from './components/settings/BackupRestore';

import type { Player, Match } from './types/tournament';


const MainApp: React.FC = () => {
  const { activeTab, isProjectorMode } = useTournament();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [isNewTournamentOpen, setIsNewTournamentOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState<Player | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isShuffleModalOpen, setIsShuffleModalOpen] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMatchDetailsOpen, setIsMatchDetailsOpen] = useState(false);
  const [isResultEntryOpen, setIsResultEntryOpen] = useState(false);
  const [isUndoModalOpen, setIsUndoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenMatchDetails = (match: Match) => {
    setSelectedMatch(match);
    setIsMatchDetailsOpen(true);
  };

  const handleOpenResultEntry = (match: Match) => {
    setSelectedMatch(match);
    setIsResultEntryOpen(true);
  };

  const handleOpenUndo = (match: Match) => {
    setSelectedMatch(match);
    setIsUndoModalOpen(true);
  };

  // If Public Display Mode is active, render Fullscreen display only
  if (isProjectorMode) {
    return <PublicDisplayMode />;
  }

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans"
      style={{
        background: 'radial-gradient(ellipse at 25% 15%, rgba(201,168,76,0.035) 0%, transparent 60%), radial-gradient(ellipse at 75% 85%, rgba(26,122,94,0.03) 0%, transparent 50%), var(--cg-obsidian)',
        minHeight: '100vh',
      }}
    >
      
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        onOpenNewTournament={() => setIsNewTournamentOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 lg:pl-68 w-full transition-all duration-200">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <TournamentOverview
                onOpenShuffleModal={() => setIsShuffleModalOpen(true)}
                onOpenRegisterModal={() => {
                  setPlayerToEdit(null);
                  setIsRegisterOpen(true);
                }}
                onOpenNewTournament={() => setIsNewTournamentOpen(true)}
              />

              <StatsGrid onOpenShuffleModal={() => setIsShuffleModalOpen(true)} />

              <RoundProgress />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ActiveMatchesWidget
                    onOpenMatchModal={handleOpenMatchDetails}
                    onOpenResultModal={handleOpenResultEntry}
                  />

                  <UpcomingMatchesWidget
                    onOpenMatchModal={handleOpenMatchDetails}
                  />
                </div>

                <div>
                  <AnnouncementsWidget />
                </div>
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === 'players' && (
            <div className="animate-in fade-in duration-150">
              <PlayerTable
                onOpenRegisterModal={() => {
                  setPlayerToEdit(null);
                  setIsRegisterOpen(true);
                }}
                onOpenEditModal={player => {
                  setPlayerToEdit(player);
                  setIsRegisterOpen(true);
                }}
                onOpenProfileModal={player => setSelectedProfilePlayer(player)}
                onOpenBulkImport={() => setIsBulkImportOpen(true)}
                onOpenShuffleModal={() => setIsShuffleModalOpen(true)}
                onOpenNewTournament={() => setIsNewTournamentOpen(true)}
              />
            </div>
          )}

          {/* Knockout Bracket Tab */}
          {activeTab === 'bracket' && (
            <div className="animate-in fade-in duration-150">
              <KnockoutBracket
                onOpenMatchModal={handleOpenMatchDetails}
                onOpenShuffleModal={() => setIsShuffleModalOpen(true)}
              />
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div className="animate-in fade-in duration-150">
              <MatchList
                onOpenMatchModal={handleOpenMatchDetails}
                onOpenResultModal={handleOpenResultEntry}
              />
            </div>
          )}

          {/* Live Matches Tab */}
          {activeTab === 'live' && (
            <div className="animate-in fade-in duration-150">
              <LiveMatchesView
                onOpenMatchModal={handleOpenMatchDetails}
                onOpenResultModal={handleOpenResultEntry}
              />
            </div>
          )}

          {/* Boards / Table Tab */}
          {activeTab === 'boards' && (
            <div className="animate-in fade-in duration-150">
              <BoardManagement
                onOpenMatchModal={handleOpenMatchDetails}
                onOpenResultModal={handleOpenResultEntry}
              />
            </div>
          )}

          {/* Eliminated Players Tab */}
          {activeTab === 'eliminated' && (
            <div className="animate-in fade-in duration-150">
              <EliminatedView
                onOpenProfileModal={player => setSelectedProfilePlayer(player)}
              />
            </div>
          )}

          {/* Match History Tab */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-150">
              <HistoryView
                onOpenMatchModal={handleOpenMatchDetails}
                onOpenUndoModal={handleOpenUndo}
              />
            </div>
          )}

          {/* Tournament Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <TournamentSettingsView />
              <RulesEditor />
              <BackupRestore />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Modals */}
      <NewTournamentModal
        isOpen={isNewTournamentOpen}
        onClose={() => setIsNewTournamentOpen(false)}
      />

      <PlayerRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        playerToEdit={playerToEdit}
      />

      <PlayerProfileModal
        player={selectedProfilePlayer}
        isOpen={selectedProfilePlayer !== null}
        onClose={() => setSelectedProfilePlayer(null)}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />

      <ManualPairingModal
        isOpen={isShuffleModalOpen}
        onClose={() => setIsShuffleModalOpen(false)}
      />

      <MatchDetailsModal
        match={selectedMatch}
        isOpen={isMatchDetailsOpen}
        onClose={() => setIsMatchDetailsOpen(false)}
        onOpenResultModal={handleOpenResultEntry}
        onOpenUndoModal={handleOpenUndo}
      />

      <ResultEntryModal
        match={selectedMatch}
        isOpen={isResultEntryOpen}
        onClose={() => setIsResultEntryOpen(false)}
      />

      <UndoResultModal
        match={selectedMatch}
        isOpen={isUndoModalOpen}
        onClose={() => setIsUndoModalOpen(false)}
      />

      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

type ViewMode = 'loading' | 'cinematic' | 'command';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('loading');

  const handleLoadComplete = useCallback(() => {
    setViewMode('cinematic');
  }, []);

  const handleEnterCommand = useCallback(() => {
    setViewMode('command');
  }, []);

  const handleBackToCinematic = useCallback(() => {
    setViewMode('cinematic');
  }, []);

  if (viewMode === 'loading') {
    return <LoadingScreen onComplete={handleLoadComplete} />;
  }

  if (viewMode === 'cinematic') {
    return (
      <TournamentProvider>
        <CinematicShell onCommandCenter={handleEnterCommand} />
      </TournamentProvider>
    );
  }

  // 'command' mode — full admin dashboard
  return (

    <TournamentProvider>
      <div style={{ position: 'relative' }}>
        {/* Back to Arena button */}
        <button
          onClick={handleBackToCinematic}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            background: 'rgba(10,10,11,0.9)',
            border: '1px solid rgba(201,168,76,0.35)',
            color: 'var(--cg-gold)',
            padding: '0.6rem 1.2rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            borderRadius: '2px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(10,10,11,0.9)'; }}
        >
          ♛ &nbsp; Back to Arena
        </button>
        <MainApp />
      </div>
    </TournamentProvider>
  );
}

export default App;

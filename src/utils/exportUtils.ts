import type { Player, Match, TournamentSettings } from '../types/tournament';

// Export Tournament to JSON file
export function exportTournamentJSON(
  settings: TournamentSettings,
  players: Player[],
  matches: Match[],
  announcements: unknown[]
) {
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    settings,
    players,
    matches,
    announcements,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${settings.name.replace(/\s+/g, '_')}_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Players to CSV
export function exportPlayersCSV(players: Player[], tournamentName: string) {
  const headers = ['Seed', 'Name', 'Roll Number', 'Course', 'Year', 'Semester', 'Section', 'Status', 'Matches Played', 'Wins', 'Losses', 'Current Round', 'Eliminated In', 'Phone', 'Email'];
  const rows = players.map(p => [
    p.seed,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.rollNumber}"`,
    `"${p.course}"`,
    `"${p.year}"`,
    `"${p.semester}"`,
    `"${p.section}"`,
    p.status,
    p.matchesPlayed,
    p.wins,
    p.losses,
    `"${p.currentRound || ''}"`,
    `"${p.eliminatedInRound || ''}"`,
    `"${p.phone || ''}"`,
    `"${p.email || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tournamentName.replace(/\s+/g, '_')}_Players_Roster.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Matches History to CSV
export function exportMatchesCSV(matches: Match[], players: Player[], tournamentName: string) {
  const playerMap = new Map(players.map(p => [p.id, p.name]));
  const headers = ['Match ID', 'Round', 'Board', 'White Player', 'Black Player', 'Result', 'Winner', 'Time Control', 'Start Time', 'End Time', 'Notes'];

  const rows = matches
    .filter(m => m.status === 'completed')
    .map(m => [
      m.id,
      `"${m.roundName}"`,
      m.boardNumber || '-',
      `"${playerMap.get(m.whitePlayerId || '') || 'TBD'}"`,
      `"${playerMap.get(m.blackPlayerId || '') || 'TBD'}"`,
      `"${m.resultType || '-'}"`,
      `"${playerMap.get(m.winnerPlayerId || '') || '-'}"`,
      `"${m.timeControl.label || `${m.timeControl.initialMinutes}+${m.timeControl.incrementSeconds}`}"`,
      `"${m.startTime || ''}"`,
      `"${m.endTime || ''}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`
    ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tournamentName.replace(/\s+/g, '_')}_Match_Results.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Print trigger helper
export function triggerBrowserPrint() {
  window.print();
}

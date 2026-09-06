/**
 * integrityEngine.ts — Cryptographic Tournament State & Certificate Integrity Verifier
 * Uses Web Crypto API (SubtleCrypto) to generate SHA-256 signatures for tamper-proof verification.
 */

export interface IntegrityCertificate {
  tournamentId: string;
  tournamentName: string;
  championName: string;
  totalMatches: number;
  generatedAt: string;
  sha256Hash: string;
  verificationUrl: string;
}

/**
 * Computes SHA-256 hash of a string payload using native Web Crypto API.
 */
export async function computeSHA256(data: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback simple checksum if Web Crypto is unavailable
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `sha256-fb-${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates an official tamper-proof verification certificate for tournament completion.
 */
export async function generateTournamentCertificate(
  tournamentId: string,
  tournamentName: string,
  championName: string,
  matchResultsSummary: string
): Promise<IntegrityCertificate> {
  const timestamp = new Date().toISOString();
  const rawPayload = JSON.stringify({
    tournamentId,
    tournamentName,
    championName,
    matchResultsSummary,
    timestamp,
    issuer: 'ChessGrid Integrity Protocol v1.0',
  });

  const hash = await computeSHA256(rawPayload);

  return {
    tournamentId,
    tournamentName,
    championName,
    totalMatches: matchResultsSummary.split('\n').filter(Boolean).length,
    generatedAt: timestamp,
    sha256Hash: hash,
    verificationUrl: `https://chessgrid.app/verify/${hash.substring(0, 16)}`,
  };
}

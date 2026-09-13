import type { SpeechRecognitionProvider, VoiceError } from './types';

// Browser Web Speech API type definitions for TypeScript
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => IWindowSpeechRecognition;
    webkitSpeechRecognition?: new () => IWindowSpeechRecognition;
  }
}

/**
 * BrowserSpeechRecognitionProvider
 *
 * Implements the SpeechRecognitionProvider interface using the standard
 * W3C Web Speech API (window.SpeechRecognition / webkitSpeechRecognition).
 */
export class BrowserSpeechRecognitionProvider implements SpeechRecognitionProvider {
  private recognition: IWindowSpeechRecognition | null = null;
  private isContinuous = true;
  private shouldBeRunning = false;
  private restartTimeout: ReturnType<typeof setTimeout> | null = null;

  // Callback listeners
  private resultListeners = new Set<(transcript: string, isFinal: boolean, confidence: number) => void>();
  private errorListeners = new Set<(error: VoiceError) => void>();
  private startListeners = new Set<() => void>();
  private endListeners = new Set<() => void>();

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = this.isContinuous;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.startListeners.forEach(cb => cb());
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let highestConfidence = 1.0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const topAlternative = result[0];
          if (result.isFinal) {
            finalTranscript += topAlternative.transcript;
            highestConfidence = topAlternative.confidence || 0.95;
          } else {
            interimTranscript += topAlternative.transcript;
          }
        }

        if (finalTranscript.trim()) {
          this.resultListeners.forEach(cb => cb(finalTranscript.trim(), true, highestConfidence));
        } else if (interimTranscript.trim()) {
          this.resultListeners.forEach(cb => cb(interimTranscript.trim(), false, 0.5));
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Ignore expected harmless events like 'no-speech' or 'aborted'
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }

        const voiceError = this.mapError(event.error);
        this.errorListeners.forEach(cb => cb(voiceError));
      };

      this.recognition.onend = () => {
        this.endListeners.forEach(cb => cb());

        // In continuous mode, if speech should remain active, auto-restart with safety debounce
        if (this.shouldBeRunning && this.isContinuous) {
          if (this.restartTimeout) clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.shouldBeRunning) {
              try {
                this.recognition?.start();
              } catch {
                // Ignore already started errors
              }
            }
          }, 300);
        }
      };
    } catch {
      this.recognition = null;
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  setContinuous(continuous: boolean): void {
    this.isContinuous = continuous;
    if (this.recognition) {
      this.recognition.continuous = continuous;
    }
  }

  start(): void {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      this.errorListeners.forEach(cb =>
        cb({
          code: 'not_supported',
          message: 'Speech recognition is not supported in this browser.',
          isFatal: true,
        })
      );
      return;
    }

    this.shouldBeRunning = true;
    try {
      this.recognition.start();
    } catch (e: any) {
      // If already started, do nothing
      if (e?.name !== 'InvalidStateError') {
        this.shouldBeRunning = false;
      }
    }
  }

  stop(): void {
    this.shouldBeRunning = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    try {
      this.recognition?.stop();
    } catch {
      // Ignore errors when stopping
    }
  }

  abort(): void {
    this.shouldBeRunning = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    try {
      this.recognition?.abort();
    } catch {
      // Ignore errors when aborting
    }
  }

  onResult(callback: (transcript: string, isFinal: boolean, confidence: number) => void): () => void {
    this.resultListeners.add(callback);
    return () => this.resultListeners.delete(callback);
  }

  onError(callback: (error: VoiceError) => void): () => void {
    this.errorListeners.add(callback);
    return () => this.errorListeners.delete(callback);
  }

  onStart(callback: () => void): () => void {
    this.startListeners.add(callback);
    return () => this.startListeners.delete(callback);
  }

  onEnd(callback: () => void): () => void {
    this.endListeners.add(callback);
    return () => this.endListeners.delete(callback);
  }

  private mapError(browserError: string): VoiceError {
    switch (browserError) {
      case 'not-allowed':
        return {
          code: 'permission_denied',
          message: 'Microphone permission was denied. Please allow microphone access in your browser settings.',
          isFatal: true,
        };
      case 'audio-capture':
        return {
          code: 'no_microphone',
          message: 'No microphone was detected. Please verify your microphone is connected.',
          isFatal: true,
        };
      case 'network':
        return {
          code: 'network_error',
          message: 'Network issue during speech recognition. Please check your internet connection.',
          isFatal: false,
        };
      default:
        return {
          code: 'unknown',
          message: `Voice recognition encountered an issue (${browserError}).`,
          isFatal: false,
        };
    }
  }
}

/**
 * Factory function to obtain the speech recognition provider
 */
export function createSpeechRecognitionProvider(): SpeechRecognitionProvider {
  return new BrowserSpeechRecognitionProvider();
}

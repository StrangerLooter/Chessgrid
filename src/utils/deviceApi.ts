/**
 * deviceApi.ts — Device Hardware API Suite (Wake Lock, Haptics, Fullscreen, Battery)
 */

class DeviceManager {
  private wakeLockSentinel: any = null;

  /**
   * Request Screen Wake Lock to prevent display from sleeping during live tournament rounds.
   */
  public async requestWakeLock(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return false;
    }
    try {
      this.wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      this.wakeLockSentinel.addEventListener('release', () => {
        this.wakeLockSentinel = null;
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Release Screen Wake Lock.
   */
  public releaseWakeLock() {
    if (this.wakeLockSentinel) {
      try {
        this.wakeLockSentinel.release();
      } catch {
        // Ignore
      }
      this.wakeLockSentinel = null;
    }
  }

  /**
   * Trigger haptic vibration on mobile devices.
   */
  public triggerHaptic(durationMs: number = 15) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Toggle Fullscreen for Venue / Stage Projector display.
   */
  public async toggleFullscreen(element?: HTMLElement): Promise<boolean> {
    if (typeof document === 'undefined') return false;

    if (!document.fullscreenElement) {
      const target = element || document.documentElement;
      try {
        await target.requestFullscreen();
        return true;
      } catch {
        return false;
      }
    } else {
      try {
        await document.exitFullscreen();
        return false;
      } catch {
        return false;
      }
    }
  }

  /**
   * Check if battery saver / low power is active.
   */
  public async isLowBattery(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery: any = await (navigator as any).getBattery();
        return battery.level < 0.2 && !battery.charging;
      } catch {
        return false;
      }
    }
    return false;
  }
}

export const deviceManager = new DeviceManager();
export default deviceManager;

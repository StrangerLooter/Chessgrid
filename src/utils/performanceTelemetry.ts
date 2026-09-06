/**
 * performanceTelemetry.ts — Real-time Web Vitals & Telemetry Engine
 * Tracks Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Frame Rates (FPS).
 */

export interface TelemetryMetrics {
  fps: number;
  memoryUsageMb?: number;
  cls: number;
  lcp: number;
}

class PerformanceTelemetry {
  private frameCount = 0;
  private lastFpsUpdate = performance.now();
  private currentFps = 60;
  private clsScore = 0;
  private lcpScore = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initObservers();
      this.startFpsLoop();
    }
  }

  private initObservers() {
    try {
      // Layout shift observer
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            this.clsScore += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // LCP observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          this.lcpScore = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Observers not supported
    }
  }

  private startFpsLoop() {
    const loop = () => {
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsUpdate >= 1000) {
        this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
        this.frameCount = 0;
        this.lastFpsUpdate = now;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  public getMetrics(): TelemetryMetrics {
    const perf: any = typeof performance !== 'undefined' ? performance : null;
    const memory = perf?.memory?.usedJSHeapSize
      ? Math.round(perf.memory.usedJSHeapSize / (1024 * 1024))
      : undefined;

    return {
      fps: this.currentFps,
      memoryUsageMb: memory,
      cls: Number(this.clsScore.toFixed(3)),
      lcp: Math.round(this.lcpScore),
    };
  }
}

export const performanceTelemetry = new PerformanceTelemetry();
export default performanceTelemetry;

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from '../../context/ScrollContext';

gsap.registerPlugin(ScrollTrigger);

interface ScrollOrchestratorProps {
  /** The scrollable container element (defaults to window if not provided) */
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * ScrollOrchestrator — GSAP ScrollTrigger controller.
 *
 * This component is "invisible" — it renders nothing.
 * It attaches a ScrollTrigger to the scroll container and
 * updates the ScrollContext with the current progress (0–100%).
 * All cinematic scenes read from ScrollContext to react.
 */
export const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({ containerRef }) => {
  const { setProgress } = useScroll();
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const scroller = containerRef?.current ?? window;

    // Small delay so DOM is fully mounted
    const timeout = setTimeout(() => {
      triggerRef.current = ScrollTrigger.create({
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setProgress(self.progress * 100);
        },
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      triggerRef.current?.kill();
    };
  }, [setProgress, containerRef]);

  return null;
};

export default ScrollOrchestrator;

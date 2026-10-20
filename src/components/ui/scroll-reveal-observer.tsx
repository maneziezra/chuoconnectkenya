'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Progressive-enhancement IntersectionObserver fallback for browsers that do not
 * yet support CSS Scroll-Driven Animations (`(animation-timeline: view()) and (animation-range: entry)`),
 * per modern-web-guidance `scroll-entry-exit-effects`.
 */
export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // Native CSS scroll-driven animations handle this on the compositor thread when supported
    if (CSS.supports?.('(animation-timeline: view()) and (animation-range: entry)')) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.opacity = String(Math.min(1, 0.25 + entry.intersectionRatio * 0.75));
            el.style.transform = `translateY(${Math.max(0, (1 - entry.intersectionRatio) * 16)}px)`;
          }
        }
      },
      {
        threshold: [0, 0.15, 0.35, 0.6, 0.85, 1],
      }
    );

    const targets = document.querySelectorAll('.scroll-reveal-card');
    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

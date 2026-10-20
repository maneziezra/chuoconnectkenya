'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Finish loading when route or searchParams settle
  useEffect(() => {
    if (!loading) return;
    setProgress(100);
    const doneTimer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 260);
    return () => clearTimeout(doneTimer);
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger instant loading bar
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      if (!href || target === '_blank' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        const currentUrl = window.location.pathname + window.location.search;
        const nextUrl = url.pathname + url.search;
        if (currentUrl === nextUrl) return;
        setLoading(true);
        setProgress(35);
      } catch {}
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Increment progress while waiting for server route
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgress(prev => (prev < 88 ? prev + (90 - prev) * 0.18 : prev));
    }, 180);
    return () => clearInterval(interval);
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        className="nav-progress-bar"
        style={{
          height: '100%',
          width: '100%',
          background: 'linear-gradient(90deg, var(--brand-navy), var(--accent-gold), #F59E0B)',
          boxShadow: '0 0 12px var(--accent-gold)',
          transformOrigin: 'left center',
          transform: `scaleX(${progress / 100})`,
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}

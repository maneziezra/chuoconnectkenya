import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'circle';
}

/**
 * shadcn/ui Skeleton component with compositor-safe shimmer and reduced-motion support.
 */
export function Skeleton({ className, variant = 'default', style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton-shimmer',
        variant === 'gold' && 'skeleton-gold',
        variant === 'circle' && 'skeleton-circle',
        className
      )}
      style={{
        borderRadius: variant === 'circle' ? '9999px' : 'var(--radius-md)',
        ...style,
      }}
      {...props}
    />
  );
}

export function PageHeroSkeleton() {
  return (
    <div style={{ padding: '0 20px', marginTop: 40 }} role="status" aria-label="Loading page header">
      <div
        style={{
          border: '1px solid var(--border-light)',
          borderTop: '1px solid var(--apple-glass-highlight)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-secondary)',
          padding: '48px 40px',
        }}
      >
        <div className="container">
          <Skeleton variant="gold" style={{ width: 140, height: 28, marginBottom: 16, borderRadius: 8 }} />
          <Skeleton style={{ width: 'min(520px, 90%)', height: 44, marginBottom: 14 }} />
          <Skeleton style={{ width: 'min(420px, 75%)', height: 20 }} />
        </div>
      </div>
    </div>
  );
}

export function UniversityCardSkeleton() {
  return (
    <div
      className="card"
      style={{
        border: '1px solid var(--border-light)',
        borderTop: '1px solid var(--apple-glass-highlight)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      <Skeleton style={{ width: '100%', height: 190, borderRadius: 0 }} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="gold" style={{ width: 68, height: 24, borderRadius: 6 }} />
          <Skeleton style={{ width: 56, height: 18 }} />
        </div>
        <Skeleton style={{ width: '85%', height: 24 }} />
        <Skeleton style={{ width: '60%', height: 16 }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Skeleton variant="gold" style={{ width: 48, height: 18 }} />
          <Skeleton style={{ width: 90, height: 16 }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 14,
            marginTop: 4,
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <Skeleton style={{ width: 80, height: 16 }} />
          <Skeleton variant="gold" style={{ width: 96, height: 18 }} />
        </div>
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div
      className="card"
      style={{
        padding: 24,
        border: '1px solid var(--border-light)',
        borderTop: '1px solid var(--apple-glass-highlight)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <Skeleton variant="gold" style={{ width: 110, height: 24, borderRadius: 6 }} />
        <Skeleton style={{ width: 90, height: 24, borderRadius: 6 }} />
      </div>
      <Skeleton style={{ width: '80%', height: 26 }} />
      <Skeleton style={{ width: '55%', height: 18 }} />
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        <Skeleton style={{ flex: 1, height: 52, borderRadius: 10 }} />
        <Skeleton style={{ flex: 1, height: 52, borderRadius: 10 }} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Skeleton variant="gold" style={{ flex: 1, height: 42, borderRadius: 12 }} />
        <Skeleton style={{ width: 110, height: 42, borderRadius: 12 }} />
      </div>
    </div>
  );
}

export function DirectorySkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <PageHeroSkeleton />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <UniversityCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

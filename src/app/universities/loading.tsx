import { PageHeroSkeleton, Skeleton, UniversityCardSkeleton } from '@/components/ui/skeleton';

export default function UniversitiesLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <PageHeroSkeleton />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }} className="uni-loading-grid">
            <aside
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--border-light)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <Skeleton style={{ width: '60%', height: 22 }} />
              <Skeleton style={{ width: '100%', height: 38, borderRadius: 10 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton style={{ width: '50%', height: 14 }} />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} style={{ width: '75%', height: 18 }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton style={{ width: '50%', height: 14 }} />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} style={{ width: '80%', height: 18 }} />
                ))}
              </div>
            </aside>
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <Skeleton style={{ flex: 1, height: 42, borderRadius: 9999 }} />
                <Skeleton style={{ width: 130, height: 42, borderRadius: 10 }} />
              </div>
              <Skeleton style={{ width: 220, height: 18, marginBottom: 20 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <UniversityCardSkeleton key={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

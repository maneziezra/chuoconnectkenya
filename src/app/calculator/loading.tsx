import { PageHeroSkeleton, Skeleton } from '@/components/ui/skeleton';

export default function CalculatorLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <PageHeroSkeleton />
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Skeleton variant="gold" style={{ width: 160, height: 24, borderRadius: 6 }} />
              <Skeleton style={{ width: '75%', height: 32 }} />
              {Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <Skeleton style={{ flex: 1, height: 42, borderRadius: 10 }} />
                  <Skeleton style={{ width: 110, height: 42, borderRadius: 10 }} />
                </div>
              ))}
              <Skeleton variant="gold" style={{ width: '100%', height: 48, borderRadius: 12, marginTop: 8 }} />
            </div>
            <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Skeleton style={{ width: '65%', height: 28 }} />
              <Skeleton style={{ width: '100%', height: 140, borderRadius: 16 }} />
              <Skeleton style={{ width: '100%', height: 120, borderRadius: 16 }} />
              <Skeleton style={{ width: '100%', height: 120, borderRadius: 16 }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

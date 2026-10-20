import { Skeleton } from '@/components/ui/skeleton';

export default function PortalLoading() {
  return (
    <div className="section" role="status" aria-live="polite" aria-busy="true">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Skeleton variant="gold" style={{ width: 140, height: 24, marginBottom: 10 }} />
            <Skeleton style={{ width: 320, height: 36 }} />
          </div>
          <Skeleton variant="gold" style={{ width: 180, height: 44, borderRadius: 12 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="card" style={{ padding: 24 }}>
              <Skeleton style={{ width: 110, height: 16, marginBottom: 14 }} />
              <Skeleton variant="gold" style={{ width: 90, height: 36, marginBottom: 8 }} />
              <Skeleton style={{ width: 140, height: 14 }} />
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <Skeleton style={{ width: 220, height: 26, marginBottom: 20 }} />
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} style={{ width: '100%', height: 56, marginBottom: 12, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

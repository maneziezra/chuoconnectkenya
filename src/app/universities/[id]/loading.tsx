import { Skeleton, CourseCardSkeleton } from '@/components/ui/skeleton';

export default function UniversityDetailLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <div style={{ padding: '0 20px', marginTop: 40 }}>
        <div
          style={{
            border: '2px solid var(--border-light)',
            borderRadius: 20,
            background: 'var(--bg-secondary)',
            padding: '48px 40px',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Skeleton variant="gold" style={{ width: 90, height: 26, borderRadius: 8 }} />
              <Skeleton style={{ width: 110, height: 26, borderRadius: 8 }} />
            </div>
            <Skeleton style={{ width: 'min(540px, 90%)', height: 46, marginBottom: 16 }} />
            <Skeleton style={{ width: 'min(680px, 95%)', height: 20, marginBottom: 10 }} />
            <Skeleton style={{ width: 'min(480px, 75%)', height: 20, marginBottom: 28 }} />
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Skeleton variant="gold" style={{ width: 210, height: 46, borderRadius: 14 }} />
              <Skeleton style={{ width: 160, height: 46, borderRadius: 14 }} />
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <CourseCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

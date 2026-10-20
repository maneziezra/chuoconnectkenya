import { PageHeroSkeleton, Skeleton, CourseCardSkeleton } from '@/components/ui/skeleton';

export default function GradesLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <PageHeroSkeleton />
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} variant={idx === 0 ? 'gold' : 'default'} style={{ width: 120, height: 40, borderRadius: 12 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <CourseCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

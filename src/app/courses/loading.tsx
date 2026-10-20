import { PageHeroSkeleton, Skeleton, CourseCardSkeleton } from '@/components/ui/skeleton';

export default function CoursesLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <PageHeroSkeleton />
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} variant={idx === 0 ? 'gold' : 'default'} style={{ width: 135, height: 36, borderRadius: 9999 }} />
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

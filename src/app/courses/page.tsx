import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, BookOpen, Clock, Users, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';
import { coursesData as localCourses } from '@/lib/data/courses';
import { universitiesData as localUnis } from '@/lib/data/universities';
import SaveCourseButton from '@/components/student/SaveCourseButton';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

export const metadata: Metadata = {
  title: 'Course Finder · Accredited Degree Programmes in Kenya',
  description: 'Browse accredited degree programmes in Kenya. Filter by KUCCPS cluster group, minimum cluster points, career outcomes, and university.',
};

interface Props {
  searchParams: Promise<{ q?: string; cluster?: string }>;
}

export default async function CoursesPage({ searchParams }: Props) {
  const { q = '', cluster = '' } = await searchParams;
  const supabase = await createClient();
  const { data: dbCourses } = await supabase.from('courses').select('*');
  const { data: dbUnis } = await supabase.from('universities').select('id, name');

  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  let savedCourses: string[] = [];

  if (user) {
    const { data: profileData } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single();
    profile = profileData;
    const { data: savedData } = await supabase.from('saved_courses').select('course_id').eq('user_id', user.id);
    if (savedData) {
      savedCourses = savedData.map((s: any) => s.course_id);
    }
  }

  // Merge DB courses with localCourses fallback
  const seenCourseIds = new Set((dbCourses || []).map((c: Course) => c.id));
  const allCourses: Course[] = [
    ...((dbCourses || []) as Course[]),
    ...localCourses.filter(c => !seenCourseIds.has(c.id)),
  ];

  // Merge DB universities with localUnis fallback
  const seenUniIds = new Set((dbUnis || []).map((u: any) => u.id));
  const universities: University[] = [
    ...((dbUnis || []) as University[]),
    ...localUnis.filter(u => !seenUniIds.has(u.id)),
  ];

  const clusterGroups = Array.from(new Set(allCourses.map(c => c.clusterGroup))).sort();

  const queryLower = q.trim().toLowerCase();
  const courses = allCourses.filter(course => {
    const careerList = course.careerOutcomes || [];
    const matchesQ =
      !queryLower ||
      course.title.toLowerCase().includes(queryLower) ||
      course.description.toLowerCase().includes(queryLower) ||
      course.clusterGroup.toLowerCase().includes(queryLower) ||
      careerList.some((car: string) => car.toLowerCase().includes(queryLower));
    const matchesCluster = !cluster || course.clusterGroup === cluster;
    return matchesQ && matchesCluster;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingBottom: 80 }}>
      {/* Hero Header with Apple Glass Squircle */}
      <div style={{ padding: '0 20px', marginTop: '28px', maxWidth: '1400px', margin: '28px auto 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.03)',
            background: 'var(--bg-secondary)',
            padding: '44px 36px',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 840 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                marginBottom: 16,
              }}
            >
              <BookOpen size={13} style={{ color: 'var(--accent-gold)' }} />
              Course Directory ({allCourses.length} Accredited Programmes)
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.028em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)',
                margin: '0 0 12px 0',
              }}
            >
              Find Your Degree Programme
            </h1>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.98rem',
                lineHeight: 1.55,
                marginBottom: 24,
                fontFamily: 'var(--font-serif)',
              }}
            >
              Explore accredited undergraduate and diploma programmes across Kenyan universities. Review KUCCPS weighted cluster cutoffs, verified career pathways, and connect with admissions officers.
            </p>

            {/* Apple Filter & Search Controls */}
            <form method="GET" action="/courses" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: '1 1 280px', position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search course title, career, or cluster…"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                />
              </div>

              <select
                name="cluster"
                defaultValue={cluster}
                style={{
                  flex: '0 1 260px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                }}
              >
                <option value="">All 8 KUCCPS Clusters</option>
                {clusterGroups.map(cg => (
                  <option key={cg} value={cg}>{cg}</option>
                ))}
              </select>

              <button
                type="submit"
                className="btn btn-gold"
                style={{ borderRadius: 'var(--radius-md)', padding: '11px 20px', fontWeight: 600, fontSize: '0.88rem' }}
              >
                Filter Courses
              </button>

              {(q || cluster) && (
                <Link
                  href="/courses"
                  className="btn btn-outline"
                  style={{ borderRadius: 'var(--radius-md)', padding: '11px 16px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <X size={14} /> Clear
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: '1400px', margin: '32px auto 0', padding: '0 20px' }}>
        {courses.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'var(--font-serif)' }}>
              No courses matched &ldquo;{q || cluster}&rdquo;
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 20 }}>
              Try clearing your search filter or browsing across all 8 KUCCPS cluster groups.
            </p>
            <Link href="/courses" className="btn btn-gold" style={{ borderRadius: 'var(--radius-full)' }}>
              Show All Courses
            </Link>
          </div>
        ) : (
          <div className="grid-auto">
            {courses.map(course => {
              const offeredAt = universities.filter(u => course.universityIds.includes(u.id));
              const careerList = course.careerOutcomes || [];

              return (
                <div
                  key={course.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        {course.clusterGroup.split(':')[0]}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {course.duration}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-primary)',
                        marginBottom: 10,
                        lineHeight: 1.35,
                      }}
                    >
                      {course.title}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 18 }}>
                      {course.description}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                      {careerList.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <Users size={13} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <strong>Careers:</strong> {careerList.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={13} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
                        <span>Offered at {offeredAt.length} {offeredAt.length === 1 ? 'university' : 'universities'}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '16px 22px',
                      background: 'var(--bg-secondary)',
                      borderTop: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Min KUCCPS Score
                      </div>
                      <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {course.minPoints.toFixed(1)} pts
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <SaveCourseButton
                        courseId={course.id}
                        isSavedInitial={savedCourses.includes(course.id)}
                        user={user}
                        profile={profile}
                      />
                      <Link
                        href="/calculator"
                        className="btn btn-outline btn-sm"
                        style={{ borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600 }}
                      >
                        Check Eligibility
                      </Link>
                      {offeredAt.length > 0 && (
                        <ExpressInquiryModal
                          source="course_page"
                          universityOptions={offeredAt.map(u => ({ id: u.id, name: u.name }))}
                          defaultCourse={course.title}
                          triggerLabel="Request Info"
                          triggerClassName="btn btn-gold btn-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

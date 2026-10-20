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
  title: 'Course Finder — Accredited Degree Programmes in Kenya',
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
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div style={{
          position: 'relative',
          border: '2px solid var(--border-medium)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-neo)',
          background: 'var(--bg-secondary)',
          padding: '48px 40px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
            opacity: 0.04,
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 14px',
                background: 'var(--gold-glow)',
                border: '2px solid var(--border-medium)',
                borderRadius: 8,
                boxShadow: 'var(--shadow-neo)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 16}}
            >
              <BookOpen size={14} />
              Course Directory ({allCourses.length} Programmes)
            </span>
            <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              Find Your Dream Course
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560, marginBottom: 24 }}>
              Explore accredited undergraduate programmes across all Kenyan universities.
              See minimum KUCCPS cluster points, career outcomes, and request admissions info directly.
            </p>

            {/* Search & Cluster Filter Form */}
            <form method="GET" action="/courses" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 820 }}>
              <div style={{ flex: '1 1 280px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search course title, career, or cluster…"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: 10,
                    border: '2px solid var(--border-medium)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
              <select
                name="cluster"
                defaultValue={cluster}
                style={{
                  flex: '0 1 260px',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '2px solid var(--border-medium)',
                  background: 'var(--bg-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                <option value="">All 8 KUCCPS Cluster Groups</option>
                {clusterGroups.map(cg => (
                  <option key={cg} value={cg}>{cg}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-navy">
                Filter Courses
              </button>
              {(q || cluster) && (
                <Link href="/courses" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <X size={14} /> Clear
                </Link>
              )}
            </form>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {courses.length === 0 ? (
            <div className="card card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <h3 className="text-h3" style={{ marginBottom: 8 }}>No courses matched &ldquo;{q || cluster}&rdquo;</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Try clearing your search filter or browsing all 8 KUCCPS cluster groups.</p>
              <Link href="/courses" className="btn btn-navy">Show All Courses</Link>
            </div>
          ) : (
            <div className="grid-auto">
              {courses.map(course => {
                const offeredAt = universities.filter(u => course.universityIds.includes(u.id));
                const careerList = course.careerOutcomes || [];

                return (
                  <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <span className="badge badge-navy">
                          {course.clusterGroup.split(':')[0]}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {course.duration}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: 12,
                          lineHeight: 1.3}}
                      >
                        {course.title}
                      </h3>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                        {course.description}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {careerList.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                            <Users size={14} style={{ flexShrink: 0 }} />
                            <span><strong>Careers:</strong> {careerList.slice(0, 3).join(', ')}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                          <MapPin size={14} style={{ flexShrink: 0 }} />
                          <span>Offered at {offeredAt.length} {offeredAt.length === 1 ? 'university' : 'universities'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Min KUCCPS Score:<br />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {course.minPoints.toFixed(1)} pts
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <SaveCourseButton
                          courseId={course.id}
                          isSavedInitial={savedCourses.includes(course.id)}
                          user={user}
                          profile={profile}
                        />
                        <Link href="/calculator" className="btn btn-outline btn-sm">
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
        </div>
      </section>
    </>
  );
}


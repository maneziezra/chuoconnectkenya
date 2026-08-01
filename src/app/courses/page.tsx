import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, BookOpen, Clock, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';
import SaveCourseButton from '@/components/student/SaveCourseButton';

export const metadata: Metadata = {
  title: 'Course Finder',
  description: 'Browse over 500 accredited degree programmes in Kenya. Filter by cluster group, career outcomes, and university.'};

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: coursesData } = await supabase.from('courses').select('*');
  const { data: universitiesData } = await supabase.from('universities').select('id, name');
  
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  let savedCourses: string[] = [];
  
  if (user) {
    const { data: profileData } = await supabase.from('student_profiles').select('*').eq('id', user.id).single();
    profile = profileData;
    const { data: savedData } = await supabase.from('saved_courses').select('course_id').eq('user_id', user.id);
    if (savedData) {
      savedCourses = savedData.map((s: any) => s.course_id);
    }
  }
  
  const courses = (coursesData || []) as Course[];
  const universities = (universitiesData || []) as University[];

  return (
    <>
      <div style={{ padding: '0 20px', marginTop: '40px' }}>
        <div style={{
          position: 'relative',
          border: '2px solid var(--navy-deep)',
          borderRadius: 20,
          boxShadow: '4px 4px 0px var(--navy-deep)',
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
                border: '2px solid var(--navy-deep)',
                borderRadius: 8,
                boxShadow: '2px 2px 0px var(--navy-deep)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--navy-deep)',
                marginBottom: 16}}
            >
              <BookOpen size={14} />
              Course Directory
            </span>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 12 }}>
              Find Your Dream Course
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 560 }}>
              Explore accredited undergraduate programmes across all Kenyan universities.
              See minimum KUCCPS cluster points and potential career outcomes.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="grid-auto">
            {courses.map(course => {
              const offeredAt = universities.filter(u => course.universityIds.includes(u.id));
              
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
                        color: 'var(--navy-deep)',
                        marginBottom: 12,
                        lineHeight: 1.3}}
                    >
                      {course.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                      {course.description}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                        <Users size={14} />
                        <strong>Careers:</strong> {course.careerOutcomes?.slice(0, 2).join(', ')}...
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                        <MapPin size={14} />
                        Offered at {offeredAt.length} universities
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Min KUCCPS Score:<br />
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700, color: 'var(--navy-deep)' }}>
                        {course.minPoints.toFixed(1)} pts
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <SaveCourseButton 
                        courseId={course.id} 
                        isSavedInitial={savedCourses.includes(course.id)} 
                        user={user} 
                        profile={profile} 
                      />
                      <Link href={`/dashboard`} className="btn btn-outline btn-sm">
                        Check Eligibility
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

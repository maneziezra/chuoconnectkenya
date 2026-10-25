import type { Metadata } from 'next';
import KuccpsCalculator from '@/components/student/KuccpsCalculator';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Award, TrendingUp, GraduationCap, ArrowRight, User, CheckCircle2, Circle, Home, Save } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Student Dashboard & KUCCPS Calculator',
  description:
    'Calculate your KUCCPS weighted cluster scores, discover qualifying courses, and get personalised university recommendations.',
};

const GUIDANCE_CARDS = [
  {
    icon: <BookOpen size={20} />,
    title: 'Course Selection Guide',
    desc: 'Learn how to choose the right course for your career goals and interests.',
    href: '/guidance#courses',
  },
  {
    icon: <Award size={20} />,
    title: 'Scholarship Finder',
    desc: 'Browse available scholarships for Kenyan students · government and private.',
    href: '/guidance#scholarships',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'University Rankings',
    desc: 'Compare universities based on research output, student satisfaction, and employability.',
    href: '/universities',
  },
];

import { createClient } from '@/lib/supabase/server';
import type { Course, University } from '@/lib/types';
import { coursesData as localCourses } from '@/lib/data/courses';
import { universitiesData as localUnis } from '@/lib/data/universities';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  let savedCoursesIds: string[] = [];
  if (user) {
    const { data } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single();
    profile = data;
    
    const { data: savedData } = await supabase.from('saved_courses').select('course_id').eq('user_id', user.id);
    if (savedData) {
      savedCoursesIds = savedData.map((s: any) => s.course_id);
    }
  }

  const { data: coursesData } = await supabase.from('courses').select('*');
  const { data: universitiesData } = await supabase.from('universities').select('id, name');
  
  const courses = (coursesData && coursesData.length > 0 ? coursesData : localCourses) as Course[];
  const universities = (universitiesData && universitiesData.length > 0 ? universitiesData : localUnis) as University[];
  
  const savedCoursesList = courses.filter((c: Course) => savedCoursesIds.includes(c.id));

  return (
    <>
      {/* Hero Header */}
      <div style={{ padding: '40px 20px 0' }}>
        <div
          style={{
            position: 'relative',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            background: 'var(--bg-secondary)',
            padding: '44px 36px',
            overflow: 'hidden',
          }}
        >
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              {user ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    width: '100%',
                    background: 'var(--bg-primary)',
                    padding: 24,
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    boxShadow: 'var(--shadow-sm)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--gold-glow)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="Avatar" fill style={{ objectFit: 'cover' }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={36} style={{ color: 'var(--text-primary)' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: '1 1 260px' }}>
                    <h1
                      style={{
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                        fontSize: '1.85rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      {profile?.full_name || user.email?.split('@')[0]}
                    </h1>
                    <div style={{ display: 'flex', gap: 16, color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                      {profile?.high_school && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <GraduationCap size={16} style={{ color: 'var(--gold-primary)' }} />
                          {profile.high_school}
                        </div>
                      )}
                      {profile?.index_number && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <BookOpen size={16} style={{ color: 'var(--gold-primary)' }} />
                          Index: {profile.index_number}
                        </div>
                      )}
                      {profile?.saved_grades?.overallGrade && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Award size={16} style={{ color: 'var(--gold-primary)' }} />
                          Mean Grade: {profile.saved_grades.overallGrade}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link href="/profile" className="btn btn-gold btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>
                      Edit Profile
                    </Link>
                    <form
                      action={async () => {
                        'use server';
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                      }}
                    >
                      <button type="submit" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>
                        Log Out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '5px 14px',
                        background: 'var(--apple-glass-bg)',
                        border: '1px solid var(--border-light)',
                        borderTop: '1px solid var(--apple-glass-highlight)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--text-primary)',
                        marginBottom: 16,
                      }}
                    >
                      <GraduationCap size={13} style={{ color: 'var(--gold-primary)' }} />
                      Student Centre
                    </div>
                    <h1
                      style={{
                        color: 'var(--text-primary)',
                        marginBottom: 12,
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      My Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 520, fontSize: '1rem', lineHeight: 1.6 }}>
                      Calculate your KUCCPS cluster scores, discover the programmes you qualify for,
                      and plan your academic future with 2026 data.
                    </p>
                  </div>
                  <Link href="/signup" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>
                    Save My Results <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-sm">
        <div className="container">
          {/* Progress Tracker */}
          {user && (
            <div
              className="card"
              style={{
                marginBottom: 32,
                padding: '24px 32px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: 20,
                }}
              >
                Your Chuo Connect Checklist
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Create Account</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>You&apos;re in!</div>
                  </div>
                </div>
                {/* Step 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {profile?.high_school && profile?.index_number && profile?.county ? (
                    <CheckCircle2 size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={22} style={{ color: 'var(--border-medium)', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Complete Profile</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {profile?.high_school ? 'Profile looks good.' : <Link href="/profile" style={{ color: 'var(--gold-primary)', textDecoration: 'none' }}>Edit profile →</Link>}
                    </div>
                  </div>
                </div>
                {/* Step 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {profile?.saved_grades?.overallGrade ? (
                    <CheckCircle2 size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={22} style={{ color: 'var(--border-medium)', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Enter KCSE Grades</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {profile?.saved_grades?.overallGrade ? 'Grades saved.' : 'Calculate your cluster points below.'}
                    </div>
                  </div>
                </div>
                {/* Step 4 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {savedCoursesIds.length > 0 ? (
                    <CheckCircle2 size={22} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={22} style={{ color: 'var(--border-medium)', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Save a Course</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {savedCoursesIds.length > 0 ? `${savedCoursesIds.length} course(s) saved.` : <Link href="/courses" style={{ color: 'var(--gold-primary)', textDecoration: 'none' }}>Browse courses →</Link>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="student-dashboard-grid">
            {/* Calculator */}
            <div>
              {savedCoursesList.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      My Applications
                    </h2>
                    <Link href="/courses" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>Browse More</Link>
                  </div>
                  <div className="grid-auto">
                    {savedCoursesList.map(course => {
                      const offeredAt = universities.filter(u => course.universityIds.includes(u.id));
                      return (
                        <div
                          key={course.id}
                          className="card"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border-light)',
                            borderTop: '1px solid var(--apple-glass-highlight)',
                          }}
                        >
                          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                              <span className="badge badge-navy">
                                {course.clusterGroup.split(':')[0]}
                              </span>
                            </div>
                            <h3
                              style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                color: 'var(--text-primary)',
                                marginBottom: 8,
                                lineHeight: 1.3,
                              }}
                            >
                              {course.title}
                            </h3>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                Offered at {offeredAt.length} universities
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: '12px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-primary)' }}>Application Tracked</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <KuccpsCalculator 
                courses={courses} 
                universities={universities} 
                initialProfile={profile}
                userId={user?.id}
              />

              {/* Smart Housing Preview */}
              {profile?.county && (
                <div style={{ marginTop: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.45rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Home size={22} style={{ color: 'var(--gold-primary)' }} />
                      Smart Housing Matches
                    </h2>
                    <Link href="/housing" className="btn btn-outline btn-sm" style={{ borderRadius: 'var(--radius-md)' }}>View All</Link>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.55 }}>
                    Based on your profile, here are recommended student accommodations near your target universities.
                  </p>
                  <div className="student-housing-grid">
                    {/* Housing Card 1 */}
                    <div
                      className="card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-light)',
                        borderTop: '1px solid var(--apple-glass-highlight)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ height: 160, position: 'relative' }}>
                        <Image src="/images/housing/qwetu-hurlingham.jpg" alt="Qwetu Hurlingham" fill style={{ objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'var(--accent-gold)',
                            color: 'var(--gold-contrast-text)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          98% MATCH
                        </div>
                      </div>
                      <div className="card-body" style={{ padding: 20 }}>
                        <h3
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '-0.02em',
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                          }}
                        >
                          Qwetu Hurlingham
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>Nairobi County • Premium Hostel</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="tabular-nums" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>From KES 25,000</span>
                          <Link href="/housing" style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>View details →</Link>
                        </div>
                      </div>
                    </div>
                    {/* Housing Card 2 */}
                    <div
                      className="card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-light)',
                        borderTop: '1px solid var(--apple-glass-highlight)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ height: 160, position: 'relative' }}>
                        <Image src="/images/housing/qejani-karen.jpg" alt="Qejani Karen" fill style={{ objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'var(--accent-gold)',
                            color: 'var(--gold-contrast-text)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          94% MATCH
                        </div>
                      </div>
                      <div className="card-body" style={{ padding: 20 }}>
                        <h3
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '-0.02em',
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                          }}
                        >
                          Qejani Karen
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>Nairobi County • Standard Hostel</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="tabular-nums" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>From KES 15,000</span>
                          <Link href="/housing" style={{ fontSize: '0.82rem', color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>View details →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Info card */}
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: 24,
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-primary)',
                    marginBottom: 14,
                  }}
                >
                  How It Works
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { step: '1', text: 'Select your overall mean grade' },
                    { step: '2', text: 'Enter your individual subject grades' },
                    { step: '3', text: 'We compute your weighted cluster score using the official formula' },
                    { step: '4', text: 'See every programme you qualify for across all Kenyan universities' },
                  ].map(({ step, text }) => (
                    <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div
                        className="tabular-nums"
                        style={{
                          width: 28,
                          height: 28,
                          background: 'var(--gold-glow)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-serif)',
                        }}
                      >
                        {step}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign up CTA or Welcome */}
              {!user && (
                <div
                  style={{
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: 24,
                    borderRadius: 'var(--radius-xl)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                    <Save size={18} style={{ color: 'var(--gold-primary)' }} /> Save & Track Your Progress
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                    Create a free account to save your grades, favourite universities, and get personalised notifications.
                  </p>
                  <Link href="/signup" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                    Create Free Account
                  </Link>
                </div>
              )}

              {/* Guidance Cards */}
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border-light)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Explore Guidance
                </div>
                {GUIDANCE_CARDS.map(card => (
                  <Link
                    key={card.title}
                    href={card.href}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--border-light)',
                      textDecoration: 'none',
                      transition: 'background var(--apple-ease)',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: 'var(--gold-glow)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)',
                        flexShrink: 0,
                      }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.4 }}>
                        {card.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Trigger Vercel Deploy

import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Target, Users, MessageCircle, Star, Search, Building2, Scale, Video, Bot, FileText, Repeat, UsersRound, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Mission & Vision',
  description: "Chuo Connect Kenya is Kenya's premier campus discovery platform helping students find the right university through immersive profiles, smart search, and student ambassadors.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ padding: '40px 20px', background: 'var(--bg-secondary)' }}>
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            padding: '72px 36px',
            maxWidth: 1040,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.035,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
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
                marginBottom: 20,
                backdropFilter: 'blur(16px)',
              }}
            >
              <GraduationCap size={13} style={{ color: 'var(--gold-primary)' }} />
              Our Story
            </span>
            <h1
              style={{
                color: 'var(--text-primary)',
                marginBottom: 16,
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.1rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Kenya&apos;s Premier Campus Discovery Platform
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
              Chuo Connect Kenya was founded with a single belief: every student deserves the tools to make an informed, confident decision about their academic future.
            </p>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32, alignItems: 'stretch' }}>
            <div
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 16 }}>The Problem We Solve</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontSize: '0.94rem' }}>
                Choosing a university or college is one of the most important decisions in a student&apos;s life. Yet many Kenyan students lack access to comprehensive, reliable, and engaging information about campuses across the country.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.94rem' }}>
                Existing platforms primarily focus on admission requirements or course listings, leaving students without insight into campus life, facilities, student experiences, accommodation, and overall suitability.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
                {[
                  'Limited information about campus life',
                  'No centralized institution information',
                  'Difficulty comparing universities objectively',
                  'Minimal exposure to campus facilities before applying',
                  'Limited access to current student experiences',
                  'Uncertainty about accommodation and costs',
                ].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-primary)', flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            
            <div
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
                padding: 36,
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 16 }}>Our Solution</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, fontSize: '0.94rem' }}>
                Chuo Connect Kenya serves as a centralized platform where students can explore, compare, and confidently choose their ideal campus.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <Search size={18} />, label: 'Discover all accredited institutions' },
                  { icon: <Building2 size={18} />, label: 'Explore campus facilities & life' },
                  { icon: <Scale size={18} />, label: 'Compare institutions side-by-side' },
                  { icon: <Video size={18} />, label: 'Watch virtual campus tours' },
                  { icon: <Star size={18} />, label: 'Read authentic student reviews' },
                  { icon: <MessageCircle size={18} />, label: 'Chat with student ambassadors' },
                  { icon: <Bot size={18} />, label: 'Get AI-powered recommendations' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 500 }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--gold-glow)',
                        color: 'var(--gold-primary)',
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section style={{ background: 'var(--bg-primary)', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                padding: 36,
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                  color: 'var(--gold-primary)',
                }}
              >
                <Target size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                To become Kenya&apos;s most trusted digital platform for discovering, exploring, and connecting students with campuses and higher education opportunities.
              </p>
            </div>
            
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                padding: 36,
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                  color: 'var(--gold-primary)',
                }}
              >
                <GraduationCap size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 12 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                To simplify the university selection process by providing students with accurate information, immersive campus experiences, and personalised recommendations that help them make informed educational decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 10 }}>Who We Serve</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem' }}>Our platform is built for the Kenyan higher education ecosystem.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { icon: <GraduationCap size={28} />, title: 'KCSE Candidates', desc: 'Planning the next step after Form 4' },
              { icon: <Users size={28} />, title: 'High School Graduates', desc: 'Exploring all options before applying' },
              { icon: <FileText size={28} />, title: 'Diploma Students', desc: 'Seeking degree upgrade pathways' },
              { icon: <Repeat size={28} />, title: 'Transfer Students', desc: 'Looking to switch institutions' },
              { icon: <UsersRound size={28} />, title: 'Parents & Guardians', desc: 'Supporting children\'s decision-making' },
              { icon: <Building size={28} />, title: 'Universities & Colleges', desc: 'Showcasing campuses to students' },
            ].map(u => (
              <div
                key={u.title}
                className="card card-body"
                style={{
                  textAlign: 'center',
                  padding: 24,
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                    color: 'var(--gold-primary)',
                    width: 56,
                    height: 56,
                    margin: '0 auto 16px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gold-glow)',
                  }}
                >
                  {u.icon}
                </div>
                <h4 style={{ fontWeight: 700, fontFamily: 'var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--text-primary)', marginBottom: 6, fontSize: '1rem' }}>{u.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-primary)' }}>
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            padding: '64px 36px',
            textAlign: 'center',
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 14 }}>
            Start Your Campus Journey Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 520, margin: '0 auto 32px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Join thousands of Kenyan students making informed decisions about their academic future.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/universities" className="btn btn-gold" style={{ borderRadius: 'var(--radius-md)' }}>Explore Campuses</Link>
            <Link href="/signup" className="btn btn-outline" style={{ borderRadius: 'var(--radius-md)' }}>Create Account</Link>
          </div>
        </div>
      </section>
    </>
  );
}


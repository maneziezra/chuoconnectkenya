import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Target, Users, MessageCircle, Star, Search, Building2, Scale, Video, Bot, FileText, Repeat, UsersRound, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Chuo Connect Kenya | Our Mission & Vision',
  description: "Chuo Connect Kenya is Kenya's premier campus discovery platform helping students find the right university through immersive profiles, smart search, and student ambassadors.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ padding: '40px 20px', background: '#FAFAF8' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid var(--navy-deep)',
            borderRadius: 20,
            boxShadow: '6px 6px 0px var(--navy-deep)',
            padding: '80px 40px',
            maxWidth: 1000,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
              backgroundSize: '28px 28px',
              opacity: 0.04,
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 14px',
                background: 'var(--gold-glow)',
                border: '2px solid var(--navy-deep)',
                borderRadius: 8,
                boxShadow: '2px 2px 0px var(--navy-deep)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: 'var(--navy-deep)',
                marginBottom: 20
              }}
            >
              Our Story
            </span>
            <h1 className="text-h1" style={{ color: 'var(--navy-deep)', marginBottom: 20 }}>
              Kenya's Premier Campus Discovery Platform
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
              Chuo Connect Kenya was founded with a single belief: every student deserves the tools to make an informed, confident decision about their academic future.
            </p>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <section className="section" style={{ background: '#FAFAF8' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 48, alignItems: 'start' }}>
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid var(--navy-deep)',
                borderRadius: 20,
                boxShadow: '6px 6px 0px var(--navy-deep)',
                padding: 40
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginBottom: 20 }}>The Problem We Solve</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
                Choosing a university or college is one of the most important decisions in a student&apos;s life. Yet many Kenyan students lack access to comprehensive, reliable, and engaging information about campuses across the country.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                Existing platforms primarily focus on admission requirements or course listings, leaving students without insight into campus life, facilities, student experiences, accommodation, and overall suitability.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Limited information about campus life',
                  'No centralized institution information',
                  'Difficulty comparing universities objectively',
                  'Minimal exposure to campus facilities before applying',
                  'Limited access to current student experiences',
                  'Uncertainty about accommodation and costs',
                ].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--navy-deep)', fontWeight: 500 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--navy-deep)', flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            
            <div
              style={{
                background: '#FAFAF8',
                border: '2px solid var(--navy-deep)',
                borderRadius: 20,
                boxShadow: '6px 6px 0px var(--navy-deep)',
                padding: 40,
                color: 'var(--navy-deep)'
              }}
            >
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginBottom: 20 }}>Our Solution</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                Chuo Connect Kenya serves as a centralized platform where students can explore, compare, and confidently choose their ideal campus.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: <Search size={20} />, label: 'Discover all accredited institutions' },
                  { icon: <Building2 size={20} />, label: 'Explore campus facilities & life' },
                  { icon: <Scale size={20} />, label: 'Compare institutions side-by-side' },
                  { icon: <Video size={20} />, label: 'Watch virtual campus tours' },
                  { icon: <Star size={20} />, label: 'Read authentic student reviews' },
                  { icon: <MessageCircle size={20} />, label: 'Chat with student ambassadors' },
                  { icon: <Bot size={20} />, label: 'Get AI-powered recommendations' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', fontWeight: 500 }}>
                    <span
                      style={{
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        border: '2px solid var(--navy-deep)',
                        borderRadius: 8,
                        background: 'var(--gold-glow)'
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
      <section style={{ background: '#FFFFFF', padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 40 }}>
            <div
              style={{
                background: '#FAFAF8',
                borderRadius: 20,
                padding: 40,
                border: '2px solid var(--navy-deep)',
                boxShadow: '6px 6px 0px var(--navy-deep)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: 'var(--gold-glow)',
                  border: '2px solid var(--navy-deep)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <Target size={26} style={{ color: 'var(--navy-deep)' }} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--navy-deep)', marginBottom: 16 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                To become Kenya&apos;s most trusted digital platform for discovering, exploring, and connecting students with campuses and higher education opportunities.
              </p>
            </div>
            
            <div
              style={{
                background: '#FAFAF8',
                borderRadius: 20,
                padding: 40,
                border: '2px solid var(--navy-deep)',
                boxShadow: '6px 6px 0px var(--navy-deep)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: 'var(--gold-glow)',
                  border: '2px solid var(--navy-deep)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <GraduationCap size={26} style={{ color: 'var(--navy-deep)' }} />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--navy-deep)', marginBottom: 16 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                To simplify the university selection process by providing students with accurate information, immersive campus experiences, and personalised recommendations that help them make informed educational decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section" style={{ background: '#FAFAF8' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--navy-deep)', marginBottom: 12 }}>Who We Serve</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>Our platform is built for the Kenyan education ecosystem.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              { icon: <GraduationCap size={32} />, title: 'KCSE Candidates', desc: 'Planning the next step after Form 4' },
              { icon: <Users size={32} />, title: 'High School Graduates', desc: 'Exploring all options before applying' },
              { icon: <FileText size={32} />, title: 'Diploma Students', desc: 'Seeking degree upgrade pathways' },
              { icon: <Repeat size={32} />, title: 'Transfer Students', desc: 'Looking to switch institutions' },
              { icon: <UsersRound size={32} />, title: 'Parents & Guardians', desc: 'Supporting children\'s decision-making' },
              { icon: <Building size={32} />, title: 'Universities & Colleges', desc: 'Showcasing campuses to students' },
            ].map(u => (
              <div key={u.title} className="card card-body" style={{ textAlign: 'center', padding: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                    color: 'var(--navy-deep)',
                    width: 64,
                    height: 64,
                    margin: '0 auto 16px',
                    border: '2px solid var(--navy-deep)',
                    borderRadius: 10,
                    background: 'var(--gold-glow)'
                  }}
                >
                  {u.icon}
                </div>
                <h4 style={{ fontWeight: 700, color: 'var(--navy-deep)', marginBottom: 8 }}>{u.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF' }}>
        <div
          style={{
            background: 'var(--navy-deep)',
            border: '2px solid var(--navy-deep)',
            borderRadius: 20,
            boxShadow: '6px 6px 0px var(--navy-deep)',
            padding: '80px 40px',
            textAlign: 'center',
            maxWidth: 1000,
            margin: '0 auto'
          }}
        >
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: 'white', marginBottom: 16 }}>
            Start Your Campus Journey Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px', fontSize: '1.1rem' }}>
            Join thousands of Kenyan students making informed decisions about their academic future.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/universities" className="btn btn-gold">Explore Campuses</Link>
            <Link href="/signup" className="btn btn-outline" style={{ background: 'white' }}>Create Account</Link>
          </div>
        </div>
      </section>
    </>
  );
}

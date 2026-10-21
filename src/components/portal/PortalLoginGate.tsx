'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Lock, ArrowRight, Mail, KeyRound, Sparkles,
  CheckCircle2, TrendingUp, Users, MessageCircle, BarChart3, ShieldCheck
} from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import PartnerDashboard from '@/components/portal/PartnerDashboard';
import type { University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const DEMO_CAMPUSES = [
  { id: 'uon', label: 'University of Nairobi', tag: 'Public #1' },
  { id: 'strathmore', label: 'Strathmore University', tag: 'Private' },
  { id: 'jkuat', label: 'JKUAT', tag: 'STEM & Tech' },
  { id: 'usiu', label: 'USIU-Africa', tag: 'International' },
  { id: 'mku', label: 'Mount Kenya (MKU)', tag: 'Multi-Campus' },
  { id: 'zetech', label: 'Zetech University', tag: 'Technology' },
];

export default function PortalLoginGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authedUni, setAuthedUni] = useState<University | null>(null);

  const supabase = createClient();

  const handleQuickDemo = (uniId: string) => {
    const match = universitiesData.find(u => u.id === uniId);
    if (match) {
      setAuthedUni(match);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Check demo credentials first for instant zero-latency access
      const trimmed = email.trim().toUpperCase();
      const demoMatch = universitiesData.find(
        u => u.abbrev.toUpperCase() === trimmed || u.id.toUpperCase() === trimmed
      );
      if (demoMatch && password.toLowerCase() === 'demo') {
        setAuthedUni(demoMatch);
        setLoading(false);
        return;
      }

      // Real Supabase login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Invalid credentials. Select any 1-click Demo Campus above, or use Code: UON / Password: demo');
        setLoading(false);
        return;
      }

      // Fetch university linkage
      const { data: adminData, error: adminError } = await supabase
        .from('university_admins')
        .select('universityId')
        .eq('user_id', authData.user?.id)
        .single();

      if (adminError || !adminData) {
        setError('No university account is linked to this login.');
        setLoading(false);
        return;
      }

      const match = universitiesData.find(u => u.id === adminData.universityId);
      if (match) {
        setAuthedUni(match);
      } else {
        setError('University configuration error.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  if (authedUni) {
    return <PartnerDashboard uni={authedUni} onSignOut={() => setAuthedUni(null)} />;
  }

  return (
    <section
      style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        background: 'var(--bg-primary)',
        padding: '48px 20px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--navy-deep) 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 380,
          background: 'radial-gradient(ellipse at 50% 0%, var(--gold-glow), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 1080 }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--apple-glass-bg)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: 18,
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Executive Partner Network
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            University Partner Portal
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Admissions CRM, verified KCSE graduate lead pipeline, and enrollment intelligence for Kenyan higher education institutions.
          </p>
        </div>

        {/* Central Enterprise Card */}
        <div
          style={{
            maxWidth: 820,
            margin: '0 auto 48px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 24px 64px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
            padding: '40px 36px',
          }}
        >
          {/* Interactive Sandbox Selector */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>Test Live Interactive Sandbox (1-Click Access)</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                No credentials required
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>
              {DEMO_CAMPUSES.map(campus => (
                <button
                  key={campus.id}
                  type="button"
                  onClick={() => handleQuickDemo(campus.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    background: 'var(--bg-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform var(--apple-press), background var(--apple-ease), border-color var(--apple-ease)',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-primary)'}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {campus.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 2, fontWeight: 500 }}>
                      {campus.tag}
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Elegant Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              margin: '32px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-tertiary)',
              }}
            >
              Or Institutional Admin Sign In
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
          </div>

          {/* Institutional Credentials Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Work Email or Institution Code
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-tertiary)' }} />
                <input
                  className="form-input"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="admissions@uonbi.ac.ke or UON"
                  style={{
                    paddingLeft: 46,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={17} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-tertiary)' }} />
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="•••••••• (or type 'demo')"
                  style={{
                    paddingLeft: 46,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-primary)',
                  }}
                />
              </div>
              {error && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--danger-bg)',
                    color: 'var(--danger-text)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginTop: 10,
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            <button
              className="btn btn-gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                marginTop: 6,
                fontWeight: 700,
                fontSize: '0.96rem',
                opacity: loading ? 0.7 : 1,
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              <Lock size={16} />
              {loading ? 'Authenticating...' : 'Sign In to Partner Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </div>

        {/* Enterprise Value Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            {
              icon: <Users size={20} style={{ color: 'var(--gold-primary)' }} />,
              title: 'Verified 48-Pt KCSE Leads',
              desc: 'Every prospective student lead includes confirmed mean grade, computed KUCCPS cluster points, and HEF funding band.',
            },
            {
              icon: <MessageCircle size={20} style={{ color: '#25D366' }} />,
              title: '1-Click Direct Outreach',
              desc: 'Instant WhatsApp integration with pre-composed admission greetings, direct telephone dialing, and email routing.',
            },
            {
              icon: <BarChart3 size={20} style={{ color: '#3B82F6' }} />,
              title: 'Enrollment Intelligence',
              desc: 'Track student demand by degree course, compare applicant demographics, and measure recruitment conversion.',
            },
          ].map(feature => (
            <div
              key={feature.title}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 22px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                {feature.icon}
              </div>
              <h2
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Enterprise Onboarding Banner */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold-primary)', marginBottom: 4 }}>
              <TrendingUp size={13} /> Institutional Partnership
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Want your University or Student Hostel listed?
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Connect directly with verified 2026/2027 KCSE applicants actively seeking campus placement and accommodation.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn btn-outline"
            style={{ borderRadius: 'var(--radius-md)', padding: '12px 22px', fontSize: '0.9rem' }}
          >
            Contact Partner Desk <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

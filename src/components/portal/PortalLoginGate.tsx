'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Lock, ArrowRight, Mail, KeyRound, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import PartnerDashboard from '@/components/portal/PartnerDashboard';
import type { University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const DEMO_CAMPUSES = [
  { id: 'uon', label: 'UoN (Public #1)' },
  { id: 'strathmore', label: 'Strathmore (Private)' },
  { id: 'jkuat', label: 'JKUAT (STEM)' },
  { id: 'usiu', label: 'USIU-Africa' },
  { id: 'mku', label: 'Mount Kenya (MKU)' },
  { id: 'zetech', label: 'Zetech University' },
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
      if (demoMatch && password === 'demo') {
        setAuthedUni(demoMatch);
        setLoading(false);
        return;
      }

      // Attempt real Supabase login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Invalid credentials. Use a 1-click Demo Campus below or enter Email: UON, Password: demo');
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
        setError('No university linked to this account.');
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
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  if (authedUni) {
    return <PartnerDashboard uni={authedUni} />;
  }

  return (
    <section
      style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        background: 'var(--bg-primary)',
        padding: '56px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 25%, var(--gold-glow) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 1040 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 40, alignItems: 'start' }}>
          {/* Left: Login & 1-Click Live Demo Card */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '2px solid var(--border-medium)',
              boxShadow: 'var(--shadow-neo)',
              borderRadius: 20,
              padding: 36,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--gold-glow)',
                  border: '2px solid var(--border-medium)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={24} color="var(--text-primary)" />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  University Partner Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>
                  Admissions CRM, KCSE Lead Pipeline & Analytics
                </p>
              </div>
            </div>

            {/* 1-Click Instant Demo Selector */}
            <div
              style={{
                padding: 16,
                borderRadius: 14,
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--gold-primary)',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--gold-primary)', marginBottom: 8 }}>
                <Sparkles size={14} /> Instant 1-Click Live Sandbox Demo
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
                Click any institution below to test the live B2B Partner CRM, student inquiry pipeline, WhatsApp outreach, and revenue attribution:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DEMO_CAMPUSES.map(campus => (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => handleQuickDemo(campus.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1.5px solid var(--border-medium)',
                      background: 'var(--gold-glow)',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {campus.label} →
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Work Email or Institution Code</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: 16, top: 15 }} />
                  <input
                    className="form-input"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="admin@strathmore.edu or UON"
                    style={{ paddingLeft: 46 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: 16, top: 15 }} />
                  <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="•••••••• (or 'demo')"
                    style={{ paddingLeft: 46 }}
                  />
                </div>
                {error && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--danger-text)', marginTop: 8 }}>{error}</p>
                )}
              </div>

              <button
                className="btn btn-navy"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}
                onClick={handleLogin}
                disabled={loading}
              >
                <Lock size={16} />
                {loading ? 'Authenticating...' : 'Access Partner Dashboard'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>

          {/* Right: B2B Revenue & Partnership Tiers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                background: 'var(--navy-deep)',
                color: '#FFFFFF',
                borderRadius: 20,
                padding: 32,
                border: '2px solid var(--border-medium)',
                boxShadow: 'var(--shadow-neo)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(199, 155, 55, 0.2)',
                  color: 'var(--gold-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 14,
                }}
              >
                <TrendingUp size={13} /> B2B Admissions & Enrollment Engine
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
                Recruit Pre-Qualified KCSE Graduates at Scale
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
                Every lead delivered to your Partner Portal includes the student&apos;s verified KCSE Mean Grade, computed 48-point KUCCPS Cluster Score, HEF Funding Band, and target degree programme.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  {
                    tier: 'Pay-Per-Qualified-Lead (Performance)',
                    price: 'KES 1,500 / lead',
                    desc: 'Pay only for consent-verified students whose KCSE cluster points meet your programme cut-off.',
                  },
                  {
                    tier: 'Featured Campus & Priority Placement',
                    price: 'KES 150,000 / intake',
                    desc: 'Sponsored placement on KCSE Grade Guides (/grades/c-plus, /grades/b-plus), KUCCPS Calculator results, and Open Day RSVP blasts.',
                  },
                  {
                    tier: 'Student Hostel & PBSA Partner Listing',
                    price: '8% booking commission',
                    desc: 'Verified off-campus accommodation badge, campus proximity matching, and direct WhatsApp booking funnel.',
                  },
                ].map(pkg => (
                  <div
                    key={pkg.tier}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.14)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={15} style={{ color: 'var(--gold-primary)' }} /> {pkg.tier}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                        {pkg.price}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>
                      {pkg.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                  Onboard Your Institution <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


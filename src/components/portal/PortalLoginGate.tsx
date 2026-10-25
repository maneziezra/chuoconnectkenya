'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Lock, ArrowRight, Mail, KeyRound, Sparkles,
  Users, MessageCircle, BarChart3
} from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import PartnerDashboard from '@/components/portal/PartnerDashboard';
import type { University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const DEMO_CAMPUSES = [
  { id: 'uon', label: 'University of Nairobi', tag: 'Public Charter #1' },
  { id: 'strath', label: 'Strathmore University', tag: 'Private Charter #1' },
  { id: 'jkuat', label: 'JKUAT Juja', tag: 'Engineering & STEM' },
  { id: 'usiu', label: 'USIU-Africa', tag: 'Dual Accreditation' },
  { id: 'mku', label: 'Mount Kenya (MKU)', tag: 'Multi-Campus' },
  { id: 'zetech', label: 'Zetech University', tag: 'Technology & Business' },
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
      const trimmed = email.trim().toUpperCase();
      const demoMatch = universitiesData.find(
        u => u.abbrev.toUpperCase() === trimmed || u.id.toUpperCase() === trimmed
      );
      if (demoMatch && password.toLowerCase() === 'demo') {
        setAuthedUni(demoMatch);
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Invalid credentials. Select any 1-click Demo Campus above, or use Code: UON / Password: demo');
        setLoading(false);
        return;
      }

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
        minHeight: 'calc(100svh - var(--nav-height))',
        background: 'var(--bg-primary)',
        padding: 'clamp(36px, 5vw, 64px) 0 88px',
      }}
    >
      <div className="container">
        <div className="editorial-axis-row">
          {/* Left 42% Editorial Column: Title + Value Ledger + Partnership CTA */}
          <div style={{ paddingRight: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.08,
                  marginBottom: 12,
                }}
              >
                University Partner Portal
              </h1>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '36ch',
                }}
              >
                Admissions CRM, verified KCSE graduate lead pipeline, and enrollment intelligence for Kenyan higher education institutions.
              </p>
            </div>

            {/* Value Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  icon: <Users size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />,
                  title: 'Verified 48-Pt KCSE Leads',
                  desc: 'Every prospective student lead includes confirmed mean grade, computed KUCCPS cluster points, and HEF funding band.',
                },
                {
                  icon: <MessageCircle size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />,
                  title: 'Direct Admissions Outreach',
                  desc: 'Instant WhatsApp integration with pre-composed admission greetings, direct telephone dialing, and email routing.',
                },
                {
                  icon: <BarChart3 size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />,
                  title: 'Enrollment Intelligence',
                  desc: 'Track student demand by degree course, compare applicant demographics, and measure recruitment conversion.',
                },
              ].map(feature => (
                <div
                  key={feature.title}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {feature.icon}
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {feature.title}
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 22px',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 4 }}>
                Institutional Partnership
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Want your University or Student Hostel listed?
              </div>
              <Link href="/contact" className="btn btn-outline btn-sm">
                Contact Partner Desk <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right 58% Interactive Login & Sandbox Card */}
          <div
            data-ui="partner-login-gate"
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(24px, 3.5vw, 36px)',
            }}
          >
            {/* Interactive Sandbox Selector */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span>Live Interactive Sandbox (1-Click Access)</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  No credentials required
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
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
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'var(--bg-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {campus.label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {campus.tag}
                      </div>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Or sign in with institutional credentials
            </div>

            {/* Institutional Credentials Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Work Email or Institution Code
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-tertiary)' }} />
                  <input
                    className="form-input"
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="admissions@uonbi.ac.ke or UON"
                    style={{
                      paddingLeft: 44,
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-medium)',
                      background: 'var(--bg-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-tertiary)' }} />
                  <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="•••••••• (or type 'demo')"
                    style={{
                      paddingLeft: 44,
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-medium)',
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
                      fontSize: '0.875rem',
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
                  marginTop: 4,
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
        </div>
      </div>
    </section>
  );
}

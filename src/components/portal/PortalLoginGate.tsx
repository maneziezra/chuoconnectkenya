'use client';

import { useState } from 'react';
import { GraduationCap, Lock, ArrowRight, Mail, KeyRound } from 'lucide-react';
import { universitiesData } from '@/lib/data/universities';
import PartnerDashboard from '@/components/portal/PartnerDashboard';
import type { University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function PortalLoginGate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authedUni, setAuthedUni] = useState<University | null>(null);
  
  const supabase = createClient();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Attempt real Supabase login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for demo purposes
        const demoMatch = universitiesData.find(
          u => u.abbrev.toUpperCase() === email.trim().toUpperCase() || u.id.toUpperCase() === email.trim().toUpperCase()
        );
        if (demoMatch && password === 'demo') {
          setAuthedUni(demoMatch);
        } else {
          setError('Invalid credentials. For demo: email=UON, password=demo');
        }
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
        // Try fetching from public.universities if local isn't enough, but for demo we can map to local array
        setError('No university linked to this account.');
        setLoading(false);
        return;
      }

      const match = universitiesData.find(u => u.id === adminData.universityId);
      if (match) {
        setAuthedUni(match);
      } else {
        // if not in local data, we could fetch from DB, but we just set a mock for now
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, var(--gold-glow) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <GraduationCap size={28} color="var(--accent-gold)" />
          </div>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.8rem',
              color: 'var(--text-primary)',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            University Partner Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Access your institution's analytics, leads, and profile management dashboard.
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: 20,
            padding: 36,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                  placeholder="admin@strathmore.edu"
                  style={{
                    paddingLeft: 46,
                  }}
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
                  placeholder="••••••••"
                  style={{
                    paddingLeft: 46,
                  }}
                />
              </div>
              {error && (
                <p style={{ fontSize: '0.8rem', color: 'var(--danger-text)', marginTop: 8 }}>{error}</p>
              )}
            </div>

            <button 
              className="btn btn-gold" 
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }} 
              onClick={handleLogin}
              disabled={loading}
            >
              <Lock size={16} />
              {loading ? 'Authenticating...' : 'Access Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>

          <p
            style={{
              marginTop: 24,
              fontSize: '0.78rem',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Available demo credentials:<br/>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--text-secondary)', fontWeight: 600 }}>Email: UON | Pass: demo</span>
          </p>
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Not yet a partner?{' '}
          <a href="mailto:partnerships@chuoconnect.co.ke" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
            Contact our team
          </a>
        </p>
      </div>
    </section>
  );
}

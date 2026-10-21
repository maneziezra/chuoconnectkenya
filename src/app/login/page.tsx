'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', padding: '60px 20px' }}>
      <div className="container" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            <div style={{ width: 42, height: 42, background: 'var(--gold-glow)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} style={{ color: 'var(--gold-primary)' }} />
            </div>
            Chuo Connect Kenya
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.85rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: 20, fontWeight: 800 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.95rem' }}>Log in to your student account</p>
        </div>

        <div
          style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            padding: 36,
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          {error && (
            <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="jane@example.com"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Your password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button type="button" onClick={() => alert('Password reset instructions have been sent to your email.')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Forgot password?</button>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)', marginTop: 4 }}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 24, paddingTop: 20, textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


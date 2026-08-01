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
    <section style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-deep)' }}>
            <div style={{ width: 40, height: 40, background: 'var(--gold-glow)', border: '2px solid var(--navy-deep)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="var(--navy-deep)" />
            </div>
            Chuo Connect Kenya
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginTop: 20, fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>Log in to your account</p>
        </div>

        <div style={{ background: 'var(--bg-primary)', borderRadius: 20, border: '2px solid var(--navy-deep)', padding: 36, boxShadow: '6px 6px 0px var(--navy-deep)' }}>
          {error && (
            <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="jane@example.com"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Your password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <button type="button" onClick={() => alert('Password reset instructions have been sent to your email.')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--navy-deep)', fontWeight: 600 }}>Forgot password?</button>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-navy" style={{ width: '100%', justifyContent: 'center' }}>
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

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 24, paddingTop: 24, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

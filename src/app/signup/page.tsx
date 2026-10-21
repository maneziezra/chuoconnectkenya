'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      // Upon successful signup, create the student profile.
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({
            user_id: authData.user.id,
            full_name: formData.fullName,
            role: formData.role,
          });

        if (profileError) {
          console.error('Error creating profile details:', profileError.message || profileError);
          throw new Error(`Profile creation failed: ${profileError.message || 'Unknown error'}`);
        }
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', padding: '60px 20px' }}>
      <div className="container" style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            <div style={{ width: 42, height: 42, background: 'var(--gold-glow)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} style={{ color: 'var(--gold-primary)' }} />
            </div>
            Chuo Connect Kenya
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.85rem', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginTop: 20, fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.95rem' }}>Free for students. Always.</p>
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

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Wanjiru"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
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
                placeholder="Min. 8 characters"
                required
                minLength={8}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{ borderRadius: 'var(--radius-md)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>I am a...</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                required
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <option value="student">Student / Form 4 Leaver</option>
                <option value="parent">Parent / Guardian</option>
                <option value="counsellor">School Counsellor</option>
                <option value="uni">University Administrator</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8, borderRadius: 'var(--radius-md)' }}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account <ArrowRight size={16} style={{ marginLeft: 8 }} />
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
              By signing up, you agree to our <Link href="/terms" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Terms of Service</Link> and Privacy Policy.
            </p>
          </form>

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 24, paddingTop: 20, textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>Log in</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


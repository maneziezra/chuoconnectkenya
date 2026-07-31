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
    <section style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--navy-deep)' }}>
            <div style={{ width: 40, height: 40, background: 'var(--gold-glow)', border: '2px solid var(--navy-deep)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="var(--navy-deep)" />
            </div>
            Chuo Connect Kenya
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--navy-deep)', marginTop: 20, fontWeight: 700 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.95rem' }}>Free for students. Always.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, border: '2px solid var(--navy-deep)', padding: 36, boxShadow: '6px 6px 0px var(--navy-deep)' }}>
          {error && (
            <div style={{ padding: 12, background: '#fee2e2', color: '#b91c1c', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Wanjiru"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
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
                placeholder="Min. 8 characters"
                required
                minLength={8}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="student">Student / Form 4 Leaver</option>
                <option value="parent">Parent / Guardian</option>
                <option value="counsellor">School Counsellor</option>
                <option value="uni">University Administrator</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
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

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
              By signing up, you agree to our <Link href="/terms" style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>Terms of Service</Link> and Privacy Policy.
            </p>
          </form>

          <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 24, paddingTop: 24, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>Log in</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, School, Hash, Calendar, Loader2, Save, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    county: '',
    high_school: '',
    index_number: '',
    graduation_year: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push('/login');
          return;
        }

        setUserId(user.id);
        setEmail(user.email || null);

        const { data: profile, error: profileError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error(profileError);
        } else if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            phone_number: profile.phone_number || '',
            county: profile.county || '',
            high_school: profile.high_school || '',
            index_number: profile.index_number || '',
            graduation_year: profile.graduation_year?.toString() || '',
          });
          setAvatarUrl(profile.avatar_url || null);
        }
      } catch (err: any) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [supabase, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploadingAvatar(true);
      setError(null);
      setSuccess(null);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Error uploading profile picture');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const year = parseInt(formData.graduation_year);
      
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          county: formData.county,
          high_school: formData.high_school,
          index_number: formData.index_number,
          graduation_year: isNaN(year) ? null : year,
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
      
      setSuccess('Profile updated successfully!');
      router.refresh();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--gold-primary)' }} />
      </div>
    );
  }

  return (
    <section className="section-sm">
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Breadcrumb & Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>
            <Link href="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Dashboard</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            Profile Settings
          </div>
          <h1 className="text-h2" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <User size={32} style={{ color: 'var(--gold-primary)' }} />
            Profile Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Update your personal details and upload a profile picture.
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg-primary)',
            borderRadius: 20,
            border: '2px solid var(--border-medium)',
            boxShadow: 'var(--shadow-neo)',
            overflow: 'hidden'
          }}
        >
          {/* Avatar Section */}
          <div style={{ padding: '32px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', background: 'var(--navy-light)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isUploadingAvatar ? (
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--gold-primary)' }} />
              ) : avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <User size={40} style={{ color: 'var(--text-primary)' }} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Profile Picture</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Upload a picture to personalize your account.
              </p>
              <div>
                <label className="btn btn-outline" style={{ display: 'inline-flex', cursor: 'pointer', padding: '6px 16px', fontSize: '0.85rem' }}>
                  <Camera size={16} style={{ marginRight: 8 }} />
                  {avatarUrl ? 'Change Picture' : 'Upload Picture'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ padding: '32px' }}>
            {error && (
              <div style={{ padding: 16, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}
            
            {success && (
              <div style={{ padding: 16, background: 'var(--success-bg)', color: 'var(--success-text)', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} /> {success}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
              {/* Email Info (Read Only) */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Account Email (Verified)</label>
                <div style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.9rem', border: '1px solid var(--border-light)' }}>
                  {email}
                </div>
              </div>

              {/* Personal Details */}
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                  Personal Details
                </h3>
              </div>
              
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 0712345678"
                  value={formData.phone_number}
                  onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} /> Home County
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nairobi"
                  value={formData.county}
                  onChange={e => setFormData({ ...formData, county: e.target.value })}
                />
              </div>

              {/* Academic Details */}
              <div style={{ gridColumn: '1 / -1', marginTop: 16 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
                  Academic Background
                </h3>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <School size={14} /> High School Attended
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter the name of your high school"
                  value={formData.high_school}
                  onChange={e => setFormData({ ...formData, high_school: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Hash size={14} /> KCSE Index Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your 11-digit index number"
                  value={formData.index_number}
                  onChange={e => setFormData({ ...formData, index_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} /> Year of Graduation
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 2023"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.graduation_year}
                  onChange={e => setFormData({ ...formData, graduation_year: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 40, borderTop: '1px solid var(--border-light)', paddingTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={isSaving} className="btn btn-navy" style={{ paddingLeft: 32, paddingRight: 32 }}>
                {isSaving ? (
                  <><Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Saving Changes...</>
                ) : (
                  <><Save size={16} style={{ marginRight: 8 }} /> Save Profile</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

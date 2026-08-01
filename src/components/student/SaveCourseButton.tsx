'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, X, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface SaveCourseButtonProps {
  courseId: string;
  isSavedInitial: boolean;
  user: any | null;
  profile: any | null;
}

export default function SaveCourseButton({ courseId, isSavedInitial, user, profile }: SaveCourseButtonProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loading, setLoading] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // A profile is considered complete if the user has specified their high school and county.
  const isProfileComplete = profile && profile.county && profile.high_school;

  const handleSaveToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isSaved && !isProfileComplete) {
      setShowGate(true);
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        // Delete
        const { error } = await supabase
          .from('saved_courses')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', courseId);
        if (!error) setIsSaved(false);
      } else {
        // Insert
        const { error } = await supabase
          .from('saved_courses')
          .insert({ user_id: user.id, course_id: courseId });
        if (!error) setIsSaved(true);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleSaveToggle}
        disabled={loading}
        className={`btn btn-sm ${isSaved ? 'btn-navy' : 'btn-outline'}`}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        aria-label={isSaved ? "Remove saved course" : "Save course"}
        aria-pressed={isSaved}
      >
        {isSaved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
        {isSaved ? 'Saved' : 'Save'}
      </button>

      <AnimatePresence>
        {showGate && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(10, 25, 47, 0.4)', backdropFilter: 'blur(4px)' }} 
              onClick={() => setShowGate(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ 
                background: 'var(--bg-primary)', padding: 24, borderRadius: 20, 
                width: '100%', maxWidth: 400, position: 'relative', zIndex: 10,
                boxShadow: 'var(--shadow-neo)', border: '2px solid var(--border-medium)'
              }}
            >
              <button onClick={() => setShowGate(false)} style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Close">
                <X size={20} />
              </button>
              
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--gold-glow)', border: '2px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', marginBottom: 16 }}>
                <User size={24} />
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'Playfair Display, serif' }}>
                Complete Your Profile
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.5 }}>
                To save courses and get personalized cluster point calculations, please complete your student profile with your high school and county details.
              </p>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/profile" className="btn btn-navy" style={{ flex: 1, textAlign: 'center' }}>
                  Complete Profile
                </Link>
                <button className="btn btn-outline" onClick={() => setShowGate(false)} style={{ flex: 1 }}>
                  Not Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

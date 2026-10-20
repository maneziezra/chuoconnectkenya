'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const LOCAL_SAVED_KEY = 'cck_saved_courses';

interface SaveCourseButtonProps {
  courseId: string;
  isSavedInitial: boolean;
  user: any | null;
  profile: any | null;
}

export default function SaveCourseButton({ courseId, isSavedInitial, user }: SaveCourseButtonProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_SAVED_KEY);
      if (raw) {
        const list = JSON.parse(raw) as string[];
        if (Array.isArray(list) && list.includes(courseId)) {
          setIsSaved(true);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [courseId]);

  const handleSaveToggle = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);

    try {
      const raw = localStorage.getItem(LOCAL_SAVED_KEY);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      const updated = nextState
        ? Array.from(new Set([...list, courseId]))
        : list.filter(id => id !== courseId);
      localStorage.setItem(LOCAL_SAVED_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    if (!user) return;

    setLoading(true);
    try {
      if (!nextState) {
        await supabase
          .from('saved_courses')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', courseId);
      } else {
        await supabase
          .from('saved_courses')
          .insert({ user_id: user.id, course_id: courseId });
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveToggle}
      disabled={loading}
      className={`btn btn-sm ${isSaved ? 'btn-navy' : 'btn-outline'}`}
      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      aria-label={isSaved ? 'Remove saved course' : 'Save course'}
      aria-pressed={isSaved}
    >
      {isSaved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}


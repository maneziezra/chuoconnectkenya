'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap, Calculator, BookOpen, Clock,
  TrendingUp, ArrowRight, Loader2, Save, Edit3, X, Check
} from 'lucide-react';
import { GRADE_POINTS, CLUSTER_SUBJECTS, calculateClusterScore, calculateMeanGrade } from '@/lib/utils/kuccps';
import Link from 'next/link';
import type { Course, University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const SUBJECTS = Object.keys({
  'Mathematics': '', 'English': '', 'Kiswahili': '',
  'Physics': '', 'Chemistry': '', 'Biology': '',
  'History': '', 'Geography': '', 'Business Studies': '',
  'Agriculture': '', 'Computer Studies': '', 'CRE': '',
});

const GRADES = Object.keys(GRADE_POINTS);

type KuccpsCalculatorProps = {
  courses: Course[];
  universities: University[];
  initialProfile?: any;
  userId?: string;
};

export default function KuccpsCalculator({ courses, universities, initialProfile, userId }: KuccpsCalculatorProps) {
  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>(initialProfile?.saved_grades?.subjectGrades || {});
  const [overallGrade, setOverallGrade] = useState(initialProfile?.saved_grades?.overallGrade || calculateMeanGrade(initialProfile?.saved_grades?.subjectGrades || {}));
  const [results, setResults] = useState<{
    cluster: string;
    score: number;
    qualifyingCourses: Course[];
  }[] | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const hasSavedGrades = !!initialProfile?.saved_grades?.overallGrade;
  const [isEditingGrades, setIsEditingGrades] = useState(!hasSavedGrades);
  const supabase = createClient();

  const handleSaveGrades = async () => {
    if (!userId) return;
    setIsSaving(true);
    const { error } = await supabase.from('student_profiles').update({
      saved_grades: { overallGrade, subjectGrades }
    }).eq('user_id', userId);
    setIsSaving(false);
    if (error) {
      alert('Error saving grades: ' + error.message);
    } else {
      setIsEditingGrades(false);
    }
  };

  useEffect(() => {
    const computedMeanGrade = calculateMeanGrade(subjectGrades);
    setOverallGrade(computedMeanGrade);
  }, [subjectGrades]);

  useEffect(() => {
    if (!overallGrade) {
      setResults(null);
      return;
    }

    const clusterResults = Object.entries(CLUSTER_SUBJECTS).map(([cluster, subjects]) => {
      const score = calculateClusterScore(subjectGrades, subjects);
      const qualifyingCourses = courses.filter(
        c => c.clusterGroup === cluster && score >= c.minPoints
      );
      return { cluster, score, qualifyingCourses };
    });

    setResults(clusterResults);
  }, [overallGrade, subjectGrades, courses]);
  return (
    <div>
      {isEditingGrades ? (
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            marginBottom: 24,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3
              style={{
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Calculator size={18} style={{ color: 'var(--gold-primary)' }} />
              Enter Your KCSE Grades
            </h3>
            {hasSavedGrades && (
              <button 
                onClick={() => setIsEditingGrades(false)}
                className="btn btn-ghost btn-sm"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          {/* Overall Grade */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Overall Mean Grade *</label>
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: overallGrade ? 'var(--navy-deep)' : 'var(--text-tertiary)',
                fontWeight: overallGrade ? 700 : 400,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {overallGrade 
                ? `${overallGrade} (${GRADE_POINTS[overallGrade]} pts)` 
                : 'Auto-calculated after selecting 7 subjects'}
              {overallGrade && <span className="badge badge-green" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Auto-calculated <Check size={12} /></span>}
            </div>
          </div>

          {/* Subject Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
              marginBottom: 24,
            }}
          >
            {SUBJECTS.map(subject => (
              <div key={subject} className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>{subject}</label>
                <select
                  className="form-select"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  value={subjectGrades[subject] || ''}
                  onChange={e =>
                    setSubjectGrades(prev => ({ ...prev, [subject]: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            ))}
          </div>

          {userId && (
            <button 
              className="btn btn-navy" 
              style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }} 
              onClick={handleSaveGrades}
              disabled={isSaving}
            >
              {isSaving ? (
                <><Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Saving...</>
              ) : (
                <><Save size={16} style={{ marginRight: 8 }} /> Save My Grades</>
              )}
            </button>
          )}

          {/* Formula note */}
          <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 12, textAlign: 'center' }}>
            Uses official KUCCPS formula: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>w = √(4/7 × r × R)</span>
          </p>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--navy-deep)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Academic Profile
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--gold-primary)', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
                {overallGrade}
              </span>
              <span style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 500 }}>
                Mean Grade
              </span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={14} style={{ color: 'var(--gold-primary)' }} />
              Grades securely saved
            </div>
          </div>
          <button 
            className="btn btn-outline" 
            style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setIsEditingGrades(true)}
          >
            <Edit3 size={16} /> Edit Grades
          </button>
        </div>
      )}

      {/* Results */}
      {results && (
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ marginBottom: 8 }}>
            <h2 className="text-h2" style={{ color: 'var(--text-primary)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <TrendingUp size={24} style={{ color: 'var(--gold-primary)' }} />
              Your Cluster Scores & Qualifying Courses
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              These are your official weighted cluster points based on the grades you entered. We've matched you with programmes you qualify for across Kenyan universities.
            </p>
          </div>
          {results.filter(r => r.qualifyingCourses.length > 0).length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                No qualifying courses found based on your current cluster scores.
              </p>
            </div>
          ) : (
            results.filter(r => r.qualifyingCourses.length > 0).map(({ cluster, score, qualifyingCourses }) => (
              <div
                key={cluster}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                {/* Cluster Header */}
                <div
                  style={{
                    background: 'var(--navy-deep)',
                    padding: '14px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>
                    {cluster}
                  </span>
                  <span
                    style={{
                      color: 'var(--gold-primary)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    {score.toFixed(2)} pts
                  </span>
                </div>

                <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {qualifyingCourses.map(course => {
                      const offeredAt = universities.filter(u =>
                        course.universityIds.includes(u.id)
                      );
                      return (
                        <Link
                          key={course.id}
                          href="/courses"
                          className="card hover-gold"
                          style={{
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'var(--transition)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                              <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0 }}>
                                {course.title}
                              </h4>
                              <span className="badge badge-green" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>
                                <Check size={12} style={{ marginRight: 2 }} /> Qualifies
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={14} style={{ color: 'var(--text-tertiary)' }} /> {course.duration}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <GraduationCap size={14} style={{ color: 'var(--text-tertiary)' }} /> Min {course.minPoints.toFixed(1)} pts
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <BookOpen size={14} style={{ color: 'var(--text-tertiary)' }} /> {offeredAt.length} {offeredAt.length === 1 ? 'University' : 'Universities'}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
                            <ArrowRight size={18} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          <Link href="/universities" className="btn btn-navy" style={{ justifyContent: 'center' }}>
            Browse Matching Universities <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

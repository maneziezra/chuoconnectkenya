'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap, Calculator, BookOpen, Clock,
  TrendingUp, ArrowRight, Loader2, Save, Edit3, X, Check,
  Wallet, Briefcase, Sparkles, Plus, Trash2, Share2, Printer,
  AlertTriangle, ShieldCheck, Phone, Mail, User, Award
} from 'lucide-react';
import {
  GRADE_POINTS,
  CLUSTER_SUBJECTS,
  DIPLOMA_PATHWAYS,
  gradeToPoints,
  calculateClusterScore,
  calculateMeanGrade,
  calculateAggregatePoints,
  isDegreeEligible,
  normalizeClusterName,
  getPlacementOdds,
  calculateHefBand,
  estimateCourseAnnualCostKes,
  type HefInput,
  type PlacementOdds,
} from '@/lib/utils/kuccps';
import { coursesData as fallbackCoursesData } from '@/lib/data/courses';
import { universitiesData as fallbackUniversitiesData } from '@/lib/data/universities';
import Link from 'next/link';
import type { Course, University } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { saveStudentSnapshot } from '@/lib/utils/studentSnapshot';
import ExpressInquiryModal from '@/components/university/ExpressInquiryModal';

const SUBJECTS = [
  'Mathematics', 'English', 'Kiswahili',
  'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'CRE',
  'Business Studies', 'Agriculture', 'Computer Studies',
];

const GRADES = Object.keys(GRADE_POINTS);

const DEMO_PRESETS: { label: string; badge: string; grades: Record<string, string> }[] = [
  {
    label: 'STEM & Medicine Star',
    badge: 'A- (78 pts)',
    grades: {
      Mathematics: 'A', English: 'B+', Kiswahili: 'A-',
      Physics: 'A-', Chemistry: 'A-', Biology: 'A',
      Geography: 'A-', 'Computer Studies': 'A',
    },
  },
  {
    label: 'Tech & Business Candidate',
    badge: 'B (63 pts)',
    grades: {
      Mathematics: 'B+', English: 'B', Kiswahili: 'B',
      Physics: 'B', Chemistry: 'B-', Biology: 'B',
      'Business Studies': 'A-', Geography: 'B+',
    },
  },
  {
    label: 'Direct Degree Entry',
    badge: 'C+ (49 pts)',
    grades: {
      Mathematics: 'C+', English: 'B-', Kiswahili: 'C+',
      Biology: 'C+', Chemistry: 'C', History: 'B',
      'Business Studies': 'B-', CRE: 'B',
    },
  },
  {
    label: 'Diploma-to-Degree Bridge',
    badge: 'C (40 pts)',
    grades: {
      Mathematics: 'C', English: 'C+', Kiswahili: 'C',
      Biology: 'C', Chemistry: 'C-', Geography: 'C+',
      'Business Studies': 'C+', Agriculture: 'C',
    },
  },
];

const BASKET_SLOTS = [
  { slot: '1a', label: 'Choice 1a (Primary Degree)', hint: 'Top dream programme & campus' },
  { slot: '1b', label: 'Choice 1b (Alt Campus 1)', hint: 'Same programme, second university option' },
  { slot: '1c', label: 'Choice 1c (Alt Campus 2)', hint: 'Same programme, third university option' },
  { slot: '2',  label: 'Choice 2 (Strong Match)', hint: 'Competitive alternative course' },
  { slot: '3',  label: 'Choice 3 (Safe Backup)', hint: 'Course where your score is +2.0 pts above cutoff' },
  { slot: '4',  label: 'Choice 4 (Safety Net / Bridge)', hint: 'Guaranteed placement backup' },
] as const;

type BasketSlotKey = typeof BASKET_SLOTS[number]['slot'];

export interface BasketItem {
  slot: BasketSlotKey;
  course: Course;
  universityId: string;
  universityName: string;
  studentScore: number;
  odds: PlacementOdds;
}

type KuccpsCalculatorProps = {
  courses?: Course[];
  universities?: University[];
  initialProfile?: any;
  userId?: string;
};

export default function KuccpsCalculator({
  courses = [],
  universities = [],
  initialProfile,
  userId,
}: KuccpsCalculatorProps) {
  // Merge DB courses & fallback courses so all 8 clusters are always populated
  const allCourses = useMemo(() => {
    const map = new Map<string, Course>();
    for (const c of fallbackCoursesData) {
      map.set(c.title.toLowerCase(), c);
    }
    for (const c of courses) {
      const key = c.title.toLowerCase();
      const existing = map.get(key);
      map.set(key, {
        ...existing,
        ...c,
        clusterGroup: normalizeClusterName(c.clusterGroup, c.title),
        estimatedAnnualCostKes: c.estimatedAnnualCostKes || existing?.estimatedAnnualCostKes,
      });
    }
    return Array.from(map.values());
  }, [courses]);

  const allUniversities = useMemo(() => {
    const map = new Map<string, University>();
    for (const u of fallbackUniversitiesData) {
      map.set(u.id, u);
    }
    for (const u of universities) {
      map.set(u.id, { ...map.get(u.id), ...u } as University);
    }
    return Array.from(map.values());
  }, [universities]);

  const [activeTab, setActiveTab] = useState<'matcher' | 'hef' | 'basket'>('matcher');
  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>(
    initialProfile?.saved_grades?.subjectGrades || DEMO_PRESETS[1].grades
  );
  const [showReachCourses, setShowReachCourses] = useState(true);
  const [showDiplomaBridge, setShowDiplomaBridge] = useState(false);

  const hasSavedGrades = !!initialProfile?.saved_grades?.overallGrade;
  const [gradesSource, setGradesSource] = useState<'sample' | 'entered' | 'saved'>(
    hasSavedGrades ? 'saved' : 'sample'
  );
  const [hefTouched, setHefTouched] = useState(false);

  // HEF Band Simulator state
  const [hefInput, setHefInput] = useState<HefInput>({
    monthlyIncomeKes: 35000,
    schoolType: 'public_boarding',
    familyStatus: 'standard',
    siblingsInTertiary: 0,
  });

  // KUCCPS Choice Basket state
  const [basket, setBasket] = useState<Partial<Record<BasketSlotKey, BasketItem>>>({});

  // Free Lead Capture Gate for Printable / WhatsApp Placement Report
  const [leadUnlocked, setLeadUnlocked] = useState(false);
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadFormError, setLeadFormError] = useState('');
  const [leadSendNotice, setLeadSendNotice] = useState('');
  const [leadForm, setLeadForm] = useState({
    fullName: initialProfile?.full_name || '',
    whatsapp: '',
    email: '',
    targetUniversityId: 'uon',
  });
  const [submittingLead, setSubmittingLead] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isEditingGrades, setIsEditingGrades] = useState(!hasSavedGrades);
  const supabase = createClient();

  const overallGrade = useMemo(() => calculateMeanGrade(subjectGrades), [subjectGrades]);
  const aggregatePoints = useMemo(() => calculateAggregatePoints(subjectGrades), [subjectGrades]);
  const degreeQualified = useMemo(() => isDegreeEligible(overallGrade), [overallGrade]);
  const hefResult = useMemo(() => calculateHefBand(hefInput), [hefInput]);
  const hasRealResults = gradesSource !== 'sample' && !!overallGrade;

  const eligibleDiplomas = useMemo(() => {
    if (!overallGrade) return DIPLOMA_PATHWAYS;
    const studentPts = gradeToPoints(overallGrade);
    return DIPLOMA_PATHWAYS.filter(dip => studentPts >= gradeToPoints(dip.minMeanGrade || 'C-'));
  }, [overallGrade]);

  useEffect(() => {
    if (activeTab === 'hef') {
      setHefTouched(true);
    }
  }, [activeTab]);

  // Compute cluster scores & matched courses
  const clusterResults = useMemo(() => {
    if (!overallGrade) return null;

    return Object.entries(CLUSTER_SUBJECTS).map(([cluster, subjects]) => {
      const score = calculateClusterScore(subjectGrades, subjects);
      const matchedCourses = allCourses
        .filter(c => normalizeClusterName(c.clusterGroup, c.title) === cluster)
        .map(course => ({
          course,
          odds: getPlacementOdds(score, course.minPoints),
        }))
        .filter(item => {
          if (!degreeQualified) return false;
          if (item.odds.status === 'safe' || item.odds.status === 'competitive') return true;
          if (showReachCourses && item.odds.status === 'reach') return true;
          return false;
        })
        .sort((a, b) => b.course.minPoints - a.course.minPoints);

      return {
        cluster,
        subjects,
        score,
        matchedCourses,
      };
    });
  }, [overallGrade, subjectGrades, allCourses, degreeQualified, showReachCourses]);

  // Automatically enable Diploma Bridge view when Mean Grade is below C+
  useEffect(() => {
    if (overallGrade && !degreeQualified) {
      setShowDiplomaBridge(true);
    }
  }, [overallGrade, degreeQualified]);

  // Remember the student's own latest result (never the sample profile) so the
  // admission-enquiry form on university and course pages can pre-fill it.
  useEffect(() => {
    if (!hasRealResults || !overallGrade || !clusterResults) return;
    saveStudentSnapshot({
      meanGrade: overallGrade,
      aggregatePoints,
      bestClusterScore: Math.max(...clusterResults.map(c => c.score)),
      hefBand: hefResult.band,
      updatedAt: new Date().toISOString(),
    });
  }, [hasRealResults, overallGrade, aggregatePoints, clusterResults, hefResult.band]);

  const handleSaveGrades = async () => {
    if (!userId) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('student_profiles')
      .update({
        saved_grades: { overallGrade, subjectGrades },
      })
      .eq('user_id', userId);
    setIsSaving(false);
    if (error) {
      alert('Error saving grades: ' + error.message);
    } else {
      setIsEditingGrades(false);
    }
  };

  const addToBasket = (course: Course, studentScore: number, odds: PlacementOdds, preferredUniId?: string) => {
    const uniId = preferredUniId || course.universityIds[0] || 'uon';
    const uniObj = allUniversities.find(u => u.id === uniId);
    const universityName = uniObj?.name || uniId.toUpperCase();

    // Find first empty slot in 1a -> 1b -> 1c -> 2 -> 3 -> 4
    const nextSlot = BASKET_SLOTS.find(s => !basket[s.slot])?.slot || '4';

    setBasket(prev => ({
      ...prev,
      [nextSlot]: {
        slot: nextSlot,
        course,
        universityId: uniId,
        universityName,
        studentScore,
        odds,
      },
    }));
  };

  const removeFromBasket = (slot: BasketSlotKey) => {
    setBasket(prev => {
      const copy = { ...prev };
      delete copy[slot];
      return copy;
    });
  };

  const basketCount = Object.keys(basket).length;

  const handleUnlockReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.fullName.trim() || !leadForm.whatsapp.trim() || !leadConsent) return;
    setSubmittingLead(true);
    setLeadFormError('');
    setLeadSendNotice('');

    const firstBasketItem = Object.values(basket)[0];
    const topClusterScore = clusterResults ? Math.max(...clusterResults.map(c => c.score)) : 0;
    const isDiploma = firstBasketItem?.course.level === 'Diploma';

    let revealReport = true;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: firstBasketItem?.universityId || leadForm.targetUniversityId || 'uon',
          studentName: leadForm.fullName,
          phone: leadForm.whatsapp,
          email: leadForm.email,
          targetCourse: firstBasketItem?.course.title,
          // Only attach results the student actually entered; never the sample profile.
          clusterPoints: hasRealResults && !isDiploma ? (firstBasketItem?.studentScore || topClusterScore) : undefined,
          meanGrade: hasRealResults ? overallGrade || undefined : undefined,
          hefBand: hefTouched ? hefResult.band : undefined,
          source: 'calculator',
          consent: leadConsent,
        }),
      });

      if (!res.ok) {
        const data: { error?: string; fieldErrors?: Record<string, string> } = await res.json().catch(() => ({}));
        if (res.status === 400) {
          // The student can fix this (e.g. a mistyped number), so keep the form open.
          revealReport = false;
          setLeadFormError(data.fieldErrors?.phone || data.fieldErrors?.studentName || data.fieldErrors?.email || data.error || 'Please check your details.');
        } else {
          // Our side failed (service down / not set up yet). The report is still theirs.
          setLeadSendNotice(`Your report is ready, but we could not pass your details to the university. ${data.error ?? ''}`.trim());
        }
      }
    } catch {
      setLeadSendNotice('Your report is ready, but we could not reach our servers to pass your details to the university.');
    } finally {
      setSubmittingLead(false);
      if (revealReport) setLeadUnlocked(true);
    }
  };

  const handleShareWhatsApp = () => {
    const topCluster = clusterResults
      ? [...clusterResults].sort((a, b) => b.score - a.score)[0]
      : null;
    const basketLines = BASKET_SLOTS.map(({ slot }) => {
      const item = basket[slot];
      return item
        ? `• Choice ${slot}: ${item.course.title} (${item.universityName}) · Score: ${item.studentScore.toFixed(1)} vs Cutoff: ${item.course.minPoints.toFixed(1)}`
        : null;
    })
      .filter(Boolean)
      .join('\n');

    const text = [
      `*My Chuo Connect KUCCPS & HEF Placement Report*`,
      `• Mean Grade: *${overallGrade}* (${aggregatePoints}/84 pts)`,
      topCluster ? `• Best Cluster: *${topCluster.score.toFixed(1)}/48* (${topCluster.cluster})` : '',
      `• Estimated HEF Tier: *Band ${hefResult.band}* (${hefResult.scholarshipPct}% Gov Scholarship, ${hefResult.loanPct}% HELB Loan, ${hefResult.householdPct}% Household)`,
      basketLines ? `\n*My KUCCPS Choice Basket:*\n${basketLines}` : '',
      `\nCalculate yours at: https://chuoconnectkenya.vercel.app/calculator`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const totalQualifyingCount = useMemo(() => {
    if (!clusterResults) return 0;
    const uniqueIds = new Set<string>();
    clusterResults.forEach(cr => cr.matchedCourses.forEach(mc => uniqueIds.add(mc.course.id)));
    return uniqueIds.size;
  }, [clusterResults]);

  return (
    <div>
      {/* ── TOP NAVIGATION TABS (MATCHER / HEF SIMULATOR / CHOICE BASKET) ── */}
      <div
        data-ui="kuccps-step-tabs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('matcher')}
          style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-lg)',
            border: activeTab === 'matcher' ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
            background: activeTab === 'matcher' ? 'var(--accent-main)' : 'var(--bg-secondary)',
            color: activeTab === 'matcher' ? 'var(--text-inverse)' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'transform var(--apple-press), background 0.16s ease, border-color 0.16s ease',
          }}
        >
          <Calculator size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
              Step 1 · Official Formula
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Cluster &amp; Course Matcher
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hef')}
          style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-lg)',
            border: activeTab === 'hef' ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
            background: activeTab === 'hef' ? 'var(--accent-main)' : 'var(--bg-secondary)',
            color: activeTab === 'hef' ? 'var(--text-inverse)' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'transform var(--apple-press), background 0.16s ease, border-color 0.16s ease',
          }}
        >
          <Wallet size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
              Step 2 · Band {hefResult.band} ({hefResult.householdPct}% Fee)
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              HEF Band 1–5 Fee Simulator
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('basket')}
          style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-lg)',
            border: activeTab === 'basket' ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
            background: activeTab === 'basket' ? 'var(--accent-main)' : 'var(--bg-secondary)',
            color: activeTab === 'basket' ? 'var(--text-inverse)' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'transform var(--apple-press), background 0.16s ease, border-color 0.16s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Briefcase size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
                Step 3 · Revision Simulator
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                KUCCPS Basket ({basketCount}/6)
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: KCSE CLUSTER & COURSE MATCHER
         ===================================================================== */}
      {activeTab === 'matcher' && (
        <div>
          {isEditingGrades ? (
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 28,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <h3
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    margin: 0,
                  }}
                >
                  <Calculator size={18} style={{ color: 'var(--gold-primary)' }} />
                  Enter Your KCSE Subject Grades
                </h3>
                {hasSavedGrades && (
                  <button
                    type="button"
                    onClick={() => setIsEditingGrades(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>

              {/* Quick Demo Profiles Bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />
                  Instant Sample KCSE Profiles (Click to test):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DEMO_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setGradesSource('sample');
                        setSubjectGrades(preset.grades);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-medium)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{preset.label}</span>
                      <span className="tabular-nums" style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSubjectGrades({})}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-light)',
                      background: 'transparent',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Live Aggregate & Mean Grade Banner */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
                    Computed KCSE Mean Grade (Best 7 Subjects)
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: overallGrade ? 'var(--text-primary)' : 'var(--text-tertiary)', marginTop: 4 }}>
                    {overallGrade
                      ? `${overallGrade} (${aggregatePoints} / 84 Aggregate Points)`
                      : 'Select at least 7 subjects to compute your Mean Grade'}
                  </div>
                </div>
                {overallGrade && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      className="badge"
                      style={{
                        background: degreeQualified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: degreeQualified ? 'var(--success-text)' : 'var(--gold-primary)',
                        border: '1px solid currentColor',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {degreeQualified ? 'Direct Degree & TVET Eligible (C+ and above)' : 'TVET & Diploma-to-Degree Bridge Eligible'}
                    </span>
                  </div>
                )}
              </div>

              {/* 12-Subject Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: 14,
                  marginBottom: 24,
                }}
              >
                {SUBJECTS.map(subject => (
                  <div key={subject} className="form-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      {subject}
                    </label>
                    <select
                      className="form-select"
                      style={{ padding: '10px 12px', fontSize: '0.9rem', fontWeight: 600 }}
                      value={subjectGrades[subject] || ''}
                      onChange={e => {
                        setGradesSource('entered');
                        setSubjectGrades(prev => ({ ...prev, [subject]: e.target.value }));
                      }}
                    >
                      <option value=""> · Not Taken · </option>
                      {GRADES.map(g => (
                        <option key={g} value={g}>
                          {g} ({GRADE_POINTS[g]} pts)
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {userId && (
                <button
                  type="button"
                  className="btn btn-navy"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                  onClick={handleSaveGrades}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} style={{ marginRight: 8 }} /> Save My KCSE Grades to Profile
                    </>
                  )}
                </button>
              )}

              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: 8, textAlign: 'center' }}>
                Uses official KUCCPS formula:{' '}
                <code style={{ fontWeight: 600 }}>
                  w = sqrt((c / 48) * (p / 84)) * 48
                </code>{' '}
                • Indicative cut-offs based on 2024 placement cycle.
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
                flexWrap: 'wrap',
                gap: 16,
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Saved Academic Profile
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>
                    {overallGrade}
                  </span>
                  <span style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600 }}>
                    Mean Grade ({aggregatePoints} / 84 pts)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)' }}
                onClick={() => setIsEditingGrades(true)}
              >
                <Edit3 size={16} /> Edit Grades
              </button>
            </div>
          )}

          {/* ── CLUSTER SCORE SUMMARY PILLS ── */}
          {clusterResults && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <h2 className="text-h2" style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TrendingUp size={22} style={{ color: 'var(--gold-primary)' }} />
                    Your 8 Official Cluster Scores & Matched Programmes
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Matched across <strong>{totalQualifyingCount} degree programmes</strong> • Showing HEF{' '}
                    <strong>Band {hefResult.band} ({hefResult.householdPct}% household cost)</strong> estimates.
                  </p>
                </div>

                {/* Filter toggles */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowReachCourses(prev => !prev)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border-medium)',
                      background: showReachCourses ? 'var(--gold-glow)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {showReachCourses ? 'Including Reach (-2.0 pts)' : 'Show Reach Courses'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDiplomaBridge(prev => !prev)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border-medium)',
                      background: showDiplomaBridge ? 'var(--gold-glow)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {showDiplomaBridge ? 'Showing Diploma / TVET Pathways' : '+ View Diploma / TVET Bridge'}
                  </button>
                </div>
              </div>

              {/* Compact 8-Cluster Score Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                {clusterResults.map(cr => (
                  <div
                    key={cr.cluster}
                    style={{
                      padding: '14px 16px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {cr.cluster.split(':')[0]}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cr.cluster.split(':')[1] || cr.cluster}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                        {cr.score.toFixed(2)} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>/ 48</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {cr.matchedCourses.length} matches
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Degree Course Matches by Cluster */}
              {degreeQualified ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {clusterResults
                    .filter(cr => cr.matchedCourses.length > 0)
                    .map(({ cluster, subjects, score, matchedCourses }) => (
                      <div
                        key={cluster}
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-light)',
                          borderTop: '1px solid var(--apple-glass-highlight)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div
                          style={{
                            background: 'var(--navy-deep)',
                            padding: '16px 22px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 12,
                          }}
                        >
                          <div>
                            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1rem' }}>
                              {cluster}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.76rem', marginTop: 2 }}>
                              Cluster Subjects: {subjects.join(' • ')}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span
                              className="tabular-nums"
                              style={{
                                color: 'var(--gold-primary)',
                                fontFamily: 'var(--font-serif)',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                              }}
                            >
                              {score.toFixed(2)} / 48 pts
                            </span>
                          </div>
                        </div>

                        <div style={{ padding: '18px 20px', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {matchedCourses.map(({ course, odds }) => {
                            const offeredAt = allUniversities.filter(u =>
                              course.universityIds.includes(u.id)
                            );
                            const annualCost = estimateCourseAnnualCostKes(course);
                            const householdAnnualKes = Math.round((annualCost * hefResult.householdPct) / 100);
                            const isInBasket = Object.values(basket).some(b => b?.course.id === course.id);

                            const badgeStyles =
                              odds.status === 'safe'
                                ? { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-text)' }
                                : odds.status === 'competitive'
                                ? { bg: 'rgba(199, 155, 55, 0.18)', color: 'var(--gold-primary)' }
                                : { bg: 'rgba(245, 158, 11, 0.18)', color: '#D97706' };

                            return (
                              <div
                                key={course.id}
                                className="card"
                                style={{
                                  padding: '18px 20px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 16,
                                }}
                              >
                                <div style={{ flex: '1 1 320px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                                    <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', margin: 0 }}>
                                      {course.title}
                                    </h4>
                                    <span
                                      className="tabular-nums"
                                      style={{
                                        padding: '3px 10px',
                                        borderRadius: 6,
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-serif)',
                                        background: badgeStyles.bg,
                                        color: badgeStyles.color,
                                      }}
                                    >
                                      {odds.badgeText} • {odds.probabilityPct}% Odds
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Clock size={14} style={{ color: 'var(--text-tertiary)' }} /> {course.duration}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <GraduationCap size={14} style={{ color: 'var(--text-tertiary)' }} /> Cutoff:{' '}
                                      <strong>{course.minPoints.toFixed(1)} pts</strong>
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Wallet size={14} style={{ color: 'var(--gold-primary)' }} /> Est. Family Fee (Band {hefResult.band}):{' '}
                                      <strong style={{ color: 'var(--text-primary)' }}>
                                        KES {householdAnnualKes.toLocaleString()}/yr
                                      </strong>
                                    </span>
                                  </div>

                                  {offeredAt.length > 0 && (
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                                      {offeredAt.slice(0, 5).map(uni => (
                                        <Link
                                          key={uni.id}
                                          href={`/universities/${uni.id}`}
                                          style={{
                                            fontSize: '0.74rem',
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {uni.abbrev || uni.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <button
                                    type="button"
                                    onClick={() => addToBasket(course, score, odds)}
                                    disabled={isInBasket}
                                    className={isInBasket ? 'btn btn-outline btn-sm' : 'btn btn-gold btn-sm'}
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    {isInBasket ? (
                                      <>
                                        <Check size={14} /> In Basket
                                      </>
                                    ) : (
                                      <>
                                        <Plus size={14} /> Add to Basket
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: 24,
                    background: 'var(--gold-glow)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 6 }}>
                    Mean Grade {overallGrade}: Direct Diploma-to-Degree & TVET Pathways Unlocked
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    While direct KUCCPS degree placement requires a minimum KCSE Mean Grade of <strong>C+ (46 points)</strong>, you qualify immediately for accredited University Diplomas and TVET programmes below · many with <strong>2nd-year BSc/BCom credit transfers</strong>.
                  </p>
                </div>
              )}

              {/* ── DIPLOMA & TVET BRIDGE PATHWAYS ── */}
              {showDiplomaBridge && (
                <div
                  style={{
                    marginTop: 28,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div
                    style={{
                      background: 'var(--navy-deep)',
                      padding: '16px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--gold-primary)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        TVET & University Bridge Programmes
                      </div>
                      <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem' }}>
                        Accredited Diploma-to-Degree Progression Pathways (C, C-, D+)
                      </div>
                    </div>
                    <span className="badge badge-gold">HEF & TVET Cap: KES 67,189/yr</span>
                  </div>

                  <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {eligibleDiplomas.length === 0 && (
                      <p style={{ gridColumn: '1 / -1', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        None of the listed diploma programmes accept a mean grade of {overallGrade}. Certificate-level TVET courses
                        may still be open to you; contact your nearest TVET institution.
                      </p>
                    )}
                    {eligibleDiplomas.map(dip => {
                      const isInBasket = Object.values(basket).some(b => b?.course.id === dip.id);
                      // Diplomas are admitted by mean grade, not cluster points, and intakes are not guaranteed:
                      // 'competitive' keeps them from counting as a SAFE backup in the basket audit.
                      const dipOdds: PlacementOdds = {
                        status: 'competitive',
                        label: 'Meets the minimum entry grade',
                        badgeText: `Min Grade ${dip.minMeanGrade || 'C-'}`,
                        delta: 0,
                        probabilityPct: 0, // not applicable to diplomas; never displayed
                      };
                      return (
                        <div key={dip.id} className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                              <span className="badge badge-navy" style={{ fontSize: '0.7rem' }}>
                                {dip.level} • Min {dip.minMeanGrade}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                                {dip.duration}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                              {dip.title}
                            </h4>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                              {dip.description}
                            </p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              Family Fee: <strong>KES {Math.round(((dip.estimatedAnnualCostKes || 67189) * hefResult.householdPct) / 100).toLocaleString()}/yr</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => addToBasket(dip, 0, dipOdds)}
                              disabled={isInBasket}
                              className={isInBasket ? 'btn btn-outline btn-sm' : 'btn btn-gold btn-sm'}
                            >
                              {isInBasket ? 'In Basket' : '+ Add to Basket'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: HEF BAND 1–5 FEE & LOAN SIMULATOR
         ===================================================================== */}
      {activeTab === 'hef' && (
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span className="badge badge-gold" style={{ marginBottom: 10 }}>
              New Higher Education Funding Model (HEF / Means Testing Instrument)
            </span>
            <h2 className="text-h2" style={{ fontSize: '1.5rem', marginBottom: 8 }}>
              HEF Band 1–5 Scholarship, HELB Loan & Household Fee Simulator
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Under Kenya&apos;s Student-Centred Funding Model, your university funding is split into a <strong>Government Scholarship</strong>, a <strong>HELB Tuition & Upkeep Loan</strong>, and a <strong>Household Contribution</strong> across 5 Means-Tested Bands.
            </p>
          </div>

          {/* Input Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 18,
              padding: 20,
              background: 'var(--bg-secondary)',
              borderRadius: 16,
              border: '1px solid var(--border-light)',
              marginBottom: 28,
            }}
          >
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                Monthly Household Income (KES)
              </label>
              <input
                type="number"
                min={0}
                step={2500}
                className="form-input"
                value={hefInput.monthlyIncomeKes}
                onChange={e =>
                  setHefInput(prev => ({ ...prev, monthlyIncomeKes: Math.max(0, Number(e.target.value)) }))
                }
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {[
                  { label: '≤ 5.9k', val: 5000 },
                  { label: '20k', val: 20000 },
                  { label: '50k', val: 50000 },
                  { label: '95k', val: 95000 },
                  { label: '150k+', val: 150000 },
                ].map(b => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setHefInput(prev => ({ ...prev, monthlyIncomeKes: b.val }))}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      borderRadius: 6,
                      border: '1px solid var(--border-medium)',
                      background: hefInput.monthlyIncomeKes === b.val ? 'var(--gold-primary)' : 'var(--bg-primary)',
                      color: hefInput.monthlyIncomeKes === b.val ? 'var(--gold-contrast-text)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                KCSE Secondary School Attended
              </label>
              <select
                className="form-select"
                value={hefInput.schoolType}
                onChange={e =>
                  setHefInput(prev => ({ ...prev, schoolType: e.target.value as HefInput['schoolType'] }))
                }
              >
                <option value="public_day">Public Sub-County / Day School</option>
                <option value="public_boarding">Public National / Extra-County Boarding</option>
                <option value="private">Private Secondary School</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                Family & Vulnerability Status
              </label>
              <select
                className="form-select"
                value={hefInput.familyStatus}
                onChange={e =>
                  setHefInput(prev => ({ ...prev, familyStatus: e.target.value as HefInput['familyStatus'] }))
                }
              >
                <option value="standard">Two-Parent / Standard Household</option>
                <option value="single_parent">Single-Parent Household</option>
                <option value="orphan_vulnerable">Orphan / Registered Social Protection</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                Siblings in University / TVET
              </label>
              <select
                className="form-select"
                value={hefInput.siblingsInTertiary}
                onChange={e =>
                  setHefInput(prev => ({ ...prev, siblingsInTertiary: Number(e.target.value) }))
                }
              >
                <option value={0}>None (Only me)</option>
                <option value={1}>1 sibling in Univ/TVET</option>
                <option value={2}>2+ siblings in Univ/TVET</option>
              </select>
            </div>
          </div>

          {/* Band Result Banner */}
          <div
            style={{
              background: 'var(--navy-deep)',
              borderRadius: 18,
              padding: 24,
              color: '#FFFFFF',
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Estimated Means-Testing Outcome
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '4px 0', color: '#FFFFFF' }}>
                  {hefResult.bandLabel}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', margin: 0 }}>
                  {hefResult.tierDescription}
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                  Annual HELB Upkeep Stipend
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
                  KES {hefResult.upkeepLoanKes.toLocaleString()} / yr
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                  Paid directly to student for accommodation & meals
                </div>
              </div>
            </div>

            {/* Visual Split Bar */}
            <div style={{ height: 18, borderRadius: 9, overflow: 'hidden', display: 'flex', marginBottom: 14 }}>
              <div
                style={{
                  width: `${hefResult.scholarshipPct}%`,
                  background: '#10B981',
                  transition: 'width 0.3s ease',
                }}
                title={`Government Scholarship: ${hefResult.scholarshipPct}%`}
              />
              <div
                style={{
                  width: `${hefResult.loanPct}%`,
                  background: '#C79B37',
                  transition: 'width 0.3s ease',
                }}
                title={`HELB Tuition Loan: ${hefResult.loanPct}%`}
              />
              <div
                style={{
                  width: `${hefResult.householdPct}%`,
                  background: '#EF4444',
                  transition: 'width 0.3s ease',
                }}
                title={`Household Contribution: ${hefResult.householdPct}%`}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.14)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Gov. Scholarship (Free Grant)</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#34D399', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.scholarshipPct}%
                </div>
              </div>
              <div style={{ padding: 12, background: 'rgba(199, 155, 55, 0.18)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>HELB Tuition Loan</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.loanPct}%
                </div>
              </div>
              <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.18)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>Household / Parent Fee Share</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FCA5A5', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.householdPct}%
                </div>
              </div>
            </div>
          </div>

          {/* Course Cost Table */}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Indicative Annual Fee Breakdown Under Band {hefResult.band}
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '12px 14px' }}>Programme</th>
                  <th style={{ padding: '12px 14px' }}>Annual Cost</th>
                  <th style={{ padding: '12px 14px' }}>Gov Scholarship ({hefResult.scholarshipPct}%)</th>
                  <th style={{ padding: '12px 14px' }}>HELB Loan ({hefResult.loanPct}%)</th>
                  <th style={{ padding: '12px 14px', color: 'var(--gold-primary)' }}>Parent Pays / Sem ({hefResult.householdPct / 2}%)</th>
                </tr>
              </thead>
              <tbody>
                {(basketCount > 0 ? Object.values(basket).map(b => b!.course) : allCourses.slice(0, 6)).map(course => {
                  const cost = estimateCourseAnnualCostKes(course);
                  const govKes = Math.round((cost * hefResult.scholarshipPct) / 100);
                  const loanKes = Math.round((cost * hefResult.loanPct) / 100);
                  const parentSemKes = Math.round((cost * hefResult.householdPct) / 200);
                  return (
                    <tr key={course.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{course.title}</td>
                      <td className="tabular-nums" style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)' }}>KES {cost.toLocaleString()}</td>
                      <td className="tabular-nums" style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', color: 'var(--success-text)' }}>
                        KES {govKes.toLocaleString()}
                      </td>
                      <td className="tabular-nums" style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)' }}>KES {loanKes.toLocaleString()}</td>
                      <td className="tabular-nums" style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        KES {parentSemKes.toLocaleString()} / sem
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: KUCCPS CHOICE BASKET (1a/1b/1c + 2/3/4) & PLACEMENT REPORT
         ===================================================================== */}
      {activeTab === 'basket' && (
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            boxShadow: '0 20px 48px -12px rgba(26, 35, 56, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <span className="badge badge-navy" style={{ marginBottom: 8 }}>
                KUCCPS Portal Simulation
              </span>
              <h2 className="text-h2" style={{ fontSize: '1.5rem', marginBottom: 6 }}>
                My KUCCPS Choice Basket & Placement Strategy Audit
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Build your 6-slot placement basket (`1a`, `1b`, `1c`, `2`, `3`, `4`) and generate your printable placement &amp; funding report.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('matcher')}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              + Add More Courses from Matcher
            </button>
          </div>

          {/* 6-Slot Basket Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 28 }}>
            {BASKET_SLOTS.map(({ slot, label, hint }) => {
              const item = basket[slot];
              return (
                <div
                  key={slot}
                  style={{
                    padding: 18,
                    borderRadius: 'var(--radius-md)',
                    border: item ? '1.5px solid var(--gold-primary)' : '1px dashed var(--border-light)',
                    background: item ? 'var(--bg-secondary)' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
                        {label}
                      </span>
                      {item && (
                        <button
                          type="button"
                          onClick={() => removeFromBasket(slot)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                          title="Remove from slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {item ? (
                      <>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.98rem', marginBottom: 6 }}>
                          {item.course.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                          Campus: <strong>{item.universityName}</strong>
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', margin: '12px 0' }}>
                        {hint} · Select a course in the Matcher tab to fill this slot.
                      </p>
                    )}
                  </div>

                  {item && (
                    <div style={{ paddingTop: 10, borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                        <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                          {item.course.level === 'Diploma'
                            ? `Entry: mean grade ${item.course.minMeanGrade ?? 'C-'} or above`
                            : `Your Score: ${item.studentScore.toFixed(1)} vs ${item.course.minPoints.toFixed(1)}`}
                        </span>
                        <span style={{ color: item.odds.status === 'safe' ? 'var(--success-text)' : 'var(--gold-primary)', fontWeight: 700 }}>
                          {item.odds.badgeText}
                        </span>
                      </div>
                      <ExpressInquiryModal
                        source="calculator"
                        universityId={item.universityId}
                        universityName={item.universityName}
                        defaultCourse={item.course.title}
                        prefill={hasRealResults ? {
                          clusterPoints: item.course.level === 'Diploma' ? undefined : item.studentScore,
                          meanGrade: overallGrade || undefined,
                          hefBand: hefTouched ? hefResult.band : undefined,
                        } : undefined}
                        triggerLabel="Request admission info"
                        triggerClassName="btn btn-outline btn-sm"
                        triggerStyle={{ width: '100%', justifyContent: 'center' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Strategy Audit Callout */}
          <div
            style={{
              padding: 18,
              borderRadius: 14,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            {Object.values(basket).some(b => b?.odds.status === 'safe') ? (
              <ShieldCheck size={24} style={{ color: 'var(--success-text)', flexShrink: 0, marginTop: 2 }} />
            ) : (
              <AlertTriangle size={24} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: 2 }} />
            )}
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 4 }}>
                {Object.values(basket).some(b => b?.odds.status === 'safe')
                  ? 'Strong Balanced Basket Strategy'
                  : 'Placement Strategy Tip: Add at least one SAFE Backup Choice'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {Object.values(basket).some(b => b?.odds.status === 'safe')
                  ? 'Your basket includes at least one programme where your weighted cluster score is +2.0 points above the cutoff, protecting you from unplaced first-revision outcomes.'
                  : 'To avoid missing out during the first KUCCPS revision, ensure Choice 3 or Choice 4 has a cutoff at least 2.0 points below your cluster score.'}
              </p>
            </div>
          </div>

          {leadSendNotice && (
            <div role="status" style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 16, fontSize: '0.88rem', background: 'var(--gold-glow)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}>
              {leadSendNotice}
            </div>
          )}

          {/* Free WhatsApp / Email Lead Gate to Generate Shareable & Printable Report */}
          {!leadUnlocked ? (
            <form
              onSubmit={handleUnlockReport}
              style={{
                background: 'var(--navy-deep)',
                borderRadius: 18,
                padding: 28,
                color: '#FFFFFF',
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <span className="badge badge-gold" style={{ marginBottom: 10 }}>
                  100% Free Student Placement Report
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
                  Generate Your Printable PDF Report &amp; WhatsApp Summary
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginBottom: 20, lineHeight: 1.6 }}>
                  Enter your details below to generate your official Chuo Connect Placement & HEF Funding Report Card and receive direct admission & scholarship alerts from your target universities.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.85)' }}>
                    <User size={12} style={{ display: 'inline', marginRight: 4 }} /> Student Full Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Joy Wanjiku"
                    className="form-input"
                    value={leadForm.fullName}
                    onChange={e => setLeadForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.85)' }}>
                    <Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> WhatsApp Number *
                  </label>
                  <input
                    required
                    placeholder="e.g. 0712 345 678"
                    className="form-input"
                    value={leadForm.whatsapp}
                    onChange={e => setLeadForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.85)' }}>
                    <Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@email.com"
                    className="form-input"
                    value={leadForm.email}
                    onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6, color: 'rgba(255,255,255,0.85)' }}>
                    <Award size={12} style={{ display: 'inline', marginRight: 4 }} /> Top Dream University
                  </label>
                  <select
                    className="form-select"
                    value={leadForm.targetUniversityId}
                    onChange={e => setLeadForm(prev => ({ ...prev, targetUniversityId: e.target.value }))}
                  >
                    {allUniversities.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.8rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', marginBottom: 16, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={leadConsent}
                  onChange={e => setLeadConsent(e.target.checked)}
                  style={{ marginTop: 3 }}
                />
                <span>
                  I agree that Chuo Connect may share my name, phone number, KCSE results and the programme I selected with the
                  university I choose, so they can contact me about admission. See our{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)', textDecoration: 'underline' }}>privacy policy</a>.
                </span>
              </label>
              {leadFormError && (
                <p role="alert" style={{ color: '#FCA5A5', fontSize: '0.84rem', marginBottom: 12 }}>{leadFormError}</p>
              )}

              <button type="submit" className="btn btn-gold" disabled={submittingLead}>
                {submittingLead ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Generating Report...
                  </>
                ) : (
                  <>
                    Generate Placement Report &amp; Share <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div
              style={{
                background: 'var(--navy-deep)',
                borderRadius: 18,
                padding: 28,
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div style={{ color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Report Ready for {leadForm.fullName}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0' }}>
                  Mean Grade {overallGrade} ({aggregatePoints}/84) • HEF Band {hefResult.band}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.86rem', margin: 0 }}>
                  Share your placement summary on WhatsApp with parents/guardians or print a PDF copy for KUCCPS portal application.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" onClick={handleShareWhatsApp} className="btn btn-gold">
                  <Share2 size={16} /> Share on WhatsApp
                </button>
                <button type="button" onClick={() => window.print()} className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                  <Printer size={16} /> Print / Save PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

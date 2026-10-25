'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap, Calculator, Clock,
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

const CORE_SUBJECTS = ['Mathematics', 'English', 'Kiswahili'] as const;
const SCIENCE_SUBJECTS = ['Physics', 'Chemistry', 'Biology'] as const;
const HUMANITIES_APPLIED_SUBJECTS = [
  'History', 'Geography', 'CRE',
  'Business Studies', 'Agriculture', 'Computer Studies',
] as const;

const ALL_SUBJECTS = [
  ...CORE_SUBJECTS,
  ...SCIENCE_SUBJECTS,
  ...HUMANITIES_APPLIED_SUBJECTS,
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
          revealReport = false;
          setLeadFormError(data.fieldErrors?.phone || data.fieldErrors?.studentName || data.fieldErrors?.email || data.error || 'Please check your details.');
        } else {
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

  const renderSubjectSelect = (subject: string) => (
    <div
      key={subject}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <label
        htmlFor={`subject-${subject}`}
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {subject}
      </label>
      <select
        id={`subject-${subject}`}
        aria-label={`${subject} grade`}
        value={subjectGrades[subject] || ''}
        onChange={(e) => {
          setGradesSource('entered');
          setSubjectGrades((prev) => ({ ...prev, [subject]: e.target.value }));
        }}
        style={{
          width: 'auto',
          minWidth: 92,
          padding: '4px 6px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          borderRadius: 6,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="">— None —</option>
        {GRADES.map((g) => (
          <option key={g} value={g}>
            {g} ({GRADE_POINTS[g]})
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {/* ── APPLE SEGMENTED CONTROL ── */}
      <nav
        aria-label="Calculator stages"
        style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          padding: 4,
          borderRadius: 'var(--radius-full, 9999px)',
          border: '1px solid var(--border-light)',
          gap: 4,
          marginBottom: 'clamp(24px, 3.5vw, 36px)',
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          {
            id: 'matcher',
            label: '1. Cluster Matcher',
            meta: overallGrade ? `${overallGrade} (${aggregatePoints} pts)` : 'KCSE Subjects',
          },
          {
            id: 'hef',
            label: '2. HEF Funding',
            meta: `Band ${hefResult.band} · ${hefResult.householdPct}% Fee`,
          },
          {
            id: 'basket',
            label: '3. Choice Basket',
            meta: `${basketCount}/6 Selected`,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'matcher' | 'hef' | 'basket')}
              style={{
                flex: 1,
                minWidth: 160,
                padding: '10px 16px',
                borderRadius: 'var(--radius-full, 9999px)',
                border: isActive ? '1px solid var(--border-light)' : '1px solid transparent',
                background: isActive ? 'var(--surface-card)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'transform var(--apple-press, 0.12s cubic-bezier(0.4, 0, 0.2, 1)), background 0.16s ease, color 0.16s ease',
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>
                {tab.label}
              </span>
              <span
                className="tabular-nums"
                style={{
                  fontSize: '0.75rem',
                  color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                  fontWeight: 400,
                }}
              >
                {tab.meta}
              </span>
            </button>
          );
        })}
      </nav>

      {/* =====================================================================
          TAB 1: KCSE CLUSTER & COURSE MATCHER
         ===================================================================== */}
      {activeTab === 'matcher' && (
        <div>
          {isEditingGrades ? (
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: 'clamp(20px, 3vw, 32px)',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <h3
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Enter Your KCSE Subject Grades
                </h3>
                {hasSavedGrades && (
                  <button
                    type="button"
                    onClick={() => setIsEditingGrades(false)}
                    className="btn btn-ghost btn-sm"
                    style={{ transition: 'transform var(--apple-press)' }}
                  >
                    <X size={15} /> Cancel
                  </button>
                )}
              </div>

              {/* Quick Demo Profiles Bar */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-gold)' }} />
                  <span>Instant sample KCSE profiles:</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setGradesSource('sample');
                        setSubjectGrades(preset.grades);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full, 9999px)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--surface-card)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'transform var(--apple-press), background 0.15s ease',
                      }}
                    >
                      <span>{preset.label}</span>
                      <span className="tabular-nums" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSubjectGrades({})}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full, 9999px)',
                      border: '1px solid var(--border-light)',
                      background: 'transparent',
                      color: 'var(--text-tertiary)',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'transform var(--apple-press)',
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Live Aggregate & Mean Grade Banner */}
              <div
                style={{
                  padding: '20px 24px',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-light)',
                  borderTop: '1px solid var(--apple-glass-highlight)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    Computed KCSE Mean Grade (Best 7 Subjects)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                        fontWeight: 400,
                        color: overallGrade ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        lineHeight: 1,
                      }}
                    >
                      {overallGrade || '—'}
                    </span>
                    {overallGrade && (
                      <span className="tabular-nums" style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                        {aggregatePoints} / 84 aggregate points
                      </span>
                    )}
                  </div>
                </div>

                {overallGrade && (
                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full, 9999px)',
                        background: degreeQualified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(199, 155, 55, 0.15)',
                        color: degreeQualified ? 'var(--success-text)' : 'var(--accent-gold)',
                        border: '1px solid currentColor',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                      }}
                    >
                      {degreeQualified ? 'Direct Degree & TVET Eligible (C+ and above)' : 'TVET & Diploma Bridge Eligible'}
                    </span>
                  </div>
                )}
              </div>

              {/* 3 Structured Subject Groups in 3 Desktop Columns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {/* Column 1: Core Compulsory */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Core Compulsory (3)
                  </h4>
                  {CORE_SUBJECTS.map((subject) => renderSubjectSelect(subject))}
                </div>

                {/* Column 2: Sciences */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Sciences (3)
                  </h4>
                  {SCIENCE_SUBJECTS.map((subject) => renderSubjectSelect(subject))}
                </div>

                {/* Column 3: Humanities & Applied */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Humanities &amp; Applied (6)
                  </h4>
                  {HUMANITIES_APPLIED_SUBJECTS.map((subject) => renderSubjectSelect(subject))}
                </div>
              </div>

              {userId && (
                <button
                  type="button"
                  className="btn btn-navy"
                  style={{ width: '100%', justifyContent: 'center', marginBottom: 12, transition: 'transform var(--apple-press)' }}
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

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 8, textAlign: 'center', margin: 0 }}>
                Uses official KUCCPS formula: <code style={{ fontWeight: 600 }}>w = sqrt((c / 48) * (p / 84)) * 48</code> · Indicative cut-offs based on latest placement cycle.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: '24px 28px',
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
              }}
            >
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Saved Academic Profile
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--text-primary)',
                      fontSize: '2.5rem',
                      fontWeight: 400,
                      lineHeight: 1,
                    }}
                  >
                    {overallGrade}
                  </span>
                  <span className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                    Mean Grade ({aggregatePoints} / 84 pts)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ transition: 'transform var(--apple-press)' }}
                onClick={() => setIsEditingGrades(true)}
              >
                <Edit3 size={15} /> Edit Grades
              </button>
            </div>
          )}

          {/* ── CLUSTER SCORE SUMMARY & MATCHES ── */}
          {clusterResults && (
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <TrendingUp size={22} style={{ color: 'var(--accent-gold)' }} />
                    Your 8 Cluster Scores &amp; Matched Programmes
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4, margin: '4px 0 0' }}>
                    Matched across <strong>{totalQualifyingCount} degree programmes</strong> · Showing HEF{' '}
                    <strong>Band {hefResult.band} ({hefResult.householdPct}% family share)</strong> estimates.
                  </p>
                </div>

                {/* Filter toggles */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowReachCourses(prev => !prev)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-full, 9999px)',
                      border: '1px solid var(--border-light)',
                      background: showReachCourses ? 'var(--surface-card)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'transform var(--apple-press)',
                    }}
                  >
                    {showReachCourses ? 'Including Reach (-2.0 pts)' : 'Show Reach Courses'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDiplomaBridge(prev => !prev)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-full, 9999px)',
                      border: '1px solid var(--border-light)',
                      background: showDiplomaBridge ? 'var(--surface-card)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'transform var(--apple-press)',
                    }}
                  >
                    {showDiplomaBridge ? 'Showing TVET / Diploma Pathways' : '+ View Diploma / TVET Bridge'}
                  </button>
                </div>
              </div>

              {/* Compact 8-Cluster Score Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                {clusterResults.map(cr => (
                  <div
                    key={cr.cluster}
                    style={{
                      padding: '16px 18px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      borderTop: '1px solid var(--apple-glass-highlight)',
                      borderRadius: 'var(--radius-lg, 12px)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                      {cr.cluster.split(':')[0]}
                    </div>
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '4px 0 10px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cr.cluster.split(':')[1] || cr.cluster}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span
                        className="tabular-nums"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.35rem',
                          fontWeight: 400,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {cr.score.toFixed(2)}{' '}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>/ 48</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {cr.matchedCourses.length} matches
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Degree Course Matches by Cluster */}
              {degreeQualified ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {clusterResults
                    .filter(cr => cr.matchedCourses.length > 0)
                    .map(({ cluster, subjects, score, matchedCourses }) => (
                      <div
                        key={cluster}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                          borderTop: '1px solid var(--apple-glass-highlight)',
                          borderRadius: 'var(--radius-xl, 16px)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 12,
                          }}
                        >
                          <div>
                            <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                              {cluster}
                            </h3>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', marginTop: 2 }}>
                              Cluster subjects: {subjects.join(' · ')}
                            </div>
                          </div>
                          <span
                            className="tabular-nums"
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontWeight: 400,
                              fontSize: '1.25rem',
                              color: 'var(--accent-gold)',
                            }}
                          >
                            {score.toFixed(2)} / 48 pts
                          </span>
                        </div>

                        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {matchedCourses.map(({ course, odds }) => {
                            const offeredAt = allUniversities.filter(u =>
                              course.universityIds.includes(u.id)
                            );
                            const annualCost = estimateCourseAnnualCostKes(course);
                            const householdAnnualKes = Math.round((annualCost * hefResult.householdPct) / 100);
                            const isInBasket = Object.values(basket).some(b => b?.course.id === course.id);

                            const badgeStyles =
                              odds.status === 'safe'
                                ? { bg: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-text)' }
                                : odds.status === 'competitive'
                                ? { bg: 'rgba(199, 155, 55, 0.15)', color: 'var(--accent-gold)' }
                                : { bg: 'rgba(239, 68, 68, 0.18)', color: '#F87171' };

                            return (
                              <div
                                key={course.id}
                                style={{
                                  background: 'var(--surface-card)',
                                  border: '1px solid var(--border-light)',
                                  borderRadius: 'var(--radius-lg, 12px)',
                                  padding: '16px 18px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 16,
                                }}
                              >
                                <div style={{ flex: '1 1 320px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                                    <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>
                                      {course.title}
                                    </h4>
                                    <span
                                      className="tabular-nums"
                                      style={{
                                        padding: '3px 10px',
                                        borderRadius: 'var(--radius-full, 9999px)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: badgeStyles.bg,
                                        color: badgeStyles.color,
                                      }}
                                    >
                                      {odds.badgeText} · {odds.probabilityPct}% Odds
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Clock size={14} style={{ color: 'var(--text-tertiary)' }} /> {course.duration}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <GraduationCap size={14} style={{ color: 'var(--text-tertiary)' }} /> Cutoff:{' '}
                                      <strong>{course.minPoints.toFixed(1)} pts</strong>
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <Wallet size={14} style={{ color: 'var(--accent-gold)' }} /> Est. Family Fee (Band {hefResult.band}):{' '}
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
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: 6,
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-light)',
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            fontWeight: 500,
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
                                    style={{ whiteSpace: 'nowrap', transition: 'transform var(--apple-press)' }}
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
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    borderRadius: 'var(--radius-xl, 16px)',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: 6 }}>
                    Mean Grade {overallGrade}: Direct Diploma &amp; TVET Pathways Unlocked
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    Direct KUCCPS degree placement requires a minimum KCSE Mean Grade of <strong>C+ (46 points)</strong>. You qualify immediately for accredited University Diplomas and TVET programmes below, many with credit transfer into degree programmes.
                  </p>
                </div>
              )}

              {/* ── DIPLOMA & TVET BRIDGE PATHWAYS ── */}
              {showDiplomaBridge && (
                <div
                  style={{
                    marginTop: 28,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderTop: '1px solid var(--apple-glass-highlight)',
                    borderRadius: 'var(--radius-xl, 16px)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem' }}>
                        Accredited Diploma-to-Degree Progression Pathways (C, C-, D+)
                      </h3>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', marginTop: 2 }}>
                        TVET &amp; University Bridge Programmes
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full, 9999px)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: 'rgba(199, 155, 55, 0.15)',
                        color: 'var(--accent-gold)',
                        border: '1px solid currentColor',
                      }}
                    >
                      HEF &amp; TVET Cap: KES 67,189/yr
                    </span>
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
                      const dipOdds: PlacementOdds = {
                        status: 'competitive',
                        label: 'Meets minimum entry grade',
                        badgeText: `Min Grade ${dip.minMeanGrade || 'C-'}`,
                        delta: 0,
                        probabilityPct: 0,
                      };
                      return (
                        <div
                          key={dip.id}
                          style={{
                            background: 'var(--surface-card)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-lg, 12px)',
                            padding: 18,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 14,
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                {dip.level} · Min {dip.minMeanGrade}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                                {dip.duration}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, margin: 0 }}>
                              {dip.title}
                            </h4>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0 0' }}>
                              {dip.description}
                            </p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                              Family Fee: <strong>KES {Math.round(((dip.estimatedAnnualCostKes || 67189) * hefResult.householdPct) / 100).toLocaleString()}/yr</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => addToBasket(dip, 0, dipOdds)}
                              disabled={isInBasket}
                              className={isInBasket ? 'btn btn-outline btn-sm' : 'btn btn-gold btn-sm'}
                              style={{ transition: 'transform var(--apple-press)' }}
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
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: 'clamp(20px, 3.5vw, 32px)',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>
              HEF Funding &amp; HELB Loan Simulator
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Under Kenya&apos;s Student-Centred Funding Model, your university funding is split into a <strong>Government Scholarship</strong>, a <strong>HELB Tuition &amp; Upkeep Loan</strong>, and a <strong>Household Contribution</strong> across 5 Means-Tested Bands.
            </p>
          </div>

          {/* Input Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 18,
              padding: 20,
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg, 12px)',
              border: '1px solid var(--border-light)',
              marginBottom: 28,
            }}
          >
            <div className="form-group">
              <label htmlFor="hef-income" className="form-label" style={{ fontWeight: 600 }}>
                Monthly Household Income (KES)
              </label>
              <input
                id="hef-income"
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
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      borderRadius: 'var(--radius-full, 9999px)',
                      border: '1px solid var(--border-light)',
                      background: hefInput.monthlyIncomeKes === b.val ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                      color: hefInput.monthlyIncomeKes === b.val ? 'var(--gold-contrast-text, #ffffff)' : 'var(--text-secondary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'transform var(--apple-press)',
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hef-school" className="form-label" style={{ fontWeight: 600 }}>
                KCSE Secondary School Attended
              </label>
              <select
                id="hef-school"
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
              <label htmlFor="hef-family" className="form-label" style={{ fontWeight: 600 }}>
                Family &amp; Vulnerability Status
              </label>
              <select
                id="hef-family"
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
              <label htmlFor="hef-siblings" className="form-label" style={{ fontWeight: 600 }}>
                Siblings in University / TVET
              </label>
              <select
                id="hef-siblings"
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
              borderRadius: 'var(--radius-xl, 16px)',
              padding: 24,
              color: '#FFFFFF',
              marginBottom: 28,
              border: '1px solid var(--border-light)',
              borderTop: '1px solid var(--apple-glass-highlight)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 6px', color: '#FFFFFF' }}>
                  {hefResult.bandLabel}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', margin: 0 }}>
                  {hefResult.tierDescription}
                </p>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  padding: '12px 18px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                  Annual HELB Upkeep Stipend
                </div>
                <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                  KES {hefResult.upkeepLoanKes.toLocaleString()} / yr
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
                  Paid directly for accommodation &amp; meals
                </div>
              </div>
            </div>

            {/* Visual Split Bar */}
            <div style={{ height: 16, borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 14 }}>
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
              <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.16)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>Gov. Scholarship (Grant)</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#34D399', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.scholarshipPct}%
                </div>
              </div>
              <div style={{ padding: 12, background: 'rgba(199, 155, 55, 0.2)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>HELB Tuition Loan</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.loanPct}%
                </div>
              </div>
              <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.2)', borderRadius: 10 }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>Household Share</div>
                <div className="tabular-nums" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#FCA5A5', fontFamily: 'var(--font-serif)' }}>
                  {hefResult.householdPct}%
                </div>
              </div>
            </div>
          </div>

          {/* Course Cost Table */}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            Indicative Annual Fee Breakdown Under Band {hefResult.band}
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--surface-card)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Programme</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Annual Cost</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Gov Scholarship ({hefResult.scholarshipPct}%)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>HELB Loan ({hefResult.loanPct}%)</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-gold)' }}>Parent Pays / Sem ({hefResult.householdPct / 2}%)</th>
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
                      <td className="tabular-nums" style={{ padding: '12px 14px', fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--text-primary)' }}>
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
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderTop: '1px solid var(--apple-glass-highlight)',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: 'clamp(20px, 3.5vw, 32px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                My KUCCPS Choice Basket &amp; Strategy Audit
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Build your 6-slot placement basket (1a, 1b, 1c, 2, 3, 4) and generate your placement and funding report.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('matcher')}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: 'var(--radius-full, 9999px)', transition: 'transform var(--apple-press)' }}
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
                    borderRadius: 'var(--radius-lg, 12px)',
                    border: item ? '1px solid var(--accent-gold)' : '1px solid var(--border-light)',
                    background: item ? 'var(--surface-card)' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                        {label}
                      </span>
                      {item && (
                        <button
                          type="button"
                          onClick={() => removeFromBasket(slot)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'transform var(--apple-press)' }}
                          title="Remove from slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {item ? (
                      <>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.98rem', marginBottom: 4 }}>
                          {item.course.title}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
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
                        <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
                          {item.course.level === 'Diploma'
                            ? `Entry: min grade ${item.course.minMeanGrade ?? 'C-'}`
                            : `Score: ${item.studentScore.toFixed(1)} vs ${item.course.minPoints.toFixed(1)}`}
                        </span>
                        <span style={{ color: item.odds.status === 'safe' ? 'var(--success-text)' : 'var(--accent-gold)', fontWeight: 600 }}>
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
              borderRadius: 'var(--radius-lg, 12px)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-light)',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            {Object.values(basket).some(b => b?.odds.status === 'safe') ? (
              <ShieldCheck size={22} style={{ color: 'var(--success-text)', flexShrink: 0, marginTop: 2 }} />
            ) : (
              <AlertTriangle size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: 2 }} />
            )}
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 4 }}>
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
            <div role="status" style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 16, fontSize: '0.88rem', background: 'var(--surface-card)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}>
              {leadSendNotice}
            </div>
          )}

          {/* Free WhatsApp / Email Lead Gate to Generate Shareable & Printable Report */}
          {!leadUnlocked ? (
            <form
              onSubmit={handleUnlockReport}
              style={{
                background: 'var(--navy-deep)',
                borderRadius: 'var(--radius-xl, 16px)',
                padding: 28,
                color: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px' }}>
                  Generate Your Placement Report &amp; WhatsApp Summary
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', marginBottom: 20, lineHeight: 1.6 }}>
                  Enter your details below to generate your official Chuo Connect Placement &amp; HEF Funding Report Card and receive direct admission &amp; scholarship alerts from your target universities.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
                <div>
                  <label htmlFor="lead-fullname" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.9)' }}>
                    <User size={13} style={{ display: 'inline', marginRight: 4 }} /> Student Full Name *
                  </label>
                  <input
                    id="lead-fullname"
                    required
                    placeholder="e.g. Joy Wanjiku"
                    className="form-input"
                    value={leadForm.fullName}
                    onChange={e => setLeadForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="lead-whatsapp" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.9)' }}>
                    <Phone size={13} style={{ display: 'inline', marginRight: 4 }} /> WhatsApp Number *
                  </label>
                  <input
                    id="lead-whatsapp"
                    required
                    placeholder="e.g. 0712 345 678"
                    className="form-input"
                    value={leadForm.whatsapp}
                    onChange={e => setLeadForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.9)' }}>
                    <Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Email Address
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    placeholder="student@email.com"
                    className="form-input"
                    value={leadForm.email}
                    onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="lead-uni" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.9)' }}>
                    <Award size={13} style={{ display: 'inline', marginRight: 4 }} /> Top Dream University
                  </label>
                  <select
                    id="lead-uni"
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

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.8125rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', marginBottom: 16, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  required
                  checked={leadConsent}
                  onChange={e => setLeadConsent(e.target.checked)}
                  style={{ marginTop: 3 }}
                />
                <span>
                  I agree that Chuo Connect may share my name, phone number, KCSE results and chosen programme with the
                  selected university so they can contact me regarding admission. See our{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>privacy policy</a>.
                </span>
              </label>
              {leadFormError && (
                <p role="alert" style={{ color: '#FCA5A5', fontSize: '0.84rem', marginBottom: 12 }}>{leadFormError}</p>
              )}

              <button
                type="submit"
                className="btn btn-gold"
                disabled={submittingLead}
                style={{ transition: 'transform var(--apple-press)' }}
              >
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
                borderRadius: 'var(--radius-xl, 16px)',
                padding: 28,
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 20,
                border: '1px solid var(--border-light)',
                borderTop: '1px solid var(--apple-glass-highlight)',
              }}
            >
              <div>
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Report Ready for {leadForm.fullName}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px' }}>
                  Mean Grade {overallGrade} ({aggregatePoints}/84) · HEF Band {hefResult.band}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.86rem', margin: 0 }}>
                  Share your placement summary on WhatsApp or print a PDF copy for your KUCCPS portal application.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="btn btn-gold"
                  style={{ transition: 'transform var(--apple-press)' }}
                >
                  <Share2 size={16} /> Share on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', transition: 'transform var(--apple-press)' }}
                >
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
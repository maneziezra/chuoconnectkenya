import {
  FINANCING_PREFERENCES,
  LEAD_SOURCES,
  LEAD_STATUSES,
} from '@/lib/types';
import type {
  FinancingPreference,
  LeadInput,
  LeadSource,
  LeadStatus,
  UniversityLead,
} from '@/lib/types';

/**
 * Pure helpers for student lead capture and the partner CRM.
 * Deliberately free of React / Next / Supabase imports so they can be unit-tested
 * in plain Node and shared by the API route, the modal and the partner dashboard.
 */

export const SOURCE_LABELS: Record<LeadSource, string> = {
  university_page: 'University profile',
  course_page: 'Course finder',
  calculator: 'KUCCPS calculator',
};

export const FINANCING_LABELS: Record<FinancingPreference, string> = {
  hef_loan: 'HEF / HELB funded',
  self_sponsored: 'Self-sponsored',
  scholarship: 'Seeking scholarship',
  undecided: 'Undecided',
};

const KCSE_GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

/**
 * Normalises a Kenyan mobile number to E.164 (+254 7XX / 1XX XXX XXX).
 * Accepts 07xx…, 01xx…, 7xx…, 254…, +254… with spaces/dashes/brackets.
 * Returns null for anything else (landlines, foreign numbers, wrong length).
 */
export function normalizeKenyanPhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, '');
  let national: string;
  if (/^\+254\d{9}$/.test(cleaned)) national = cleaned.slice(4);
  else if (/^254\d{9}$/.test(cleaned)) national = cleaned.slice(3);
  else if (/^0\d{9}$/.test(cleaned)) national = cleaned.slice(1);
  else if (/^\d{9}$/.test(cleaned)) national = cleaned;
  else return null;
  return /^[17]\d{8}$/.test(national) ? `+254${national}` : null;
}

export type LeadValidation =
  | { ok: true; value: LeadInput }
  | { ok: false; errors: Record<string, string> };

function asTrimmedString(v: unknown): string | null {
  return typeof v === 'string' ? v.trim() : null;
}

// Rejects ASCII control characters without a control-char literal in a regex.
function hasControlChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 32 || c === 127) return true;
  }
  return false;
}

/** Validates untrusted JSON from the browser. Never trusts client-side checks. */
export function validateLeadInput(raw: unknown): LeadValidation {
  const errors: Record<string, string> = {};
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, errors: { _form: 'Invalid request body.' } };
  }
  const r = raw as Record<string, unknown>;

  const universityId = asTrimmedString(r.universityId);
  if (!universityId || universityId.length > 64 || !/^[A-Za-z0-9_-]+$/.test(universityId)) {
    errors.universityId = 'Please choose a university.';
  }

  const nameRaw = asTrimmedString(r.studentName);
  const studentName = nameRaw ? nameRaw.replace(/\s+/g, ' ') : '';
  if (studentName.length < 2 || studentName.length > 80 || hasControlChars(studentName)) {
    errors.studentName = 'Enter your full name (2-80 characters).';
  }

  const phoneRaw = asTrimmedString(r.phone);
  const phone = phoneRaw ? normalizeKenyanPhone(phoneRaw) : null;
  if (!phone) {
    errors.phone = 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.';
  }

  let email: string | null = null;
  const emailRaw = asTrimmedString(r.email);
  if (emailRaw) {
    if (emailRaw.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailRaw)) {
      errors.email = 'Enter a valid email address or leave it blank.';
    } else {
      email = emailRaw;
    }
  }

  let clusterPoints: number | null = null;
  if (r.clusterPoints !== undefined && r.clusterPoints !== null && r.clusterPoints !== '') {
    const n = Number(r.clusterPoints);
    if (!Number.isFinite(n) || n < 0 || n > 48) {
      errors.clusterPoints = 'Cluster points must be between 0 and 48.';
    } else {
      clusterPoints = Math.round(n * 100) / 100;
    }
  }

  let meanGrade: string | null = null;
  const gradeRaw = asTrimmedString(r.meanGrade);
  if (gradeRaw) {
    if (KCSE_GRADES.includes(gradeRaw)) meanGrade = gradeRaw;
    else errors.meanGrade = 'Unknown KCSE grade.';
  }

  let targetCourse: string | null = null;
  const courseRaw = asTrimmedString(r.targetCourse);
  if (courseRaw) {
    if (courseRaw.length > 160 || hasControlChars(courseRaw)) {
      errors.targetCourse = 'Course name is too long.';
    } else {
      targetCourse = courseRaw;
    }
  }

  let financingPreference: FinancingPreference = 'undecided';
  const finRaw = asTrimmedString(r.financingPreference);
  if (finRaw) {
    if ((FINANCING_PREFERENCES as readonly string[]).includes(finRaw)) {
      financingPreference = finRaw as FinancingPreference;
    } else {
      errors.financingPreference = 'Unknown financing option.';
    }
  }

  let hefBand: number | null = null;
  if (r.hefBand !== undefined && r.hefBand !== null && r.hefBand !== '') {
    const b = Number(r.hefBand);
    if (!Number.isInteger(b) || b < 1 || b > 5) errors.hefBand = 'HEF band must be 1-5.';
    else hefBand = b;
  }

  const sourceRaw = asTrimmedString(r.source);
  if (!sourceRaw || !(LEAD_SOURCES as readonly string[]).includes(sourceRaw)) {
    errors.source = 'Unknown lead source.';
  }

  if (r.consent !== true) {
    errors.consent = 'Please tick the box to agree to share your details.';
  }

  if (Object.keys(errors).length > 0 || !phone || !universityId) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      universityId,
      studentName,
      phone,
      email,
      clusterPoints,
      meanGrade,
      targetCourse,
      financingPreference,
      hefBand,
      source: sourceRaw as LeadSource,
    },
  };
}

// ---------------------------------------------------------------------------
// Partner dashboard metrics
// ---------------------------------------------------------------------------

export interface LeadMetrics {
  total: number;
  last30: number;
  prev30: number;
  /** Null when there is no previous-period data to compare against. */
  changePct: number | null;
  avgClusterPoints: number | null;
  byStatus: Record<LeadStatus, number>;
  /** Share of leads that reached Applied or Enrolled. */
  conversionPct: number | null;
  topCourses: { course: string; count: number }[];
  clusterBuckets: { name: string; count: number }[];
  bySource: { key: LeadSource; label: string; count: number }[];
  byFinancing: { key: FinancingPreference; label: string; count: number }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const CLUSTER_BUCKETS: { name: string; min: number; max: number }[] = [
  { name: 'Below 25', min: 0, max: 25 },
  { name: '25-30', min: 25, max: 30 },
  { name: '30-35', min: 30, max: 35 },
  { name: '35-40', min: 35, max: 40 },
  { name: '40-48', min: 40, max: 48.0001 },
];

export function computeLeadMetrics(leads: UniversityLead[], now: Date = new Date()): LeadMetrics {
  const nowMs = now.getTime();
  let last30 = 0;
  let prev30 = 0;
  let clusterSum = 0;
  let clusterCount = 0;

  const byStatus = Object.fromEntries(LEAD_STATUSES.map(s => [s, 0])) as Record<LeadStatus, number>;
  const courseCounts = new Map<string, number>();
  const buckets = CLUSTER_BUCKETS.map(b => ({ name: b.name, count: 0 }));
  const sourceCounts = new Map<LeadSource, number>();
  const financingCounts = new Map<FinancingPreference, number>();

  for (const lead of leads) {
    const t = Date.parse(lead.createdAt);
    if (!Number.isNaN(t)) {
      const age = nowMs - t;
      if (age >= 0 && age < 30 * DAY_MS) last30++;
      else if (age >= 30 * DAY_MS && age < 60 * DAY_MS) prev30++;
    }

    if (lead.status in byStatus) byStatus[lead.status]++;

    if (lead.cluster_points !== null && lead.cluster_points !== undefined) {
      clusterSum += lead.cluster_points;
      clusterCount++;
      const idx = CLUSTER_BUCKETS.findIndex(b => lead.cluster_points! >= b.min && lead.cluster_points! < b.max);
      if (idx >= 0) buckets[idx].count++;
    }

    const course = lead.target_course?.trim();
    if (course) courseCounts.set(course, (courseCounts.get(course) ?? 0) + 1);

    sourceCounts.set(lead.source, (sourceCounts.get(lead.source) ?? 0) + 1);
    financingCounts.set(lead.financing_preference, (financingCounts.get(lead.financing_preference) ?? 0) + 1);
  }

  const total = leads.length;

  return {
    total,
    last30,
    prev30,
    changePct: prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 1000) / 10 : null,
    avgClusterPoints: clusterCount > 0 ? Math.round((clusterSum / clusterCount) * 10) / 10 : null,
    byStatus,
    conversionPct: total > 0 ? Math.round(((byStatus.Applied + byStatus.Enrolled) / total) * 100) : null,
    topCourses: [...courseCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([course, count]) => ({ course, count })),
    clusterBuckets: buckets,
    bySource: LEAD_SOURCES.map(key => ({ key, label: SOURCE_LABELS[key], count: sourceCounts.get(key) ?? 0 })),
    byFinancing: FINANCING_PREFERENCES.map(key => ({
      key,
      label: FINANCING_LABELS[key],
      count: financingCounts.get(key) ?? 0,
    })),
  };
}

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const mins = Math.floor((now.getTime() - t) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(t).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Outreach + export
// ---------------------------------------------------------------------------

export function buildContactLinks(
  lead: Pick<UniversityLead, 'student_name' | 'phone' | 'email' | 'target_course'>,
  universityName: string
): { whatsapp: string; tel: string; mailto: string | null } {
  const firstName = lead.student_name.split(' ')[0];
  const topic = lead.target_course ? ` in ${lead.target_course}` : '';
  const message = `Hello ${firstName}, this is the admissions team at ${universityName}. Thank you for your interest${topic} via Chuo Connect. How can we help with your application?`;
  return {
    whatsapp: `https://wa.me/${lead.phone.replace('+', '')}?text=${encodeURIComponent(message)}`,
    tel: `tel:${lead.phone}`,
    mailto: lead.email
      ? `mailto:${lead.email}?subject=${encodeURIComponent(`Your enquiry to ${universityName}`)}&body=${encodeURIComponent(message)}`
      : null,
  };
}

/**
 * CSV cell escaping. Student-supplied text ends up in a spreadsheet opened by
 * university staff, so cells starting with = + - @ (or tab/CR) are prefixed with
 * a single quote to neutralise spreadsheet formula injection.
 */
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(leads: UniversityLead[]): string {
  const header = [
    'Received',
    'Student',
    'Phone',
    'Email',
    'Target course',
    'Cluster points (self-reported)',
    'KCSE mean grade (self-reported)',
    'Financing',
    'HEF band',
    'Source',
    'Stage',
  ];
  const rows = leads.map(l => [
    csvCell(l.createdAt),
    csvCell(l.student_name),
    // Phone is validated server-side to ^\+254[17]\d{8}$, so it is safe unescaped.
    l.phone,
    csvCell(l.email),
    csvCell(l.target_course),
    csvCell(l.cluster_points),
    csvCell(l.mean_grade),
    csvCell(FINANCING_LABELS[l.financing_preference] ?? l.financing_preference),
    csvCell(l.hef_band),
    csvCell(SOURCE_LABELS[l.source] ?? l.source),
    csvCell(l.status),
  ]);
  // BOM so Excel opens UTF-8 names correctly.
  return '\uFEFF' + [header.map(csvCell).join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

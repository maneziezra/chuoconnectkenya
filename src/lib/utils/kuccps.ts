import type { Course } from '@/lib/types';

/**
 * Official KUCCPS Course Weighting Formula & HEF Funding Engine
 * w = sqrt((c / 48) * (p / 84)) * 48
 * where:
 *   c = sum of 4 cluster subject grade points (max 48)
 *   p = sum of best 7 KCSE subject grade points (max 84)
 */

export const GRADE_POINTS: Record<string, number> = {
  'A':  12, 'A-': 11,
  'B+': 10, 'B':   9, 'B-': 8,
  'C+':  7, 'C':   6, 'C-': 5,
  'D+':  4, 'D':   3, 'D-': 2,
  'E':   1,
};

export function gradeToPoints(grade: string): number {
  return GRADE_POINTS[grade] ?? 0;
}

export function getMeanGradeFromPoints(totalPoints: number): string {
  if (totalPoints >= 81) return 'A';
  if (totalPoints >= 74) return 'A-';
  if (totalPoints >= 67) return 'B+';
  if (totalPoints >= 60) return 'B';
  if (totalPoints >= 53) return 'B-';
  if (totalPoints >= 46) return 'C+';
  if (totalPoints >= 39) return 'C';
  if (totalPoints >= 32) return 'C-';
  if (totalPoints >= 25) return 'D+';
  if (totalPoints >= 18) return 'D';
  if (totalPoints >= 11) return 'D-';
  if (totalPoints > 0) return 'E';
  return '';
}

export function calculateAggregatePoints(grades: Record<string, string>): number {
  const filledCount = Object.values(grades).filter(g => g && g !== '').length;
  if (filledCount < 7) {
    return 0;
  }

  const p = (subject: string) => gradeToPoints(grades[subject] || '');

  const compulsory = [p('Mathematics'), p('English'), p('Kiswahili')];

  const sciences = [p('Physics'), p('Chemistry'), p('Biology')].sort((a, b) => b - a);
  const best2Sciences = sciences.slice(0, 2);
  const remainingScience = sciences.slice(2);

  const humanities = [p('History'), p('Geography'), p('CRE')].sort((a, b) => b - a);
  const bestHumanity = humanities.slice(0, 1);
  const remainingHumanities = humanities.slice(1);

  const options = [
    ...remainingScience,
    ...remainingHumanities,
    p('Business Studies'),
    p('Agriculture'),
    p('Computer Studies'),
  ].sort((a, b) => b - a);

  const bestOption = options.slice(0, 1);

  const selected7 = [
    ...compulsory,
    ...best2Sciences,
    ...bestHumanity,
    ...bestOption,
  ];

  return selected7.reduce((sum, val) => sum + val, 0);
}

export function calculateMeanGrade(grades: Record<string, string>): string {
  const totalPoints = calculateAggregatePoints(grades);
  if (totalPoints === 0) return '';
  return getMeanGradeFromPoints(totalPoints);
}

export function isDegreeEligible(meanGrade: string): boolean {
  return gradeToPoints(meanGrade) >= 7; // C+ (7 points per subject / 46 aggregate) and above
}

/**
 * KUCCPS raw score weighting formula
 */
export function kuccpsWeight(subjectPoints: number, overallPoints: number): number {
  return Math.sqrt((4 / 7) * subjectPoints * overallPoints);
}

/**
 * Calculate a student's weighted cluster score for a given 4-subject cluster group.
 * Supports alternative group subjects (e.g. best Science or best Humanity when a specific option wasn't taken).
 */
export function calculateClusterScore(
  grades: Record<string, string>,
  clusterSubjects: string[]
): number {
  const p = calculateAggregatePoints(grades);
  if (p === 0) return 0;

  const pVal = (sub: string) => gradeToPoints(grades[sub] || '');

  let c = 0;
  for (const subject of clusterSubjects) {
    let pts = pVal(subject);

    // Smart KUCCPS subject-group fallback if student took an equivalent subject in that group
    if (pts === 0) {
      if (subject === 'English' || subject === 'Kiswahili') {
        pts = Math.max(pVal('English'), pVal('Kiswahili'));
      } else if (subject === 'History' || subject === 'Geography' || subject === 'CRE') {
        pts = Math.max(pVal('History'), pVal('Geography'), pVal('CRE'));
      } else if (subject === 'Business Studies' || subject === 'Agriculture' || subject === 'Computer Studies') {
        pts = Math.max(
          pVal('Business Studies'),
          pVal('Agriculture'),
          pVal('Computer Studies'),
          pVal('History'),
          pVal('Geography')
        );
      } else if (subject === 'Physics' || subject === 'Biology' || subject === 'Chemistry') {
        pts = Math.max(pVal('Physics'), pVal('Chemistry'), pVal('Biology'));
      }
    }
    c += pts;
  }

  // Official formula: W = sqrt((c / 48) * (p / 84)) * 48
  const w = Math.sqrt((c / 48) * (p / 84)) * 48;
  return parseFloat(w.toFixed(2));
}

// Official KUCCPS Subject Clusters
export const CLUSTER_SUBJECTS: Record<string, string[]> = {
  'Cluster 1: Law & Legal Studies': ['English', 'Kiswahili', 'History', 'Mathematics'],
  'Cluster 3: Arts & Humanities': ['English', 'Kiswahili', 'History', 'Geography'],
  'Cluster 4: Business & Economics': ['Mathematics', 'English', 'Business Studies', 'Geography'],
  'Cluster 7: Engineering & Technology': ['Mathematics', 'Physics', 'Chemistry', 'English'],
  'Cluster 9: Computing & Information Technology': ['Mathematics', 'Physics', 'English', 'Chemistry'],
  'Cluster 13: Medicine, Nursing & Health': ['Biology', 'Chemistry', 'Mathematics', 'English'],
  'Cluster 15: Agriculture, Environment & Agribusiness': ['Biology', 'Chemistry', 'Agriculture', 'Mathematics'],
  'Cluster 19: Education & Teaching': ['English', 'Mathematics', 'Biology', 'History'],
};

/**
 * Normalizes legacy or database cluster labels to the canonical CLUSTER_SUBJECTS keys
 */
export function normalizeClusterName(clusterGroup: string, courseTitle = ''): string {
  if (CLUSTER_SUBJECTS[clusterGroup]) {
    return clusterGroup;
  }

  const titleLower = courseTitle.toLowerCase();
  const groupLower = (clusterGroup || '').toLowerCase();

  if (titleLower.includes('medicine') || titleLower.includes('nursing') || titleLower.includes('pharmacy') || titleLower.includes('dental') || groupLower.includes('biological') || groupLower.includes('health')) {
    return 'Cluster 13: Medicine, Nursing & Health';
  }
  if (titleLower.includes('engineering') || titleLower.includes('mechatronic') || titleLower.includes('civil') || titleLower.includes('electrical')) {
    return 'Cluster 7: Engineering & Technology';
  }
  if (titleLower.includes('computer') || titleLower.includes('software') || titleLower.includes('information technology') || titleLower.includes('data science') || groupLower.includes('pure sciences') || groupLower.includes('technical')) {
    return 'Cluster 9: Computing & Information Technology';
  }
  if (titleLower.includes('law') || titleLower.includes('llb') || groupLower.includes('law')) {
    return 'Cluster 1: Law & Legal Studies';
  }
  if (titleLower.includes('education') || titleLower.includes('teaching')) {
    return 'Cluster 19: Education & Teaching';
  }
  if (titleLower.includes('agri') || titleLower.includes('food')) {
    return 'Cluster 15: Agriculture, Environment & Agribusiness';
  }
  if (titleLower.includes('communication') || titleLower.includes('journalism') || titleLower.includes('arts')) {
    return 'Cluster 3: Arts & Humanities';
  }
  return 'Cluster 4: Business & Economics';
}

export type PlacementOddsStatus = 'safe' | 'competitive' | 'reach' | 'unlikely';

export interface PlacementOdds {
  status: PlacementOddsStatus;
  label: string;
  badgeText: string;
  delta: number;
  probabilityPct: number;
}

export function getPlacementOdds(studentScore: number, cutoff: number): PlacementOdds {
  const delta = parseFloat((studentScore - cutoff).toFixed(2));
  if (delta >= 2.0) {
    return {
      status: 'safe',
      label: 'High Placement Chance',
      badgeText: `SAFE (+${delta.toFixed(1)} pts)`,
      delta,
      probabilityPct: Math.min(98, Math.round(85 + delta * 2.5)),
    };
  }
  if (delta >= 0) {
    return {
      status: 'competitive',
      label: 'Competitive Match',
      badgeText: `MATCH (+${delta.toFixed(1)} pts)`,
      delta,
      probabilityPct: Math.round(68 + delta * 8),
    };
  }
  if (delta >= -2.2) {
    return {
      status: 'reach',
      label: 'Ambitious Reach (Revision Candidate)',
      badgeText: `REACH (${delta.toFixed(1)} pts)`,
      delta,
      probabilityPct: Math.max(20, Math.round(48 + delta * 12)),
    };
  }
  return {
    status: 'unlikely',
    label: 'Below Indicative Cutoff',
    badgeText: `${delta.toFixed(1)} pts`,
    delta,
    probabilityPct: 10,
  };
}

/**
 * Curated TVET & University Diploma-to-Degree Bridge Pathways (for C, C-, D+ and TVET seekers)
 */
export const DIPLOMA_PATHWAYS: Course[] = [
  {
    id: 'dip-cs-jkuat',
    title: 'Diploma in Computer Science & Software Development',
    clusterGroup: 'Cluster 9: Computing & Information Technology',
    minPoints: 20.0,
    minMeanGrade: 'C-',
    level: 'Diploma',
    duration: '2 Years (Credit Transfer to Yr 2 Degree)',
    estimatedAnnualCostKes: 67189,
    description: 'Hands-on software engineering, web/mobile development, and networking diploma with direct 2nd-year BSc credit exemption upon distinction/credit.',
    universityIds: ['jkuat', 'strath', 'mku', 'ku'],
    careerOutcomes: ['Junior Full-Stack Developer', 'IT Systems Technician', 'Direct BSc Year 2 Bridge'],
  },
  {
    id: 'dip-nurs-kmtc',
    title: 'Diploma in Kenya Registered Community Health Nursing (KRCHN)',
    clusterGroup: 'Cluster 13: Medicine, Nursing & Health',
    minPoints: 24.0,
    minMeanGrade: 'C',
    level: 'Diploma',
    duration: '3 Years',
    estimatedAnnualCostKes: 82000,
    description: 'High-employability clinical nursing programme offered via KMTC and accredited university health campuses across Kenya.',
    universityIds: ['mku', 'uon', 'ku'],
    careerOutcomes: ['Registered Community Health Nurse', 'Clinical Ward Officer', 'Global Healthcare Placement'],
  },
  {
    id: 'dip-elec-tuk',
    title: 'Diploma in Electrical & Electronic Engineering (KNEC / TVET)',
    clusterGroup: 'Cluster 7: Engineering & Technology',
    minPoints: 19.0,
    minMeanGrade: 'C-',
    level: 'Diploma',
    duration: '3 Years',
    estimatedAnnualCostKes: 67189,
    description: 'Practical engineering training in power installations, industrial PLC automation, solar systems, and telecommunications.',
    universityIds: ['jkuat', 'moi'],
    careerOutcomes: ['Licensed EPRA Electrical Technician', 'Automation Technologist', 'BEng Bridge Candidate'],
  },
  {
    id: 'dip-biz-strath',
    title: 'Diploma in Business Management, FinTech & Entrepreneurship',
    clusterGroup: 'Cluster 4: Business & Economics',
    minPoints: 18.0,
    minMeanGrade: 'C-',
    level: 'Diploma',
    duration: '1.5 – 2 Years',
    estimatedAnnualCostKes: 75000,
    description: 'Fast-track commercial diploma equipping students with accounting, digital marketing, and enterprise management skills.',
    universityIds: ['strath', 'mku', 'usiu', 'ku'],
    careerOutcomes: ['Operations & Accounts Associate', 'SME Founder', 'BCom Year 2 Credit Transfer'],
  },
  {
    id: 'dip-law-mku',
    title: 'Diploma in Law & Paralegal Studies (CLE Accredited)',
    clusterGroup: 'Cluster 1: Law & Legal Studies',
    minPoints: 22.0,
    minMeanGrade: 'C',
    level: 'Diploma',
    duration: '2 Years',
    estimatedAnnualCostKes: 85000,
    description: 'Council of Legal Education accredited diploma providing a direct pathway into the Bachelor of Laws (LLB) degree.',
    universityIds: ['mku', 'strath', 'ku'],
    careerOutcomes: ['Certified Paralegal', 'Court & Conveyancing Clerk', 'LLB Degree Progression'],
  },
  {
    id: 'dip-media-mmu',
    title: 'Diploma in Digital Media, Film Production & Graphic Design',
    clusterGroup: 'Cluster 3: Arts & Humanities',
    minPoints: 18.0,
    minMeanGrade: 'C-',
    level: 'Diploma',
    duration: '2 Years',
    estimatedAnnualCostKes: 67189,
    description: 'Studio-intensive training in broadcast production, UI/UX design, motion graphics, and digital content creation.',
    universityIds: ['uon', 'ku', 'mku', 'pu'],
    careerOutcomes: ['Digital Producer', 'UI/UX & Brand Designer', 'Broadcast Media Specialist'],
  },
];

// ============================================================================
// NEW HIGHER EDUCATION FUNDING MODEL (HEF / MEANS TESTING INSTRUMENT BANDS 1-5)
// ============================================================================

export interface HefInput {
  monthlyIncomeKes: number;
  schoolType: 'public_day' | 'public_boarding' | 'private';
  familyStatus: 'standard' | 'single_parent' | 'orphan_vulnerable';
  siblingsInTertiary: number;
}

export interface HefBandResult {
  band: 1 | 2 | 3 | 4 | 5;
  bandLabel: string;
  tierDescription: string;
  scholarshipPct: number;
  loanPct: number;
  householdPct: number;
  upkeepLoanKes: number;
}

export function calculateHefBand(input: HefInput): HefBandResult {
  // Base band from monthly household income (official Kenyan HEF brackets)
  let rawBand = 3;
  if (input.monthlyIncomeKes <= 5995) {
    rawBand = 1;
  } else if (input.monthlyIncomeKes <= 23670) {
    rawBand = 2;
  } else if (input.monthlyIncomeKes <= 70000) {
    rawBand = 3;
  } else if (input.monthlyIncomeKes <= 120000) {
    rawBand = 4;
  } else {
    rawBand = 5;
  }

  // Means Testing Instrument (MTI) affirmative adjustments
  let modifier = 0;
  if (input.schoolType === 'public_day') modifier -= 0.5;
  if (input.schoolType === 'private') modifier += 0.75;
  if (input.familyStatus === 'orphan_vulnerable') modifier -= 1.0;
  if (input.familyStatus === 'single_parent') modifier -= 0.4;
  if (input.siblingsInTertiary >= 2) modifier -= 0.5;

  const finalBand = Math.min(5, Math.max(1, Math.round(rawBand + modifier))) as 1 | 2 | 3 | 4 | 5;

  const BAND_SPECS: Record<1 | 2 | 3 | 4 | 5, HefBandResult> = {
    1: {
      band: 1,
      bandLabel: 'Band 1 — Maximum Government Support',
      tierDescription: 'Households with monthly income up to KES 5,995 or high vulnerability indicators.',
      scholarshipPct: 70,
      loanPct: 25,
      householdPct: 5,
      upkeepLoanKes: 60000,
    },
    2: {
      band: 2,
      bandLabel: 'Band 2 — High Affirmative Support',
      tierDescription: 'Low-income households earning up to KES 23,670/month.',
      scholarshipPct: 60,
      loanPct: 30,
      householdPct: 10,
      upkeepLoanKes: 55000,
    },
    3: {
      band: 3,
      bandLabel: 'Band 3 — Balanced Shared Funding',
      tierDescription: 'Lower-middle income households earning KES 23,671 – 70,000/month.',
      scholarshipPct: 50,
      loanPct: 30,
      householdPct: 20,
      upkeepLoanKes: 50000,
    },
    4: {
      band: 4,
      bandLabel: 'Band 4 — Moderate Loan & Scholarship',
      tierDescription: 'Middle-income households earning KES 70,001 – 120,000/month.',
      scholarshipPct: 40,
      loanPct: 30,
      householdPct: 30,
      upkeepLoanKes: 45000,
    },
    5: {
      band: 5,
      bandLabel: 'Band 5 — Standard Cost-Sharing Tier',
      tierDescription: 'Households with monthly income above KES 120,000.',
      scholarshipPct: 30,
      loanPct: 30,
      householdPct: 40,
      upkeepLoanKes: 40000,
    },
  };

  return BAND_SPECS[finalBand];
}

export function estimateCourseAnnualCostKes(course: Course): number {
  if (course.estimatedAnnualCostKes && course.estimatedAnnualCostKes > 0) {
    return course.estimatedAnnualCostKes;
  }
  if (course.level === 'Diploma' || course.level === 'Certificate') {
    return 67189; // Official TVET annual cap
  }
  const cluster = normalizeClusterName(course.clusterGroup, course.title);
  if (cluster.includes('Cluster 13')) return 384000;
  if (cluster.includes('Cluster 7')) return 306000;
  if (cluster.includes('Cluster 9')) return 244000;
  if (cluster.includes('Cluster 1:')) return 224000;
  if (cluster.includes('Cluster 15')) return 192000;
  return 164000;
}

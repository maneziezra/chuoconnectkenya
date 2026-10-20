import { coursesData } from './courses';
import { DIPLOMA_PATHWAYS } from '../utils/kuccps';
import type { Course } from '../types';

export interface GradeGuide {
  slug: string;
  gradeLabel: string;
  gradesIncluded: string[];
  aggregateRange: string;
  typicalClusterRange: string;
  minClusterCutoff: number;
  maxClusterCutoff: number;
  isDegreeEligible: boolean;
  headline: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  strategyAdvice: string[];
  hefFundingNote: string;
  faqs: { question: string; answer: string }[];
}

export const GRADE_GUIDES: GradeGuide[] = [
  {
    slug: 'a',
    gradeLabel: 'A & A-',
    gradesIncluded: ['A', 'A-'],
    aggregateRange: '74 – 84 / 84 pts',
    typicalClusterRange: '40.0 – 47.5 / 48 pts',
    minClusterCutoff: 38.0,
    maxClusterCutoff: 48.0,
    isDegreeEligible: true,
    headline: 'Best KUCCPS Degree Courses for KCSE Mean Grade A & A- in Kenya',
    metaTitle: 'Courses for KCSE Grade A & A- in Kenya (2026 KUCCPS Cutoffs) | Chuo Connect',
    metaDescription:
      'Scored an A or A- in KCSE? Compare top Medicine, Dental Surgery, Pharmacy, Law, Software Engineering & Actuarial Science programmes, 2026 KUCCPS cutoffs, and HEF Band scholarships.',
    summary:
      'With an A (81–84 pts) or A- (74–80 pts), you qualify for Kenya’s most competitive Cluster 1, 2, 3, and 4 degree programmes across UoN, JKUAT, KU, Strathmore, and Moi University.',
    strategyAdvice: [
      'Use Choice 1a, 1b, and 1c for high-cutoff flagship programmes (e.g., Medicine & Surgery, Pharmacy, Law, or BSc Computer Science at UoN/JKUAT).',
      'Always keep Choice 3 or Choice 4 at least 2.0 cluster points below your weighted cluster score so you never go unplaced in the first revision.',
      'Apply early for merit and institutional financial aid (Strathmore Financial Aid, MasterCard Foundation, Equity Leaders Programme).',
    ],
    hefFundingNote:
      'Under the Higher Education Funding (HEF) model, high-cost clinical and engineering programmes (KES 300k–612k/yr) receive up to 70% Government Scholarship in Band 1 plus HELB tuition & upkeep loans.',
    faqs: [
      {
        question: 'Can I miss out on Medicine or Computer Science with an A-?',
        answer:
          'Yes, if your 4 cluster subjects (e.g. Biology, Chemistry, Maths/Physics, English) yield a weighted cluster score slightly below the campus cutoff (often 43.0–45.5 at UoN). Always include a second and third campus in 1b and 1c.',
      },
      {
        question: 'How is my weighted cluster score calculated with an A or A-?',
        answer:
          'KUCCPS uses w = sqrt((c / 48) * (p / 84)) * 48, where c is your 4-subject cluster total (/48) and p is your 7-subject KCSE aggregate (/84).',
      },
    ],
  },
  {
    slug: 'b-plus',
    gradeLabel: 'B+',
    gradesIncluded: ['B+'],
    aggregateRange: '67 – 73 / 84 pts',
    typicalClusterRange: '35.5 – 42.0 / 48 pts',
    minClusterCutoff: 34.0,
    maxClusterCutoff: 42.5,
    isDegreeEligible: true,
    headline: 'Best KUCCPS Degree Courses for KCSE Mean Grade B+ in Kenya',
    metaTitle: 'Courses for KCSE Grade B+ in Kenya (KUCCPS Cutoffs & Universities) | Chuo Connect',
    metaDescription:
      'Explore the best marketable degree courses in Kenya for KCSE Mean Grade B+ (67–73 points), including Nursing, Engineering, Computer Science, Architecture, Law & Finance.',
    summary:
      'A KCSE Mean Grade of B+ (67–73 aggregate points) places you in a strong position for Engineering, Nursing, Computer Science, Actuarial Science, Law, and Economics across public and chartered private universities.',
    strategyAdvice: [
      'Compare cutoffs across campuses: a programme that requires 42.5 at UoN may have a 36.5–38.5 cutoff at JKUAT, KU, Egerton, Multimedia, or Dedan Kimathi University (DeKUT).',
      'Check individual subject minimums (e.g., C+ or B in Mathematics and Physics for Engineering & Computing).',
      'Simulate your HEF Band 1–5 household contribution before locking in high-tuition clinical or engineering choices.',
    ],
    hefFundingNote:
      'B+ students placed via KUCCPS are eligible for both Government Scholarships (30%–70% depending on household means testing) and HELB Tuition + Upkeep Loans (KES 40,000–60,000/yr).',
    faqs: [
      {
        question: 'Which engineering and tech courses can I do with a B+?',
        answer:
          'With strong Mathematics, Physics, and Chemistry grades, B+ candidates regularly qualify for Civil, Electrical, Mechanical, and Software Engineering, BSc Computer Science, and Data Science.',
      },
      {
        question: 'Can I study Law or Nursing with a B+?',
        answer:
          'Yes! Provided you meet the English/Kiswahili minimum for Law (usually B plain) or Biology/Chemistry minimum for BSc Nursing, several public and private universities have cutoffs between 36.5 and 40.5.',
      },
    ],
  },
  {
    slug: 'b',
    gradeLabel: 'B & B-',
    gradesIncluded: ['B', 'B-'],
    aggregateRange: '53 – 66 / 84 pts',
    typicalClusterRange: '30.0 – 37.5 / 48 pts',
    minClusterCutoff: 28.0,
    maxClusterCutoff: 38.0,
    isDegreeEligible: true,
    headline: 'Marketable KUCCPS Degree Courses for KCSE Mean Grade B & B- in Kenya',
    metaTitle: 'Courses for KCSE Grade B & B- in Kenya (2026 KUCCPS Guide) | Chuo Connect',
    metaDescription:
      'Discover top degree courses for KCSE Grade B plain and B- (Minus) in Kenya: IT, Business, Education, Clinical Medicine, Quantity Surveying, and Media.',
    summary:
      'KCSE Mean Grades B (60–66 pts) and B- (53–59 pts) unlock hundreds of high-employability degree programmes in Computing & IT, Commerce, Education, Clinical Health Sciences, Agriculture, and Media.',
    strategyAdvice: [
      'Focus on specialized applied degrees such as BSc Information Technology, BBIT, Bachelor of Education (Science/Arts), BCom, Environmental Health, and Agribusiness.',
      'Consider chartered private universities (KCA, Mount Kenya University, Zetech, USIU, Daystar, Africa Nazarene) where you are eligible for HELB loans and fast-tracked intakes.',
      'Balance your KUCCPS basket: place ambitious 35–37 pt courses in 1a–1c and secure 28–33 pt courses in Choices 2, 3, and 4.',
    ],
    hefFundingNote:
      'Students with B or B- placed in public universities receive full HEF Band 1–5 Scholarship + HELB Loan support; those joining chartered private universities qualify for HELB Tuition & Upkeep Loans.',
    faqs: [
      {
        question: 'What are the most marketable courses for a B- in KCSE?',
        answer:
          'BSc Information Technology, Bachelor of Business Information Technology (BBIT), Bachelor of Education (Science or Arts), Bachelor of Commerce (Finance/Accounting), and BSc Public/Environmental Health have strong job absorption.',
      },
      {
        question: 'Can I still pursue Medicine or Clinical Sciences with a B or B-?',
        answer:
          'You can pursue BSc Environmental Health, BSc Medical Laboratory Sciences (at select campuses), or KMTC/University Diploma in Clinical Medicine & Surgery with credit transfer options.',
      },
    ],
  },
  {
    slug: 'c-plus',
    gradeLabel: 'C+',
    gradesIncluded: ['C+'],
    aggregateRange: '46 – 52 / 84 pts',
    typicalClusterRange: '24.0 – 33.0 / 48 pts',
    minClusterCutoff: 22.0,
    maxClusterCutoff: 34.5,
    isDegreeEligible: true,
    headline: 'Best Degree Courses for KCSE Mean Grade C+ (Plus) in Kenya',
    metaTitle: 'Courses for KCSE Grade C+ in Kenya (Direct Degree Entry 2026) | Chuo Connect',
    metaDescription:
      'Scored a C+ in KCSE? C+ is the official minimum university degree entry grade in Kenya. Explore qualifying Bachelor degrees in IT, Business, Education, Criminology & Hospitality.',
    summary:
      'Congratulations! A KCSE Mean Grade of C+ (46–52 aggregate points) meets the statutory Commission for University Education (CUE) cutoff for direct Bachelor’s degree entry at all Kenyan public and private universities.',
    strategyAdvice: [
      'Because C+ is the entry threshold for degree programmes, competition is high for low-cutoff courses—target programmes with indicative cutoffs between 24.0 and 32.0 points.',
      'Check subject cluster weights carefully: if you scored a B or B+ in Mathematics or English, your weighted cluster score in Computing, Business, or Arts will be significantly higher than your mean grade.',
      'Include direct-entry degree programmes at universities like KCA, MKU, Zetech, Masinde Muliro (MMUST), Kisii, Chuka, and Pwani University for near-guaranteed placement.',
    ],
    hefFundingNote:
      'All C+ candidates placed by KUCCPS in public universities receive the same HEF Band 1–5 Government Scholarship + HELB Loan package as A-grade students.',
    faqs: [
      {
        question: 'Does a C+ guarantee KUCCPS degree placement?',
        answer:
          'Every C+ student is eligible for a degree, provided you select at least one course whose cluster cutoff is at or below your weighted cluster score—or apply directly to a chartered private university.',
      },
      {
        question: 'Can I do Computer Science or IT with a C+?',
        answer:
          'Yes! While BSc Computer Science at UoN/JKUAT has a high cutoff, BSc Information Technology (IT) and Bachelor of Business Information Technology (BBIT) are open to C+ candidates with C+ in Mathematics.',
      },
    ],
  },
  {
    slug: 'c',
    gradeLabel: 'C (Plain)',
    gradesIncluded: ['C'],
    aggregateRange: '39 – 45 / 84 pts',
    typicalClusterRange: 'Diploma & TVET Direct Entry',
    minClusterCutoff: 0,
    maxClusterCutoff: 0,
    isDegreeEligible: false,
    headline: 'Best Diploma-to-Degree Courses for KCSE Mean Grade C (Plain) in Kenya',
    metaTitle: 'Courses for KCSE Grade C Plain in Kenya (Diploma & KMTC Guide) | Chuo Connect',
    metaDescription:
      'Scored a C plain in KCSE? Discover top KMTC, TVET, and University Diploma programmes in Clinical Medicine, Nursing, Software Engineering & Business with 2nd-year degree credit transfer.',
    summary:
      'With a KCSE Mean Grade of C plain (39–45 points), you qualify for premier KMTC medical diplomas, Technical University (TUK/TUM) engineering diplomas, and University Bridge Diplomas that grant credit exemptions into 2nd Year of a Bachelor’s degree.',
    strategyAdvice: [
      'A 2-year University Diploma at JKUAT, KCA, MKU, Zetech, or TUK allows you to transition into Year 2 of a Bachelor’s degree—meaning you graduate in nearly the same total timeframe.',
      'If you have C plain in Biology and Chemistry, KMTC and MKU Health Diplomas (Clinical Medicine, Registered Nursing, Pharmaceutical Technology) offer some of the highest graduate employment rates in Kenya.',
      'Apply both on the KUCCPS TVET portal and directly to university diploma intakes (January, May, or September) to start immediately.',
    ],
    hefFundingNote:
      'Under the TVET & University Diploma HEF framework (capped at KES 67,189/yr in public TVETs), students qualify for Government capitation scholarships and HELB TVET loans.',
    faqs: [
      {
        question: 'Can I join a university with a C plain in KCSE?',
        answer:
          'Yes! Both public universities (JKUAT, TUK, KU, Moi) and private universities (KCA, Zetech, MKU, USIU) offer CUE-accredited Diploma programmes on their main campuses with direct progression to a Bachelor’s degree.',
      },
      {
        question: 'Which KMTC courses accept a C plain?',
        answer:
          'KMTC’s flagship Diploma in Clinical Medicine & Surgery, Diploma in Kenya Registered Community Health Nursing, and Diploma in Pharmacy require a minimum Mean Grade of C plain.',
      },
    ],
  },
  {
    slug: 'c-minus',
    gradeLabel: 'C- (Minus)',
    gradesIncluded: ['C-'],
    aggregateRange: '32 – 38 / 84 pts',
    typicalClusterRange: 'Accredited Diploma & TVET Entry',
    minClusterCutoff: 0,
    maxClusterCutoff: 0,
    isDegreeEligible: false,
    headline: 'Top Accredited Diploma & TVET Courses for KCSE Mean Grade C- in Kenya',
    metaTitle: 'Courses for KCSE Grade C- (Minus) in Kenya (2026 Diploma Guide) | Chuo Connect',
    metaDescription:
      'Explore marketable Diploma and TVET courses in Kenya for KCSE Mean Grade C- (Minus): IT, Software Development, Business Management, Electrical Engineering, and Nutrition.',
    summary:
      'A KCSE Mean Grade of C- (32–38 points) meets the official minimum entry requirement for KNEC, TVET CDACC, and University Senate-approved Diploma programmes across Kenya.',
    strategyAdvice: [
      'Choose skills-first diplomas in Software Development, Computer Networking, Accounting/Finance, Supply Chain, or Electrical & Civil Engineering.',
      'Upon completing your 2-year Diploma with a Credit or Distinction, you qualify for direct admission into a Bachelor’s degree programme (often with 1st-year credit transfer).',
      'Request admission & fee structures directly from partner campuses below to secure September/January intake slots.',
    ],
    hefFundingNote:
      'C- Diploma candidates placed in public TVET and National Polytechnic institutions receive HEF TVET scholarships and HELB loans covering tuition and upkeep.',
    faqs: [
      {
        question: 'Is C- eligible for a Diploma in Kenyan universities?',
        answer:
          'Yes. The standard minimum entry requirement for most University and TVET Diplomas in IT, Business, Hospitality, Media, and Engineering is KCSE Mean Grade C- (Minus).',
      },
      {
        question: 'Can I eventually get a Bachelor’s degree starting from C-?',
        answer:
          'Absolutely. Completing an accredited Diploma with at least a Credit pass satisfies CUE university degree entry requirements.',
      },
    ],
  },
  {
    slug: 'd-plus',
    gradeLabel: 'D+ & D',
    gradesIncluded: ['D+', 'D'],
    aggregateRange: '18 – 31 / 84 pts',
    typicalClusterRange: 'Craft Certificate & Artisan Progression',
    minClusterCutoff: 0,
    maxClusterCutoff: 0,
    isDegreeEligible: false,
    headline: 'Best TVET, Certificate & Diploma Bridge Courses for KCSE Grade D+ & D in Kenya',
    metaTitle: 'Courses for KCSE Grade D+ & D in Kenya (TVET & Certificate Pathways) | Chuo Connect',
    metaDescription:
      'Scored a D+ or D plain in KCSE? Discover accredited Certificate-to-Diploma-to-Degree pathways in ICT, Engineering, Healthcare, Plumbing, Automotive & Business in Kenya.',
    summary:
      'Kenya’s Competency-Based Education and Training (CBET) and TVET progression framework ensures that a D+ or D in KCSE is a stepping stone—not a dead end. Start with a 1-year Craft Certificate to unlock Diploma and Degree progression.',
    strategyAdvice: [
      'Enrol in a 1-year Craft Certificate (Level 5) in ICT, Business, Electrical Installation, Automotive Engineering, or Community Health.',
      'Once you pass your Certificate, you automatically qualify to join a 2-year Diploma—even without retaking KCSE.',
      'Hands-on technical certificates (Electrical, Solar PV, Plumbing, Software & Networking, Culinary Arts) have some of the fastest self-employment and industry placement rates in Kenya.',
    ],
    hefFundingNote:
      'All students placed by KUCCPS into National Polytechnics and Vocational Training Centres (TVETs) with D+ or D plain are eligible for Government TVET capitation and HELB TVET funding.',
    faqs: [
      {
        question: 'Can I progress from a D+ Certificate to a Diploma and Degree?',
        answer:
          'Yes! Under Kenya Qualifications Framework (KNQF), completing a Level 5 Certificate qualifies you for a Level 6 Diploma, which in turn qualifies you for a Level 7 Bachelor’s Degree.',
      },
      {
        question: 'Does HELB fund Certificate courses for D+ and D students?',
        answer:
          'Yes, students placed in accredited TVET institutions and National Polytechnics receive HEF/HELB TVET scholarships and loans.',
      },
    ],
  },
];

export function getGradeGuideBySlug(slug: string): GradeGuide | undefined {
  return GRADE_GUIDES.find(g => g.slug === slug.toLowerCase());
}

export function getCoursesForGradeGuide(guide: GradeGuide): {
  degreeCourses: Course[];
  diplomaCourses: Course[];
} {
  if (guide.isDegreeEligible) {
    const degreeCourses = coursesData
      .filter(
        c =>
          c.level === 'Degree' &&
          c.minPoints >= guide.minClusterCutoff &&
          c.minPoints <= guide.maxClusterCutoff + 1.5
      )
      .sort((a, b) => b.minPoints - a.minPoints);

    return {
      degreeCourses: degreeCourses.length > 0 ? degreeCourses : coursesData.slice(0, 8),
      diplomaCourses: DIPLOMA_PATHWAYS.slice(0, 4),
    };
  }

  return {
    degreeCourses: [],
    diplomaCourses: DIPLOMA_PATHWAYS,
  };
}

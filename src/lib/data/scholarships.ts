import type { Scholarship } from '@/lib/types';

export interface EnrichedScholarship extends Scholarship {
  partnerUniversityId?: string;
  partnerUniversityName?: string;
  createdAt?: string;
}

export const FALLBACK_SCHOLARSHIPS: EnrichedScholarship[] = [
  {
    id: 'sch-hef-gov',
    title: 'Higher Education Funding (HEF) Band 1–5 Government Scholarship',
    provider: 'Universities Fund Kenya (Ministry of Education)',
    amount: '30% – 70% of Annual Tuition (Free Government Grant)',
    deadline: '2026-09-30',
    eligibility: 'Kenyan KCSE candidates placed via KUCCPS into accredited public universities.',
    description:
      'Under Kenya’s Student-Centred Funding Model, every student placed by KUCCPS into a public university is means-tested into Band 1–5 and awarded a non-repayable Government Scholarship covering 30% to 70% of programme tuition.',
    applicationUrl: 'https://www.hef.co.ke',
    category: 'government',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'sch-helb-loan',
    title: 'HELB Undergraduate & TVET Tuition + Upkeep Loan',
    provider: 'Higher Education Loans Board (HELB)',
    amount: '25% – 30% Tuition + KES 40,000 – 60,000/yr Upkeep Stipend',
    deadline: '2026-10-15',
    eligibility: 'Kenyan citizens enrolled in CUE-accredited public or chartered private universities and TVET institutions.',
    description:
      'Provides low-interest tuition loans paid directly to your university plus an annual upkeep stipend (KES 40,000–60,000) disbursed to your mobile wallet or bank account for accommodation and meals.',
    applicationUrl: 'https://www.helb.co.ke',
    category: 'government',
    createdAt: '2026-01-14T00:00:00Z',
  },
  {
    id: 'sch-mastercard-usiu',
    title: 'Mastercard Foundation Scholars Program at USIU-Africa',
    provider: 'Mastercard Foundation & USIU-Africa',
    amount: '100% Full Scholarship (Tuition, Accommodation, Laptop & Monthly Stipend)',
    deadline: '2026-07-31',
    eligibility: 'Academically talented youth (Mean Grade B+ and above) facing socioeconomic barriers, young women, refugees, and youth with disabilities.',
    description:
      'Covers full undergraduate tuition at USIU-Africa, on-campus medical insurance, housing, textbooks, laptop, leadership mentorship, and career transition support.',
    applicationUrl: 'https://www.usiu.ac.ke/mcf-scholars/',
    category: 'international',
    partnerUniversityId: 'usiu',
    partnerUniversityName: 'USIU-Africa',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'sch-strathmore-aid',
    title: 'Strathmore University Merit & Financial Aid Scholarship',
    provider: 'Strathmore University Financial Aid Office',
    amount: 'Up to 80% Tuition Waiver + Integrated Work-Study',
    deadline: '2026-06-30',
    eligibility: 'KCSE Mean Grade A or A- with demonstrated financial need and strong leadership record.',
    description:
      'Combines partial scholarship grants with low-interest educational financing and campus work-study placements for high-achieving students joining Strathmore Business School, Computing, Law, or Actuarial programmes.',
    applicationUrl: 'https://strathmore.edu/financial-aid/',
    category: 'institutional',
    partnerUniversityId: 'strath',
    partnerUniversityName: 'Strathmore University',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'sch-equity-leaders',
    title: 'Equity Leaders Programme (ELP) & Wings to Fly University Fund',
    provider: 'Equity Group Foundation',
    amount: 'Paid Pre-University Internship + University Stipend & Global Coaching',
    deadline: '2026-05-31',
    eligibility: 'Top-performing boy and girl in every sub-county (or KCSE Mean Grade A plain across Kenya).',
    description:
      'Admits top KCSE graduates into a paid 6-month Equity Bank internship, leadership bootcamps, university scholarship stipends, and mentorship for local and Ivy League admissions.',
    applicationUrl: 'https://equitygroupfoundation.com/equity-leaders-program/',
    category: 'private',
    createdAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 'sch-safaricom-stem',
    title: 'Safaricom Foundation Technology & TVET Scholarship',
    provider: 'Safaricom & M-PESA Foundation',
    amount: 'Full Tuition + Practical Industry Attachment',
    deadline: '2026-08-31',
    eligibility: 'Kenyan youth pursuing STEM, ICT, Electrical, or TVET Technical Diplomas and Degrees from needy households.',
    description:
      'Supports STEM and TVET scholars across accredited Kenyan universities and national polytechnics, paired with Women in Tech and digital skills mentorship.',
    applicationUrl: 'https://www.safaricomfoundation.org',
    category: 'private',
    createdAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 'sch-mku-vc',
    title: 'Mount Kenya University (MKU) Vice-Chancellor’s Scholarship',
    provider: 'Mount Kenya University Foundation',
    amount: '50% – 100% Tuition Fee Waiver',
    deadline: '2026-08-15',
    eligibility: 'Bright, needy students admitted to MKU Degree or Diploma programmes, plus sports and creative talent scholars.',
    description:
      'Annual institutional scholarship fund awarded to academically gifted, underprivileged, and talented students enrolling across MKU campuses nationwide.',
    applicationUrl: 'https://www.mku.ac.ke',
    category: 'institutional',
    partnerUniversityId: 'mku',
    partnerUniversityName: 'Mount Kenya University',
    createdAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 'sch-zetech-innovation',
    title: 'Zetech University Tech Innovation & Talent Scholarship',
    provider: 'Zetech University Directorate of Student Affairs',
    amount: 'Partial Tuition Rebate (Up to KES 40,000/yr)',
    deadline: '2026-09-01',
    eligibility: 'Students enrolling in BSc Software Engineering, BSc IT, BBIT, or Diploma Bridge programmes at Zetech.',
    description:
      'Rewards early-bird tech innovators, Hackathon winners, and student athletes joining Zetech University’s Ruiru and Mang’u campuses.',
    applicationUrl: 'https://www.zetech.ac.ke',
    category: 'institutional',
    partnerUniversityId: 'zetech',
    partnerUniversityName: 'Zetech University',
    createdAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 'sch-rattansi',
    title: 'Rattansi Educational Trust University Bursary',
    provider: 'Rattansi Educational Trust',
    amount: 'KES 15,000 – 40,000 Annual Tuition Bursary',
    deadline: '2026-10-30',
    eligibility: 'Needy undergraduate and diploma students enrolled in public and chartered private Kenyan universities.',
    description:
      'Administered through university Deans of Students offices across Kenya to offset household fee balances for vulnerable students.',
    applicationUrl: 'https://uonbi.ac.ke',
    category: 'private',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'sch-ngcdf-county',
    title: 'NG-CDF & 47 County Governments Higher Education Bursary',
    provider: 'National Government Constituencies Development Fund & County Governments',
    amount: 'KES 10,000 – 50,000 per Academic Year',
    deadline: '2026-11-15',
    eligibility: 'Registered residents of any of Kenya’s 290 constituencies and 47 counties with an official university admission letter.',
    description:
      'Direct constituency and ward-level bursary cheques payable to your university or TVET institution to cover the Household Contribution portion of HEF Band 1–5 fees.',
    applicationUrl: 'https://ngcdf.go.ke',
    category: 'government',
    createdAt: '2026-01-04T00:00:00Z',
  },
];

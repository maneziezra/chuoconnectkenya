import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Scholarship, Housing, Event } from '@/lib/types';

// The data currently hardcoded in the frontend
const MOCK_SCHOLARSHIPS: Partial<Scholarship>[] = [
  {
    title: 'Higher Education Loans Board (HELB)', provider: 'Government of Kenya',
    amount: 'KES 50,000 – 60,000 per year', deadline: '2025-09-30',
    eligibility: 'Kenyan citizen, admitted to accredited institution, financially needy',
    description: 'Government-backed student loan and bursary programme for undergraduate students.',
    applicationUrl: 'https://www.helb.co.ke', category: 'government',
  },
  {
    title: 'Equity Leaders Programme', provider: 'Equity Bank Foundation',
    amount: 'Full scholarship (tuition + stipend)', deadline: '2025-07-15',
    eligibility: 'Top KCSE performer, demonstrated leadership, financial need',
    description: 'Wings to Fly scholarship for exceptional students from disadvantaged backgrounds.',
    applicationUrl: 'https://www.equitygroupfoundation.com', category: 'private',
  },
  {
    title: 'Kenya Government Bursary', provider: 'Ministry of Education',
    amount: 'KES 5,000 – 25,000 per year', deadline: '2025-08-31',
    eligibility: 'County-based selection, financial need, KCSE results',
    description: 'Bursary programme administered through county governments to support needy students.',
    applicationUrl: 'https://www.education.go.ke', category: 'government',
  },
  {
    title: 'MasterCard Foundation Scholars Program', provider: 'MasterCard Foundation',
    amount: 'Full scholarship', deadline: '2025-06-30',
    eligibility: 'Academically talented, economically disadvantaged youth',
    description: 'Transformative scholarship enabling access to quality education for bright African students.',
    applicationUrl: 'https://mastercardfdn.org', category: 'international',
  },
  {
    title: 'Safaricom Foundation Scholarship', provider: 'Safaricom Foundation',
    amount: 'KES 100,000 per year', deadline: '2025-10-15',
    eligibility: 'Kenyan citizen, STEM courses, financial need',
    description: 'Supporting technology and innovation-focused students in accredited Kenyan universities.',
    category: 'private',
  },
  {
    title: 'African Union Scholarship', provider: 'African Union Commission',
    amount: 'Full scholarship + monthly stipend', deadline: '2025-05-31',
    eligibility: 'African citizenship, postgraduate programmes',
    description: 'Scholarship for postgraduate studies in priority areas including science, technology, and governance.',
    applicationUrl: 'https://au.int', category: 'international',
  },
];

const MOCK_HOUSING: Partial<Housing>[] = [
  {
    name: 'Campus View Hostels', type: 'hostel', location: 'Ngong Road, off University Way',
    county: 'Nairobi', price: 'KES 8,000 – 15,000/month',
    amenities: ['Wi-Fi', 'Water 24/7', 'Security', 'Study Room', 'Laundry'],
    contactPhone: '+254 700 100 200', available: true,
  },
  {
    name: 'Scholars Lodge', type: 'bedsitter', location: 'Kilimani, Nairobi',
    county: 'Nairobi', price: 'KES 12,000/month',
    amenities: ['Self-contained', 'Kitchen', 'Wi-Fi', 'Security'],
    contactPhone: '+254 712 345 678', available: true,
  },
  {
    name: 'Unity Student Homes', type: 'shared', location: 'Tom Mboya Street',
    county: 'Nairobi', price: 'KES 5,000 – 7,000/month',
    amenities: ['Wi-Fi', 'Meals available', 'Security', 'CCTV'],
    contactPhone: '+254 722 111 222', available: true,
  },
  {
    name: 'Moi University Student Hostel', type: 'hostel', location: 'Eldoret Town',
    county: 'Uasin Gishu', price: 'KES 6,000/month',
    amenities: ['Study Hall', 'Water', 'Security', 'Near Campus'],
    contactPhone: '+254 730 000 001', available: true,
  },
  {
    name: 'Coast Haven', type: 'apartment', location: 'Tudor, Mombasa',
    county: 'Mombasa', price: 'KES 14,000/month',
    amenities: ['Furnished', 'Wi-Fi', 'Parking', 'Security', 'Gym'],
    contactEmail: 'coasthaven@mail.com', available: true,
  },
  {
    name: 'Western Student Lodge', type: 'hostel', location: 'Maseno Town',
    county: 'Kisumu', price: 'KES 4,500/month',
    amenities: ['Wi-Fi', 'Common Kitchen', 'Security'],
    contactPhone: '+254 740 500 600', available: false,
  },
];

const MOCK_EVENTS: Partial<Event>[] = [
  {
    universityName: 'University of Nairobi',
    title: 'UoN Open Day 2025', category: 'admission',
    description: 'Explore the University of Nairobi campus, meet faculty, learn about programmes, and get your questions answered by admissions team.',
    date: '2025-08-15T09:00:00Z', location: 'Main Campus, Nairobi', isFeatured: true,
  },
  {
    universityName: 'Kenyatta University',
    title: 'National Career Fair 2025', category: 'career',
    description: 'Connect with over 150 employers, attend panel sessions with industry leaders, and explore internship and job opportunities.',
    date: '2025-08-22T08:00:00Z', endDate: '2025-08-23T17:00:00Z', location: 'KU Stadium',
  },
  {
    universityName: 'Strathmore University',
    title: 'Tech Innovation Summit', category: 'academic',
    description: 'Annual technology summit featuring startups, hackathon challenges, and keynote speakers from Kenya\'s tech ecosystem.',
    date: '2025-09-05T10:00:00Z', location: 'Strathmore @iHub',
  },
  {
    universityName: 'Moi University',
    title: 'Cultural Week 2025', category: 'cultural',
    description: 'A celebration of Kenya\'s diverse culture through music, dance, drama, and food exhibitions from all 47 counties.',
    date: '2025-09-12T09:00:00Z', endDate: '2025-09-16T18:00:00Z', location: 'Moi University, Eldoret',
  },
  {
    universityName: 'USIU-Africa',
    title: 'International Students Day', category: 'social',
    description: 'Celebrate diversity with students from over 60 countries. Cultural exhibitions, performances, and networking.',
    date: '2025-09-20T14:00:00Z', location: 'USIU Campus, Nairobi',
  },
  {
    universityName: 'Egerton University',
    title: 'Agricultural Innovation Expo', category: 'academic',
    description: 'Showcasing cutting-edge agricultural research, innovations, and business opportunities in Kenya\'s food sector.',
    date: '2025-10-03T08:00:00Z', location: 'Egerton University, Nakuru',
  },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Seed Scholarships
    const { error: err1 } = await supabase.from('scholarships').insert(MOCK_SCHOLARSHIPS);
    if (err1) console.error('Failed to seed scholarships', err1);

    // 2. Seed Housing
    const { error: err2 } = await supabase.from('housing').insert(MOCK_HOUSING);
    if (err2) console.error('Failed to seed housing', err2);

    // 3. Seed Events
    const { error: err3 } = await supabase.from('events').insert(MOCK_EVENTS);
    if (err3) console.error('Failed to seed events', err3);

    return NextResponse.json({ success: true, message: 'Database seeded successfully. Make sure the schema was applied first.' });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

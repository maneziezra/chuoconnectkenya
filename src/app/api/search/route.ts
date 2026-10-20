import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { universitiesData } from '@/lib/data/universities';
import { coursesData } from '@/lib/data/courses';
import { GRADE_GUIDES } from '@/lib/data/gradeGuides';
import { FALLBACK_SCHOLARSHIPS } from '@/lib/data/scholarships';

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? '';
  const q = rawQuery.trim().toLowerCase();
  if (!q) return NextResponse.json([]);

  let dbUnis: { id: string; name: string; abbrev?: string; county: string; type: string }[] = [];
  let dbCourses: { id: string; title: string; clusterGroup: string }[] = [];

  try {
    const supabase = await createClient();
    const term = `%${rawQuery.trim()}%`;
    const [uniRes, courseRes] = await Promise.all([
      supabase
        .from('universities')
        .select('id, name, abbrev, county, type')
        .or(`name.ilike.${term},abbrev.ilike.${term},county.ilike.${term}`)
        .limit(5),
      supabase
        .from('courses')
        .select('id, title, clusterGroup')
        .ilike('title', term)
        .limit(5),
    ]);
    dbUnis = uniRes.data ?? [];
    dbCourses = courseRes.data ?? [];
  } catch {
    // Gracefully fall back to local data if Supabase fails
  }

  // Merge with local universitiesData
  const seenUniIds = new Set(dbUnis.map(u => u.id));
  const localUniMatches = universitiesData
    .filter(
      u =>
        !seenUniIds.has(u.id) &&
        (u.name.toLowerCase().includes(q) ||
          u.abbrev.toLowerCase().includes(q) ||
          u.county.toLowerCase().includes(q))
    )
    .slice(0, 5);

  const combinedUnis = [...dbUnis, ...localUniMatches].slice(0, 5);

  // Merge with local coursesData
  const seenCourseIds = new Set(dbCourses.map(c => c.id));
  const localCourseMatches = coursesData
    .filter(
      c =>
        !seenCourseIds.has(c.id) &&
        (c.title.toLowerCase().includes(q) ||
          c.clusterGroup.toLowerCase().includes(q) ||
          (c.careerOutcomes ?? []).some((car: string) => car.toLowerCase().includes(q)))
    )
    .slice(0, 5);

  const combinedCourses = [...dbCourses, ...localCourseMatches].slice(0, 5);

  // Match KCSE Grade Guides (e.g. "C+", "B+", "grade c", "diploma")
  const gradeMatches = GRADE_GUIDES.filter(
    g =>
      g.gradeLabel.toLowerCase().includes(q) ||
      g.gradesIncluded.some(gr => gr.toLowerCase() === q || `grade ${gr.toLowerCase()}` === q) ||
      g.slug.toLowerCase() === q ||
      g.headline.toLowerCase().includes(q)
  ).slice(0, 2);

  // Match Scholarships & Funding
  const scholarshipMatches = FALLBACK_SCHOLARSHIPS.filter(
    s =>
      s.title.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  ).slice(0, 2);

  const results: {
    type: 'university' | 'course' | 'county' | 'grade' | 'scholarship';
    id: string;
    label: string;
    sub?: string;
  }[] = [
    ...gradeMatches.map(g => ({
      type: 'grade' as const,
      id: g.slug,
      label: `KCSE Mean Grade ${g.gradeLabel} Guide`,
      sub: `${g.aggregateRange} · ${g.isDegreeEligible ? 'Direct Degree Entry' : 'Diploma & TVET Bridge'}`,
    })),
    ...combinedUnis.map(u => ({
      type: 'university' as const,
      id: u.id,
      label: u.name,
      sub: `${u.county} County · ${u.type}`,
    })),
    ...combinedCourses.map(c => ({
      type: 'course' as const,
      id: c.id,
      label: c.title,
      sub: c.clusterGroup,
    })),
    ...scholarshipMatches.map(s => ({
      type: 'scholarship' as const,
      id: s.id,
      label: s.title,
      sub: `${s.provider} · ${s.amount}`,
    })),
  ];

  // Add county suggestion if query matches a county name
  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu',
    'Nyeri', 'Machakos', 'Kilifi', 'Kakamega', 'Kisii', 'Meru', 'Garissa',
  ];
  const matchedCounty = counties.find(c => c.toLowerCase().includes(q));
  if (matchedCounty) {
    results.push({
      type: 'county' as const,
      id: matchedCounty,
      label: matchedCounty,
      sub: 'Browse universities in this county',
    });
  }

  return NextResponse.json(results);
}


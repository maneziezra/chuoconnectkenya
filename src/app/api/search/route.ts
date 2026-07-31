import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json([]);

  const supabase = await createClient();
  const term = `%${q}%`;

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
      .limit(4),
  ]);

  const results = [
    ...(uniRes.data ?? []).map((u: { id: string; name: string; county: string; type: string }) => ({
      type: 'university',
      id: u.id,
      label: u.name,
      sub: `${u.county} County · ${u.type}`,
    })),
    ...(courseRes.data ?? []).map((c: { id: string; title: string; clusterGroup: string }) => ({
      type: 'course',
      id: c.id,
      label: c.title,
      sub: c.clusterGroup,
    })),
  ];

  // Add county suggestion if query matches a county name
  const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Thika', 'Machakos', 'Kilifi', 'Garissa'];
  const matchedCounty = counties.find(c => c.toLowerCase().includes(q.toLowerCase()));
  if (matchedCounty && !results.find(r => r.label === matchedCounty)) {
    results.push({ type: 'county' as const, id: matchedCounty, label: matchedCounty, sub: 'Browse universities in this county' });
  }

  return NextResponse.json(results);
}

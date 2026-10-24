import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { universitiesData } from '@/lib/data/universities';

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids');
  if (ids) {
    const idList = ids.split(',').slice(0, 3);
    let dbUnis: any[] = [];
    try {
      const supabase = await createClient();
      const { data } = await supabase.from('universities').select('*').in('id', idList);
      dbUnis = data ?? [];
    } catch {
      // Fallback to local data
    }

    const seen = new Set(dbUnis.map(u => u.id));
    const localMatches = universitiesData.filter(u => idList.includes(u.id) && !seen.has(u.id));
    const combined = [...dbUnis, ...localMatches].map(u => ({
      ...u,
      image: u.coverUrl || u.logoUrl || u.image || '',
    }));

    return NextResponse.json(combined);
  }

  // Return full directory if no ids are specified
  let dbUnis: any[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('universities').select('*').order('ranking', { ascending: true });
    dbUnis = data ?? [];
  } catch {
    // Fallback to local data
  }

  const dbIds = new Set((dbUnis || []).map((u: any) => u.id));
  const mergedUnis = [
    ...(dbUnis || []),
    ...universitiesData.filter(u => !dbIds.has(u.id)),
  ].sort((a: any, b: any) => (a.ranking ?? 99) - (b.ranking ?? 99));

  const allUnis = mergedUnis.map((u: any) => ({
    ...u,
    image: u.coverUrl || u.logoUrl || u.image || '',
  }));

  return NextResponse.json(allUnis);
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { universityId, authorName, body: reviewBody, overallRating, criteriaScores } = body;

    if (!universityId || !reviewBody || !overallRating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to submit a review.' }, { status: 401 });
    }

    const { data, error } = await supabase.from('reviews').insert({
      universityId,
      userId: user.id,
      authorName: authorName || 'Anonymous',
      type: 'student',
      overallRating,
      body: reviewBody,
      criteriaScores: criteriaScores || {},
      verified: true,
      createdAt: new Date().toISOString(),
    }).select().single();

    if (error) {
      console.error('Failed to insert review:', error);
      return NextResponse.json({ error: 'Failed to insert review' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const universityId = request.nextUrl.searchParams.get('universityId');
  if (!universityId) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('universityId', universityId)
    .order('createdAt', { ascending: false });

  return NextResponse.json(data ?? []);
}

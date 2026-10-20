import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { universityId, authorName, body: reviewBody, overallRating, criteriaScores } = body;

    if (!universityId || !reviewBody || !overallRating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const fallbackReview = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `rev-${Date.now()}`,
      universityId,
      authorName: (authorName || '').trim() || 'Campus Student',
      type: 'student' as const,
      overallRating: Number(overallRating),
      body: String(reviewBody).trim(),
      criteriaScores: criteriaScores || {},
      verified: false,
      createdAt: new Date().toISOString(),
    };

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('reviews').insert({
          universityId,
          userId: user.id,
          authorName: fallbackReview.authorName,
          type: 'student',
          overallRating: fallbackReview.overallRating,
          body: fallbackReview.body,
          criteriaScores: fallbackReview.criteriaScores,
          verified: true,
          createdAt: fallbackReview.createdAt,
        }).select().single();

        if (!error && data) {
          return NextResponse.json(data);
        }
      }
    } catch (err) {
      console.warn('Review DB fallback used:', err);
    }

    return NextResponse.json(fallbackReview);
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

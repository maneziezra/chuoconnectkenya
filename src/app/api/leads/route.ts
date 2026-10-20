import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateLeadInput } from '@/lib/utils/leads';

/**
 * POST /api/leads — a student asks a university for admission information.
 *
 * Open to guests (no login) by design, so it is hardened instead:
 *  - requires Content-Type: application/json (forces a CORS preflight, so other
 *    sites can't blind-POST to it from a visitor's browser)
 *  - body size cap, strict server-side validation, honeypot field, per-IP rate limit
 *  - the DB enforces the same rules via RLS + column grants (supabase_university_leads.sql)
 *  - logs only the Postgres error CODE: messages for check-constraint failures echo the
 *    failing row, which would put students' phone numbers into server logs.
 */

const MAX_BODY_BYTES = 10_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort only: this map lives per serverless instance, so it slows down a single
// abuser but is not a global limit. Real abuse protection = RLS + validation above.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json.' }, { status: 415 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(RATE_WINDOW_MS / 1000) } }
    );
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return NextResponse.json({ error: 'Could not read request.' }, { status: 400 });
  }
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field. Pretend success so bots learn nothing.
  const honeypot =
    typeof body === 'object' && body !== null ? (body as Record<string, unknown>).company : undefined;
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const parsed = validateLeadInput(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: 'Please fix the highlighted fields.', fieldErrors: parsed.errors },
      { status: 400 }
    );
  }
  const v = parsed.value;

  try {
    const supabase = await createClient();
    // No .select(): anonymous submitters have no SELECT privilege, so we must not ask for the row back.
    const { error } = await supabase.from('university_leads').insert({
      universityId: v.universityId,
      student_name: v.studentName,
      phone: v.phone,
      email: v.email,
      cluster_points: v.clusterPoints,
      mean_grade: v.meanGrade,
      target_course: v.targetCourse,
      financing_preference: v.financingPreference,
      hef_band: v.hefBand,
      source: v.source,
      consent: true,
    });

    if (error) {
      console.error('[api/leads] insert failed, code:', error.code);
      // PGRST205 / 42P01: table missing (migration not applied). 42501: RLS/grant denied.
      if (error.code === 'PGRST205' || error.code === '42P01' || error.code === '42501') {
        return NextResponse.json(
          {
            error:
              'Online admission enquiries are not switched on yet. Please contact the university directly using the details on this page.',
            code: 'not_configured',
          },
          { status: 503 }
        );
      }
      if (error.code === '23514' || error.code === '23502') {
        return NextResponse.json({ error: 'Some details were not accepted. Please check the form.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'We could not send your enquiry. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    console.error('[api/leads] unexpected failure');
    return NextResponse.json({ error: 'We could not send your enquiry. Please try again.' }, { status: 502 });
  }
}

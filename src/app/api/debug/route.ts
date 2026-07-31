import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: courses } = await supabase.from('courses').select('*');
  const { data: profile } = await supabase.from('student_profiles').select('*');
  return NextResponse.json({ coursesCount: courses?.length, courses, profile });
}

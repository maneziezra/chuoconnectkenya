import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids');
  if (!ids) return NextResponse.json([]);

  const idList = ids.split(',').slice(0, 3);
  const supabase = await createClient();
  const { data } = await supabase.from('universities').select('*').in('id', idList);
  return NextResponse.json(data ?? []);
}

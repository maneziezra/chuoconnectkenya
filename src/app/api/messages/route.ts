import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ambassadorId, body: messageContent } = body;

    if (!ambassadorId || !messageContent) {
      return NextResponse.json({ error: 'Missing ambassador ID or message content' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. You must be logged in to send a message.' }, { status: 401 });
    }

    const { data, error } = await supabase.from('messages').insert({
      ambassadorId,
      senderId: user.id,
      content: messageContent,
    }).select().single();

    if (error) {
      console.error('Failed to insert message:', error);
      return NextResponse.json({ error: 'Failed to insert message' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Messages API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

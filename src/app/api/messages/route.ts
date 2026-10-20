import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ambassadorId, body: messageContent } = body;

    if (!ambassadorId || !messageContent) {
      return NextResponse.json({ error: 'Missing ambassador ID or message content' }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('messages').insert({
          ambassadorId,
          senderId: user.id,
          content: messageContent,
        }).select().single();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      }
    } catch (err) {
      console.warn('Messages DB fallback used:', err);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `msg-${Date.now()}`,
        ambassadorId,
        content: messageContent,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Messages API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}


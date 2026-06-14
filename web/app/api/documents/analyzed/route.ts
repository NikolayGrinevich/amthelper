import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUser } from '@/app/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('analyzed_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('processed_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Fetch analyzed documents error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ documents: data });
  } catch (error) {
    console.error('Fetch analyzed documents error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fetch failed' },
      { status: 500 }
    );
  }
}

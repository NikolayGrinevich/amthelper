import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';

async function getUserFromToken(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    return null;
  }

  // Demo token handling FIRST (before supabaseAdmin check)
  if (authToken.startsWith('demo_token_')) {
    return {
      id: '219d0e4d-401e-405a-b5be-ef1095f6165e',
      email: 'demo@amthelper.de',
    };
  }

  // Real token - validate with Supabase
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured - missing SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authToken);

  if (authError || !user) {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
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

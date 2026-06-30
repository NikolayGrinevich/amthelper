import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_MIGRATION_KEY || 'migration-secret-key-2026';
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    // Use service role client
    const adminDb = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Run migration via Supabase Management REST API
    // We use the service role key to call the SQL endpoint
    const ref = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
    if (!ref) {
      return NextResponse.json({ error: 'Invalid project ref' }, { status: 500 });
    }

    const sql = 'ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;';

    const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    const result = await mgmtRes.text();

    return NextResponse.json({
      success: mgmtRes.ok,
      status: mgmtRes.status,
      result: result.substring(0, 500),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Migration failed',
    }, { status: 500 });
  }
}

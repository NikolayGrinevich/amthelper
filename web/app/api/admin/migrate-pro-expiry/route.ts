import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Migration helper: provides SQL to run in Supabase SQL Editor.
 * Run: ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;
 */
export async function GET(request: NextRequest) {
  const sql = 'ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;';
  
  return NextResponse.json({
    migration_required: true,
    sql,
    instructions: 'Run this SQL in Supabase Dashboard → SQL Editor',
    manual_url: 'https://supabase.com/dashboard/project/lqquydxzehorydznzxcm/sql/new',
  });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_MIGRATION_KEY || 'migration-secret-key-2026';
    
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = 'ALTER TABLE users ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;';
    
    return NextResponse.json({
      success: true,
      sql,
      note: 'Run this SQL manually in Supabase Dashboard SQL Editor',
      manual_url: 'https://supabase.com/dashboard/project/lqquydxzehorydznzxcm/sql/new',
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Migration failed',
    }, { status: 500 });
  }
}

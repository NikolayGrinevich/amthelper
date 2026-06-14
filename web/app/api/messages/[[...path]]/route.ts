import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(_req: NextRequest, { params }: { params: { path?: string[] } }) {
  const segments = params.path ?? [];
  const filePath = path.join(process.cwd(), 'messages', ...segments);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(content, { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

export const runtime = 'nodejs';

async function getUserFromToken(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    return null;
  }

  // Validate token with Supabase
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

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      analyzed_document_id,
      file_name,
      file_type,
      file_size,
      analysis_result,
      organization_type,
      deadline_date,
    } = body;

    if (!analyzed_document_id) {
      return NextResponse.json(
        { error: 'Missing analyzed_document_id' },
        { status: 400 }
      );
    }

    if (!file_name || !analysis_result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Ownership check: verify analyzed_document_id belongs to user
    const { data: existingAnalysis, error: ownershipError } = await supabaseAdmin
      .from('analyzed_documents')
      .select('id, document_id')
      .eq('id', analyzed_document_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (ownershipError) {
      console.error('Ownership check failed');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Duplicate check: if document_id already set, analysis was already saved
    if (existingAnalysis.document_id) {
      return NextResponse.json(
        { error: 'Analysis already saved' },
        { status: 409 }
      );
    }

    // Create document record
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert([
        {
          user_id: user.id,
          file_name,
          file_type: file_type || 'application/octet-stream',
          file_size: file_size || 0,
          status: 'completed',
        },
      ])
      .select()
      .single();

    if (docError) {
      console.error('Document creation error:', docError);
      return NextResponse.json(
        { error: 'Failed to save document' },
        { status: 500 }
      );
    }

    // UPDATE existing analyzed_document record (created by analyze route)
    // Do NOT overwrite analysis_result — it's the source of truth from analyze route
    const { data: analyzedDoc, error: analysisError } = await supabaseAdmin
      .from('analyzed_documents')
      .update({
        document_id: document.id,
        file_name,
        organization_type: organization_type || analysis_result.sender || 'Unknown',
        deadline_date: deadline_date || analysis_result.deadline || null,
      })
      .eq('id', analyzed_document_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (analysisError) {
      console.error('Analyzed document update error:', analysisError);
      return NextResponse.json(
        { error: 'Failed to update analysis' },
        { status: 500 }
      );
    }

    // Create deadline record if exists
    if (deadline_date || analysis_result.deadline) {
      const deadline = deadline_date || analysis_result.deadline;
      if (deadline) {
        await supabaseAdmin.from('deadlines').insert([
          {
            user_id: user.id,
            document_id: document.id,
            due_date: deadline,
            title: `Срок по документу: ${analysis_result.document_type || file_name}`,
            description: `Крайний срок для ответа на письмо от ${analysis_result.sender}`,
            status: 'open',
          },
        ]);
      }
    }

    // Create checklist if required documents exist
    if (analysis_result.required_documents?.length > 0) {
      const items = analysis_result.required_documents.map((doc: string, index: number) => ({
        text: doc,
        completed: false,
        order: index,
      }));

      await supabaseAdmin.from('checklists').insert([
        {
          user_id: user.id,
          document_id: document.id,
          title: `Документы для ответа на ${analysis_result.sender}`,
          items,
          total_count: items.length,
          completed_count: 0,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      document: analyzedDoc,
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

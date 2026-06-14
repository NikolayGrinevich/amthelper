import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUser } from '@/app/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      file_name,
      file_type,
      file_size,
      analysis_result,
      organization_type,
      deadline_date,
    } = body;

    if (!file_name || !analysis_result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
          analysis: analysis_result,
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

    // Create analyzed_document record
    const { data: analyzedDoc, error: analysisError } = await supabaseAdmin
      .from('analyzed_documents')
      .insert([
        {
          user_id: user.id,
          document_id: document.id,
          file_name,
          analysis_result,
          organization_type: organization_type || analysis_result.sender || 'Unknown',
          deadline_date: deadline_date || analysis_result.deadline || null,
        },
      ])
      .select()
      .single();

    if (analysisError) {
      console.error('Analyzed document creation error:', analysisError);
      return NextResponse.json(
        { error: 'Failed to save analysis' },
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
      { error: error instanceof Error ? error.message : 'Save failed' },
      { status: 500 }
    );
  }
}

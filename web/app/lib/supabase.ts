import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check .env.local and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client - bypasses RLS for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// User Profile operations
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { data, error };
}

export async function createUserProfile(userId: string, email: string, fullName: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert([
      {
        id: userId,
        email,
        full_name: fullName,
        language: 'de',
      },
    ])
    .select()
    .maybeSingle();

  return { data, error };
}

// Document operations
export async function createDocument(userId: string, fileName: string, fileType: string, fileSize: number) {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      {
        user_id: userId,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        status: 'pending',
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getUserDocuments(userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Analyzed Document operations
export async function createAnalyzedDocument(
  userId: string,
  documentId: string,
  fileName: string,
  analysisResult: Record<string, any>,
  organizationType: string,
  deadlineDate: string | null
) {
  const { data, error } = await supabase
    .from('analyzed_documents')
    .insert([
      {
        user_id: userId,
        document_id: documentId,
        file_name: fileName,
        analysis_result: analysisResult,
        organization_type: organizationType,
        deadline_date: deadlineDate,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getAnalyzedDocuments(userId: string) {
  const { data, error } = await supabase
    .from('analyzed_documents')
    .select('*')
    .eq('user_id', userId)
    .order('processed_at', { ascending: false });

  return { data, error };
}

// Generated Letter operations (updated for new schema)
export async function createGeneratedLetter(
  userId: string,
  analyzedDocumentId: string,
  templateType: 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde',
  recipient: string,
  content: string,
  status: 'draft' | 'sent' | 'archived' = 'draft'
) {
  const { data, error } = await supabase
    .from('generated_letters')
    .insert([
      {
        user_id: userId,
        analyzed_document_id: analyzedDocumentId,
        template_type: templateType,
        recipient,
        content,
        status,
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function getUserLetters(userId: string) {
  const { data, error } = await supabase
    .from('generated_letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Template operations
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export type UserRole = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  subscription_status: 'active' | 'expired' | 'none';
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  extracted_text: string;
  analyzed_data: AnalyzedDocument;
  created_at: string;
  updated_at: string;
}

export interface AnalyzedDocument {
  sender: string;
  recipient: string;
  document_type: string; // Finanzamt, Ausländerbehörde, etc.
  key_points: string[];
  deadline: string | null;
  required_documents: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

export interface AnalyzedDocumentHistory {
  id: string;
  file_name: string;
  uploaded_at: string;
  sender: string;
  document_type: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline: string | null;
}

export interface Deadline {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'completed' | 'overdue';
  reminder_sent: boolean;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  description: string;
  items: ChecklistItemDetail[];
  created_at: string;
}

export interface ChecklistItemDetail {
  id: string;
  title: string;
  completed: boolean;
  notes: string;
}

export interface ResponseLetter {
  id: string;
  user_id: string;
  document_id: string;
  recipient_address: string;
  letter_type: string;
  content: string;
  status: 'draft' | 'generated' | 'approved';
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  language: 'de' | 'ru' | 'uk' | 'ro';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: UserRole;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

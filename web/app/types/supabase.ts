export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          role: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          role?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          role?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          uploaded_at: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          uploaded_at?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          uploaded_at?: string
          status?: string
          created_at?: string
        }
      }
      analyzed_documents: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          file_name: string | null
          analysis_result: Json | null
          organization_type: string | null
          deadline_date: string | null
          processed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          file_name?: string | null
          analysis_result?: Json | null
          organization_type?: string | null
          deadline_date?: string | null
          processed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string | null
          file_name?: string | null
          analysis_result?: Json | null
          organization_type?: string | null
          deadline_date?: string | null
          processed_at?: string
          created_at?: string
        }
      }
      generated_letters: {
        Row: {
          id: string
          user_id: string
          analyzed_document_id: string | null
          template_type: 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde'
          recipient: string
          content: string
          status: 'draft' | 'sent' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          analyzed_document_id?: string | null
          template_type: 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde'
          recipient: string
          content: string
          status?: 'draft' | 'sent' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          analyzed_document_id?: string | null
          template_type?: 'Widerspruch' | 'Antrag' | 'Nachfrage' | 'Beschwerde'
          recipient?: string
          content?: string
          status?: 'draft' | 'sent' | 'archived'
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          letter_type: string | null
          language: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          letter_type?: string | null
          language?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          letter_type?: string | null
          language?: string | null
          content?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

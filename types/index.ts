export type TemplateType =
  | 'finanzamt'
  | 'anmeldung'
  | 'auslaenderbehoerde'
  | 'krankenversicherung'
  | 'jobcenter';

export interface Template {
  id: TemplateType;
  name: string;
  nameRu: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  letter?: GeneratedLetter;
  createdAt: Date;
}

export interface GeneratedLetter {
  explanation: string;
  letterDe: string;
  subject: string;
}

export interface Letter {
  id: string;
  user_id: string;
  template_type: TemplateType;
  user_input: string;
  explanation: string;
  letter_de: string;
  subject: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription: Subscription | null;
  letters_this_month: number;
}

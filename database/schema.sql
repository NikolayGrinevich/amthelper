-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'none',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_price_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analyzed Documents Table
CREATE TABLE IF NOT EXISTS analyzed_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  file_name VARCHAR(255),
  analysis_result JSONB,
  organization_type VARCHAR(100),
  deadline_date DATE,
  processed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Letters Table
CREATE TABLE IF NOT EXISTS generated_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analyzed_document_id UUID REFERENCES analyzed_documents(id) ON DELETE SET NULL,
  template_type TEXT NOT NULL CHECK (template_type IN (
    'Widerspruch', 'Antrag', 'Nachfrage', 'Beschwerde'
  )),
  recipient TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'archived'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  letter_type VARCHAR(100),
  language VARCHAR(10),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_analyzed_documents_user_id ON analyzed_documents(user_id);
CREATE INDEX idx_generated_letters_user_id ON generated_letters(user_id);
CREATE INDEX idx_generated_letters_analyzed_doc ON generated_letters(analyzed_document_id);
CREATE INDEX idx_generated_letters_status ON generated_letters(status);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_subscriptions_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_profiles_stripe_id ON user_profiles(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for documents
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for analyzed_documents
CREATE POLICY "Users can view own analyzed documents"
  ON analyzed_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create analyzed documents"
  ON analyzed_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for generated_letters
CREATE POLICY "Users can view own letters"
  ON generated_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create letters"
  ON generated_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letters"
  ON generated_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own letters"
  ON generated_letters FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_subscriptions
CREATE POLICY "Anyone can view subscriptions by customer ID"
  ON user_subscriptions FOR SELECT
  USING (TRUE);

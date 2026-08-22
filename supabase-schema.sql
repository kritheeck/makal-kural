-- Makkal Kural Supabase Schema
-- Run this in Supabase SQL Editor

-- Representatives
CREATE TABLE IF NOT EXISTS representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  category_specialty TEXT,
  state TEXT NOT NULL DEFAULT 'Tamil Nadu',
  district TEXT NOT NULL,
  constituency TEXT,
  email TEXT NOT NULL,
  x_handle TEXT,
  official_website TEXT,
  source_url TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'NEEDS_REVIEW',
  last_verified_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  user_id UUID,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_language TEXT NOT NULL DEFAULT 'en',
  ai_improved_title TEXT,
  ai_improved_description TEXT,
  translated_description TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  constituency TEXT,
  locality TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  assigned_representative_id UUID REFERENCES representatives(id),
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  submitter_phone TEXT,
  submitter_language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Complaint Attachments
CREATE TABLE IF NOT EXISTS complaint_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Delivery Logs
CREATE TABLE IF NOT EXISTS delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL,
  external_message_id TEXT,
  external_url TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Complaint Updates
CREATE TABLE IF NOT EXISTS complaint_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_district ON complaints(district);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_reference ON complaints(reference_number);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_representatives_district ON representatives(district);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_complaint ON delivery_logs(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint ON complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_attachments_complaint ON complaint_attachments(complaint_id);

-- Enable RLS
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read verified reps" ON representatives;
DROP POLICY IF EXISTS "Allow public insert complaints" ON complaints;
DROP POLICY IF EXISTS "Allow public read own complaints" ON complaints;
DROP POLICY IF EXISTS "Allow public insert attachments" ON complaint_attachments;
DROP POLICY IF EXISTS "Allow public read attachments" ON complaint_attachments;
DROP POLICY IF EXISTS "Allow public read delivery logs" ON delivery_logs;
DROP POLICY IF EXISTS "Allow public read updates" ON complaint_updates;
DROP POLICY IF EXISTS "Allow admin audit logs" ON audit_logs;

CREATE POLICY "Allow public read verified reps" ON representatives FOR SELECT USING (active = true);
CREATE POLICY "Allow public insert complaints" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Allow public insert attachments" ON complaint_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read attachments" ON complaint_attachments FOR SELECT USING (true);
CREATE POLICY "Allow public read delivery logs" ON delivery_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read updates" ON complaint_updates FOR SELECT USING (true);
CREATE POLICY "Allow admin audit logs" ON audit_logs FOR ALL USING (true);

-- =========================================================
-- Makkal Kural (மக்கள் குரல்) — Schema Definition
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Users & Admins)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'ta')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Representatives Table (Public Officials Directory)
CREATE TABLE IF NOT EXISTS representatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    category_specialty VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Tamil Nadu' NOT NULL,
    district VARCHAR(100) NOT NULL,
    constituency VARCHAR(150),
    email VARCHAR(255) NOT NULL,
    x_handle VARCHAR(100),
    official_website TEXT,
    source_url TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'NEEDS_REVIEW' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'DISABLED')),
    last_verified_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    original_language VARCHAR(10) DEFAULT 'en' NOT NULL,
    ai_improved_title VARCHAR(255),
    ai_improved_description TEXT,
    translated_description TEXT,
    state VARCHAR(100) DEFAULT 'Tamil Nadu' NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(150) NOT NULL,
    constituency VARCHAR(150),
    locality VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    severity VARCHAR(20) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(30) DEFAULT 'SUBMITTED' CHECK (status IN (
        'DRAFT', 'SUBMITTED', 'EMAIL_QUEUED', 'EMAIL_SENT', 'EMAIL_FAILED', 
        'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    )),
    assigned_representative_id UUID REFERENCES representatives(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    submitter_name VARCHAR(255) NOT NULL,
    submitter_email VARCHAR(255) NOT NULL,
    submitter_phone VARCHAR(20),
    submitter_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Attachments Table (Evidence)
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Delivery Logs Table (Email & Social Dispatch)
CREATE TABLE IF NOT EXISTS delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('EMAIL', 'X_API', 'X_SHARE')),
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING', 'QUEUED')),
    external_message_id VARCHAR(255),
    external_url TEXT,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Complaint Updates Table (Timeline / Actions)
CREATE TABLE IF NOT EXISTS complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Audit Logs Table (Administrative Actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_complaints_ref ON complaints(reference_number);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_district ON complaints(district);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_representatives_district ON representatives(district);
CREATE INDEX IF NOT EXISTS idx_representatives_constituency ON representatives(constituency);
CREATE INDEX IF NOT EXISTS idx_representatives_verification ON representatives(verification_status);
CREATE INDEX IF NOT EXISTS idx_delivery_logs_complaint ON delivery_logs(complaint_id);
CREATE INDEX IF NOT EXISTS idx_updates_complaint ON complaint_updates(complaint_id);

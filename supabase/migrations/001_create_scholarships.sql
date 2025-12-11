-- Scholarships Database Schema
-- Run this in Supabase SQL Editor

-- 1. Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  provider VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('scholarship', 'bursary', 'loan', 'grant', 'bootcamp', 'learning')),
  category VARCHAR(50), -- Tech, Business, Education, etc.
  
  -- Eligibility (stored as JSONB for flexibility)
  eligibility JSONB NOT NULL DEFAULT '{}',
  
  -- Award Details (for scholarships)
  amount VARCHAR(255), -- e.g., "KES 50,000/year"
  coverage JSONB, -- ['tuition', 'books', 'accommodation']
  duration VARCHAR(100),
  
  -- Bootcamp Details
  bootcamp_details JSONB,
  
  -- Learning Opportunity Details
  learning_details JSONB,
  
  -- Application Info
  application_deadline TIMESTAMP,
  application_link TEXT,
  contact_info JSONB, -- {email, phone, address}
  
  -- Additional Info
  requirements JSONB, -- Array of strings
  documents JSONB, -- Array of strings
  notes TEXT,
  priority INTEGER DEFAULT 0, -- For ranking (1 = highest)
  
  -- Verification & Status
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP,
  verification_notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'closed', 'rejected')),
  published_at TIMESTAMP,
  
  -- Provider Info (for future multi-user system)
  provider_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_verified_at TIMESTAMP,
  
  -- Search Optimization
  search_vector TSVECTOR
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarships_type ON scholarships(type);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_verified ON scholarships(verified);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_provider ON scholarships(provider_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_search ON scholarships USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_scholarships_eligibility ON scholarships USING GIN(eligibility);

-- 3. Create function to update search vector
CREATE OR REPLACE FUNCTION update_scholarship_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.provider, '')), 'C');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-update search vector
CREATE TRIGGER update_scholarship_search_vector_trigger
  BEFORE INSERT OR UPDATE ON scholarships
  FOR EACH ROW
  EXECUTE FUNCTION update_scholarship_search_vector();

-- 5. Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
-- Allow anyone to read active, verified scholarships
CREATE POLICY "Anyone can view active scholarships"
  ON scholarships
  FOR SELECT
  USING (status = 'active' AND verified = TRUE);

-- Allow authenticated users to create scholarships (for providers)
CREATE POLICY "Authenticated users can create scholarships"
  ON scholarships
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role to insert (for seeding/admin operations)
-- This policy allows server-side operations to bypass RLS
CREATE POLICY "Service role can insert scholarships"
  ON scholarships
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow providers to update their own scholarships
CREATE POLICY "Providers can update own scholarships"
  ON scholarships
  FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

-- 7. Insert sample data (from mock data)
-- This will be replaced by API/Admin interface later
INSERT INTO scholarships (name, description, provider, type, eligibility, amount, coverage, duration, application_deadline, requirements, documents, priority, verified, status, published_at) VALUES
(
  'Nairobi County Bursary Fund',
  'Financial support for needy students in Nairobi County',
  'Nairobi County Government',
  'bursary',
  '{"counties": ["Nairobi"], "minGrade": 1, "maxGrade": 12, "incomeLevel": ["low", "medium"]}'::jsonb,
  'KES 10,000 - 50,000 per year',
  '["tuition", "books"]'::jsonb,
  'Annual (renewable)',
  (CURRENT_DATE + INTERVAL '3 months')::timestamp,
  '["Must be a resident of Nairobi County", "Proof of financial need", "School admission letter", "Parent/Guardian ID"]'::jsonb,
  '["Application form", "Birth certificate", "School fee structure", "Parent/Guardian ID copy", "Proof of residence"]'::jsonb,
  1,
  TRUE,
  'active',
  NOW()
),
(
  'Kiambu County Scholarship Program',
  'Full scholarship for top-performing students in Kiambu County',
  'Kiambu County Government',
  'scholarship',
  '{"counties": ["Kiambu"], "minKCPE": 350, "minKCSE": "B+"}'::jsonb,
  'Full tuition coverage',
  '["tuition", "books", "accommodation"]'::jsonb,
  '4 years',
  (CURRENT_DATE + INTERVAL '2 months')::timestamp,
  '["KCPE score above 350", "KCSE grade B+ or higher", "Resident of Kiambu County"]'::jsonb,
  '["Application form", "KCPE/KCSE certificate", "Birth certificate", "Proof of residence"]'::jsonb,
  1,
  TRUE,
  'active',
  NOW()
)
ON CONFLICT DO NOTHING;



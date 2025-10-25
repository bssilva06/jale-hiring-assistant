-- Fix for Jale Backend - Add missing columns to Supabase tables
-- Run this in your Supabase SQL Editor

-- STEP 1: Disable Row Level Security for development (IMPORTANT!)
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE interviews DISABLE ROW LEVEL SECURITY;

-- Add missing columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Ensure all expected columns exist in candidates table
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en';

-- Create chat_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS on chat_messages
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- Create matches table if it doesn't exist
CREATE TABLE IF NOT EXISTS matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL,
    reasoning TEXT,
    strengths TEXT[] DEFAULT '{}',
    red_flags TEXT[] DEFAULT '{}',
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(candidate_id, job_id)
);

-- Disable RLS on matches
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;

-- Ensure interviews table has all needed columns
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_type TEXT DEFAULT 'video';
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_job_candidate ON chat_messages(job_id, candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_candidate_job ON matches(candidate_id, job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_at ON interviews(scheduled_at);

-- Update timestamp trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables exist
SELECT 'Jobs table columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'jobs';

SELECT 'Candidates table columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'candidates';

SELECT 'Applications table columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'applications';

SELECT 'Interviews table columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'interviews';

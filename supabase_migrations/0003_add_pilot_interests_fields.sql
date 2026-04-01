-- Migration: Add pilot interests fields to pilot_licensure_experience table
-- This adds fields for aviation pathways and job positions interests

-- Add aviation pathways interests (multiple choice stored as array)
ALTER TABLE pilot_licensure_experience 
ADD COLUMN IF NOT EXISTS aviation_pathways_interests TEXT[] DEFAULT '{}'::text[];

-- Add pilot job positions interests (multiple choice stored as array)
ALTER TABLE pilot_licensure_experience 
ADD COLUMN IF NOT EXISTS pilot_job_positions_interests TEXT[] DEFAULT '{}'::text[];

-- Add index for querying by interests (useful for matching pilots to opportunities)
CREATE INDEX IF NOT EXISTS idx_pilot_licensure_pathways 
ON pilot_licensure_experience USING GIN(aviation_pathways_interests);

CREATE INDEX IF NOT EXISTS idx_pilot_licensure_job_positions 
ON pilot_licensure_experience USING GIN(pilot_job_positions_interests);

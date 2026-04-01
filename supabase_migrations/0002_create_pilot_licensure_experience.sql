-- Create table for pilot licensure and experience data
CREATE TABLE IF NOT EXISTS pilot_licensure_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  languages TEXT[],
  
  -- License Information
  current_license TEXT,
  license_number TEXT,
  license_expiry DATE,
  medical_expiry DATE,
  
  -- Aircraft Ratings (stored as JSONB array)
  aircraft_ratings JSONB DEFAULT '[]'::jsonb,
  
  -- Job Experiences (stored as JSONB array)
  job_experiences JSONB DEFAULT '[]'::jsonb,
  
  -- Current Occupation
  current_occupation TEXT,
  current_employer TEXT,
  current_position TEXT,
  
  -- Additional Information
  countries_visited INTEGER DEFAULT 0,
  favorite_aircraft TEXT,
  why_become_pilot TEXT,
  other_skills TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to ensure one record per user
  CONSTRAINT unique_user_pilot_data UNIQUE (user_id)
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_pilot_licensure_experience_user_id 
ON pilot_licensure_experience(user_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE pilot_licensure_experience ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own data
CREATE POLICY "Users can view own pilot data" 
ON pilot_licensure_experience 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own data
CREATE POLICY "Users can insert own pilot data" 
ON pilot_licensure_experience 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own data
CREATE POLICY "Users can update own pilot data" 
ON pilot_licensure_experience 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own data
CREATE POLICY "Users can delete own pilot data" 
ON pilot_licensure_experience 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_pilot_licensure_experience_updated_at ON pilot_licensure_experience;
CREATE TRIGGER update_pilot_licensure_experience_updated_at
  BEFORE UPDATE ON pilot_licensure_experience
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

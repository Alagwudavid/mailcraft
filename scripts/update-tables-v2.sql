-- Add public username and publicity features
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS public_username TEXT UNIQUE;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update templates table with new fields
ALTER TABLE templates ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS forks_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS forked_from UUID REFERENCES templates(id) ON DELETE SET NULL;

-- Create RLS policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" ON projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Update template policies for public viewing
DROP POLICY IF EXISTS "Users can view own templates" ON templates;
CREATE POLICY "Users can view own templates" ON templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public templates" ON templates
  FOR SELECT USING (is_public = true);

-- Create updated_at trigger for projects
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate public username
CREATE OR REPLACE FUNCTION generate_public_username()
RETURNS TEXT AS $$
DECLARE
  letters TEXT;
  numbers TEXT;
  username TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Generate 3 random letters
    letters := chr(65 + floor(random() * 26)::int) || 
               chr(65 + floor(random() * 26)::int) || 
               chr(65 + floor(random() * 26)::int);
    
    -- Generate 3 random numbers
    numbers := floor(random() * 1000)::text;
    numbers := lpad(numbers, 3, '0');
    
    -- Combine with user- prefix
    username := 'user-' || letters || numbers;
    
    -- Check if username exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE public_username = username) THEN
      RETURN username;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      -- Fallback with timestamp if too many collisions
      username := 'user-' || letters || numbers || extract(epoch from now())::bigint::text;
      RETURN username;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate public username for new users
CREATE OR REPLACE FUNCTION auto_generate_public_username()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_username IS NULL THEN
    NEW.public_username := generate_public_username();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_username_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_public_username();

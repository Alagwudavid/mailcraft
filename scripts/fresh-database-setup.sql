-- Fresh Database Setup Script
-- Run this on a completely new/empty database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data we can control
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  public_username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table with all necessary fields
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Template',
  content JSONB NOT NULL DEFAULT '{"blocks": []}',
  is_public BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  forked_from UUID REFERENCES templates(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "projects_select_own" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_select_public" ON projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for templates
CREATE POLICY "templates_select_own" ON templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "templates_select_public" ON templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "templates_insert_policy" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "templates_update_policy" ON templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "templates_delete_policy" ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique public username
CREATE OR REPLACE FUNCTION generate_unique_username()
RETURNS TEXT AS $$
DECLARE
  letters TEXT;
  numbers TEXT;
  username TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Generate 3 random letters (mix of cases)
    letters := chr(97 + floor(random() * 26)::int) || 
               chr(65 + floor(random() * 26)::int) || 
               chr(97 + floor(random() * 26)::int);
    
    -- Generate 3 random numbers
    numbers := lpad(floor(random() * 1000)::text, 3, '0');
    
    -- Combine with user- prefix
    username := 'user-' || letters || numbers;
    
    -- Check if username exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE public_username = username) THEN
      RETURN username;
    END IF;
    
    counter := counter + 1;
    -- Add timestamp suffix if too many collisions
    IF counter > 50 THEN
      username := 'user-' || letters || numbers || '-' || extract(epoch from now())::bigint::text;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, public_username)
  VALUES (NEW.id, generate_unique_username());
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_signup();

-- Create indexes for better performance
CREATE INDEX idx_profiles_public_username ON profiles(public_username);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_is_public ON projects(is_public);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_project_id ON templates(project_id);
CREATE INDEX idx_templates_is_public ON templates(is_public);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Insert some sample data (optional - remove if you don't want sample data)
-- This will only work after you have at least one user signed up

-- ==============================================================================
-- SAMYAK MAHAJAN PORTFOLIO — SUPABASE POSTGRESQL DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This creates the persistent projects table, indexes, and security policies.
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT DEFAULT '',
  year TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT NOT NULL,
  video TEXT DEFAULT '',
  poster TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  aspect_ratio TEXT NOT NULL DEFAULT '16/9',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  case_study JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects("order");

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Grant Table Permissions to Supabase Roles
GRANT ALL ON TABLE public.projects TO service_role;
GRANT SELECT ON TABLE public.projects TO anon, authenticated;

-- 5. Public Access Policy: Anonymous visitors can only read published projects
CREATE POLICY "Public read published projects" 
  ON public.projects 
  FOR SELECT 
  TO anon, authenticated
  USING (published = true);

-- 6. Admin Policy: Full CRUD for Service Role (used by your Vercel backend)
CREATE POLICY "Service role full access" 
  ON public.projects 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- 7. Storage Bucket for Media (Videos & Postcards/Thumbnails)
-- Create bucket if not exists via storage schema
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view media in portfolio-media bucket
CREATE POLICY "Public media access" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

-- Service role can upload/delete media
CREATE POLICY "Service role media upload" 
  ON storage.objects 
  FOR ALL 
  TO service_role 
  USING (bucket_id = 'portfolio-media') 
  WITH CHECK (bucket_id = 'portfolio-media');

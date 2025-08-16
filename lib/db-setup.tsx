// This file contains the SQL commands to set up the service_profiles table in Supabase

/*
-- Run these SQL commands in the Supabase SQL Editor to create the service_profiles table

-- Create the service_profiles table
CREATE TABLE IF NOT EXISTS public.service_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  contact TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT service_profiles_user_id_key UNIQUE (user_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.service_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read active service profiles
CREATE POLICY "Anyone can view active service profiles" 
ON public.service_profiles 
FOR SELECT 
USING (is_active = true);

-- Policy to allow users to insert their own service profile
CREATE POLICY "Users can insert their own service profile" 
ON public.service_profiles 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Policy to allow users to update their own service profile
CREATE POLICY "Users can update their own service profile" 
ON public.service_profiles 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

-- Policy to allow users to delete their own service profile
CREATE POLICY "Users can delete their own service profile" 
ON public.service_profiles 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS service_profiles_user_id_idx ON public.service_profiles (user_id);
*/

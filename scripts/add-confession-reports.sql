-- Create confession_reports table for reporting confessions
CREATE TABLE IF NOT EXISTS public.confession_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  confession_id UUID REFERENCES public.confessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT confession_reports_unique_user_confession UNIQUE (confession_id, user_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.confession_reports ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own reports
CREATE POLICY "Users can insert their own confession reports" 
ON public.confession_reports 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Policy to allow users to view their own reports (optional)
CREATE POLICY "Users can view their own confession reports" 
ON public.confession_reports 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS confession_reports_confession_id_idx ON public.confession_reports (confession_id);
CREATE INDEX IF NOT EXISTS confession_reports_user_id_idx ON public.confession_reports (user_id);

-- Add a comment to document the table
COMMENT ON TABLE public.confession_reports IS 'Table to store reports for confessions that violate community guidelines';

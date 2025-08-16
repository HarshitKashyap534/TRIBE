-- Add image_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for images if it doesn't exist
-- Note: This needs to be done in the Supabase dashboard or using the Supabase CLI
-- The following is just a reminder of what needs to be done

-- In Supabase dashboard:
-- 1. Go to Storage
-- 2. Create a new bucket called "tribe-media"
-- 3. Set the bucket to public (for this demo)
-- 4. Add the following policy to allow authenticated users to upload:
--    ((bucket_id = 'tribe-media'::text) AND (auth.role() = 'authenticated'::text))

-- Create RLS policies for the posts table to allow reading/writing images
CREATE POLICY "Allow users to upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tribe-media');

CREATE POLICY "Allow public to view images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'tribe-media');

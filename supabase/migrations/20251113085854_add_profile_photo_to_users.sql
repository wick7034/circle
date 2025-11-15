/*
  # Add X Profile Photo to Users

  1. Changes
    - `profile_photo_url` (text) - URL to user's X profile picture
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profile_photo_url'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_photo_url text;
  END IF;
END $$;

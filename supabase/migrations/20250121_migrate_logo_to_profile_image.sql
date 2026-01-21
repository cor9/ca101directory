-- Migrate logo_url to profile_image for listings that have a logo but no profile image
-- This consolidates the two image fields into one

UPDATE listings
SET profile_image = logo_url
WHERE logo_url IS NOT NULL 
  AND logo_url != ''
  AND (profile_image IS NULL OR profile_image = '');

-- Optional: Clear logo_url after migration (uncomment if you want to remove the column later)
-- UPDATE listings SET logo_url = NULL;

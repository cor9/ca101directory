-- Query to find listings with malformed data
-- Run this in Supabase SQL Editor

-- 1. Find listings with URLs in what_you_offer field
SELECT
  id,
  listing_name,
  'URL in what_you_offer' as issue,
  LEFT(what_you_offer, 200) as sample_text,
  status
FROM listings
WHERE what_you_offer LIKE '%http://%'
   OR what_you_offer LIKE '%https://%'
   OR what_you_offer LIKE '%www.%'
ORDER BY listing_name;

-- 2. Find listings with URLs in description field
SELECT
  id,
  listing_name,
  'URL in description' as issue,
  LEFT(description, 200) as sample_text,
  status
FROM listings
WHERE description LIKE '%http://%'
   OR description LIKE '%https://%'
   OR description LIKE '%www.%'
ORDER BY listing_name;

-- 3. Find listings with MapQuest URLs
SELECT
  id,
  listing_name,
  'MapQuest URL found' as issue,
  LEFT(what_you_offer, 200) as sample_text,
  status
FROM listings
WHERE what_you_offer LIKE '%mapquest.com%'
   OR description LIKE '%mapquest.com%'
ORDER BY listing_name;

-- 4. Find listings with HTML or special URL fragments
SELECT
  id,
  listing_name,
  'HTML/Special characters' as issue,
  LEFT(what_you_offer, 200) as sample_text,
  status
FROM listings
WHERE what_you_offer LIKE '%<%'
   OR what_you_offer LIKE '%>%'
   OR what_you_offer LIKE '%#:~:text=%'
   OR description LIKE '%<%'
   OR description LIKE '%>%'
   OR description LIKE '%#:~:text=%'
ORDER BY listing_name;

-- 5. Find listings with extremely long what_you_offer (>500 chars)
SELECT
  id,
  listing_name,
  'Extremely long what_you_offer' as issue,
  LENGTH(what_you_offer) as char_count,
  LEFT(what_you_offer, 200) as sample_text,
  status
FROM listings
WHERE LENGTH(what_you_offer) > 500
ORDER BY LENGTH(what_you_offer) DESC;

-- 6. Combined view of all issues
SELECT
  id,
  listing_name,
  status,
  CASE
    WHEN what_you_offer LIKE '%mapquest.com%' THEN '🔴 MapQuest URL'
    WHEN what_you_offer LIKE '%http://%' OR what_you_offer LIKE '%https://%' THEN '⚠️  URL in text'
    WHEN what_you_offer LIKE '%#:~:text=%' THEN '🔴 URL fragment'
    WHEN LENGTH(what_you_offer) > 500 THEN '⚠️  Very long text'
    ELSE '❓ Unknown issue'
  END as issue_type,
  LEFT(what_you_offer, 300) as sample_text
FROM listings
WHERE what_you_offer LIKE '%http://%'
   OR what_you_offer LIKE '%https://%'
   OR what_you_offer LIKE '%www.%'
   OR what_you_offer LIKE '%mapquest.com%'
   OR what_you_offer LIKE '%#:~:text=%'
   OR LENGTH(what_you_offer) > 500
ORDER BY
  CASE
    WHEN what_you_offer LIKE '%mapquest.com%' THEN 1
    WHEN what_you_offer LIKE '%#:~:text=%' THEN 2
    WHEN LENGTH(what_you_offer) > 500 THEN 3
    ELSE 4
  END,
  listing_name;

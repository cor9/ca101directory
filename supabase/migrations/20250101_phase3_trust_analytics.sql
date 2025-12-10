ALTER TABLE listings
ADD COLUMN trust_level text CHECK (trust_level IN ('unverified','verified','background_checked')) DEFAULT 'unverified';

ALTER TABLE listings
ADD COLUMN background_check_provider text;

ALTER TABLE listings
ADD COLUMN repeat_families_count integer DEFAULT 0;

ALTER TABLE listings
ADD COLUMN response_time_label text;

ALTER TABLE listings
ADD COLUMN last_active_at timestamptz;

ALTER TABLE listings
ADD COLUMN profile_completeness integer DEFAULT 0;

ALTER TABLE listings
ADD COLUMN views_count integer DEFAULT 0;

ALTER TABLE listings
ADD COLUMN contact_clicks integer DEFAULT 0;

ALTER TABLE listings
ADD COLUMN favorites_count integer DEFAULT 0;

ALTER TABLE listings
ADD COLUMN profile_impressions integer DEFAULT 0;

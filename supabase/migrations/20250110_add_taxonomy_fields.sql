ALTER TABLE listings
ADD COLUMN IF NOT EXISTS services_offered text[];

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS techniques text[];

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS specialties text[];

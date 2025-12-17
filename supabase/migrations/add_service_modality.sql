-- Add service_modality column to listings table
-- Values: virtual, in_person, hybrid, unknown

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS service_modality TEXT NOT NULL DEFAULT 'unknown';

-- Add check constraint for valid values
ALTER TABLE listings
ADD CONSTRAINT service_modality_check
CHECK (service_modality IN ('virtual', 'in_person', 'hybrid', 'unknown'));

COMMENT ON COLUMN listings.service_modality IS 'Service delivery modality: virtual, in_person, hybrid, or unknown';


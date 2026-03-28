CREATE TABLE IF NOT EXISTS vendor_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'not_contacted', -- 'not_contacted', 'emailed', 'in_progress', 'upgraded', 'not_interested'
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE vendor_outreach ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vendor outreach" ON vendor_outreach
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_vendor_outreach_updated_at BEFORE UPDATE ON vendor_outreach
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

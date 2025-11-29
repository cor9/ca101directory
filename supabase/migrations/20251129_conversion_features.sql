-- Migration: Add conversion-focused features
-- Date: 2025-11-29
-- Features: Email campaigns, listing views tracking, social proof stats

-- ========================================
-- 1. EMAIL CAMPAIGNS TABLE
-- ========================================
-- Track automated drip email campaigns for unclaimed/free listings

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'unclaimed_drip', -- 'unclaimed_drip', 'upgrade_nurture', etc.

  -- Sequence tracking
  current_step INTEGER NOT NULL DEFAULT 0, -- 0 = not started, 1 = Day 0, 2 = Day 3, 3 = Day 7, 4 = Day 14
  last_email_sent_at TIMESTAMPTZ,
  next_email_due_at TIMESTAMPTZ,

  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed', 'unsubscribed', 'bounced'
  opted_out BOOLEAN DEFAULT FALSE,
  opted_out_at TIMESTAMPTZ,

  -- Engagement tracking
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  last_opened_at TIMESTAMPTZ,
  last_clicked_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate campaigns for same listing
  UNIQUE(listing_id, campaign_type)
);

-- Index for querying campaigns due for next email
CREATE INDEX IF NOT EXISTS idx_campaigns_next_due ON email_campaigns(next_email_due_at, status)
  WHERE status = 'active' AND opted_out = FALSE;

-- Index for listing lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_listing ON email_campaigns(listing_id);

-- ========================================
-- 2. LISTING VIEWS TABLE
-- ========================================
-- Track every time someone views a listing page

CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Viewer info (can be anonymous)
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL if anonymous
  session_id TEXT, -- For deduplication

  -- Context
  referrer TEXT, -- Where they came from
  user_agent TEXT, -- Browser/device info
  ip_address TEXT, -- For analytics (consider privacy)

  -- Timestamp
  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent double-counting same session viewing within short time
  UNIQUE(listing_id, session_id, viewed_at)
);

-- Index for fast listing view counts
CREATE INDEX IF NOT EXISTS idx_views_listing_date ON listing_views(listing_id, viewed_at DESC);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_views_date ON listing_views(viewed_at DESC);

-- ========================================
-- 3. MATERIALIZED VIEW: LISTING STATS
-- ========================================
-- Pre-compute listing statistics for fast vendor dashboard

CREATE MATERIALIZED VIEW IF NOT EXISTS listing_stats AS
SELECT
  l.id AS listing_id,
  l.slug,
  l.listing_name,
  l.plan,
  l.status,
  l.is_claimed,
  l.email AS listing_email,

  -- View counts
  COUNT(DISTINCT lv.id) FILTER (WHERE lv.viewed_at >= NOW() - INTERVAL '30 days') AS views_last_30_days,
  COUNT(DISTINCT lv.id) FILTER (WHERE lv.viewed_at >= NOW() - INTERVAL '7 days') AS views_last_7_days,
  COUNT(DISTINCT lv.id) AS views_all_time,

  -- Growth tracking
  COUNT(DISTINCT lv.id) FILTER (WHERE lv.viewed_at >= NOW() - INTERVAL '60 days' AND lv.viewed_at < NOW() - INTERVAL '30 days') AS views_previous_30_days,

  -- Favorites
  COUNT(DISTINCT f.id) AS favorites_count,

  -- Reviews
  COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'approved') AS reviews_count,
  ROUND(AVG(r.stars) FILTER (WHERE r.status = 'approved'), 1) AS avg_rating,

  -- Updated
  NOW() AS last_refreshed
FROM
  listings l
  LEFT JOIN listing_views lv ON lv.listing_id = l.id
  LEFT JOIN favorites f ON f.listing_id = l.id
  LEFT JOIN reviews r ON r.listing_id = l.id
GROUP BY
  l.id, l.slug, l.listing_name, l.plan, l.status, l.is_claimed, l.email;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_listing_stats_id ON listing_stats(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_stats_plan ON listing_stats(plan);
CREATE INDEX IF NOT EXISTS idx_listing_stats_views ON listing_stats(views_last_30_days DESC);

-- ========================================
-- 4. FUNCTION: REFRESH LISTING STATS
-- ========================================
-- Refresh materialized view (call this periodically via cron)

CREATE OR REPLACE FUNCTION refresh_listing_stats()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY listing_stats;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. FUNCTION: UPDATE EMAIL CAMPAIGN
-- ========================================
-- Helper function to update campaign status after sending email

CREATE OR REPLACE FUNCTION update_email_campaign(
  p_campaign_id UUID,
  p_step INTEGER,
  p_days_until_next INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE email_campaigns
  SET
    current_step = p_step,
    last_email_sent_at = NOW(),
    next_email_due_at = CASE
      WHEN p_days_until_next IS NOT NULL THEN NOW() + (p_days_until_next || ' days')::INTERVAL
      ELSE NULL
    END,
    emails_sent = emails_sent + 1,
    updated_at = NOW()
  WHERE id = p_campaign_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on new tables
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Email campaigns: Only admins can view all campaigns
CREATE POLICY "Admins can view all email campaigns" ON email_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Listing views: Anyone can insert (for tracking), only admins can view all
CREATE POLICY "Anyone can track listing views" ON listing_views
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view all listing views" ON listing_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Vendors can view their own listing views" ON listing_views
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings
      WHERE owner_id = auth.uid()
    )
  );

-- ========================================
-- 7. TRIGGER: AUTO-CREATE CAMPAIGN
-- ========================================
-- Automatically create email campaign when listing goes live

CREATE OR REPLACE FUNCTION create_email_campaign_on_listing_live()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create campaign if listing is newly live and unclaimed
  IF NEW.status = 'Live' AND (OLD.status IS NULL OR OLD.status != 'Live')
     AND NEW.is_claimed = FALSE AND NEW.email IS NOT NULL THEN

    INSERT INTO email_campaigns (
      listing_id,
      email_address,
      campaign_type,
      current_step,
      next_email_due_at,
      status
    ) VALUES (
      NEW.id,
      NEW.email,
      'unclaimed_drip',
      0, -- Not started yet (Day 0 email sent immediately via existing flow)
      NOW(), -- Due now (Day 0 sent immediately)
      'active'
    )
    ON CONFLICT (listing_id, campaign_type) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_campaign_on_live
  AFTER INSERT OR UPDATE OF status ON listings
  FOR EACH ROW
  EXECUTE FUNCTION create_email_campaign_on_listing_live();

-- ========================================
-- 8. TRIGGER: PAUSE CAMPAIGN WHEN CLAIMED
-- ========================================
-- Stop email campaigns when listing is claimed or upgraded

CREATE OR REPLACE FUNCTION pause_campaign_on_claim_or_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  -- Pause campaigns when listing is claimed or upgraded to paid
  IF (NEW.is_claimed = TRUE OR NEW.plan != 'free')
     AND (OLD.is_claimed = FALSE OR OLD.plan = 'free') THEN

    UPDATE email_campaigns
    SET
      status = 'completed',
      updated_at = NOW()
    WHERE
      listing_id = NEW.id
      AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pause_campaign
  AFTER UPDATE OF is_claimed, plan ON listings
  FOR EACH ROW
  EXECUTE FUNCTION pause_campaign_on_claim_or_upgrade();

-- ========================================
-- 9. INITIAL DATA POPULATION
-- ========================================
-- Create campaigns for existing unclaimed live listings

INSERT INTO email_campaigns (
  listing_id,
  email_address,
  campaign_type,
  current_step,
  next_email_due_at,
  status
)
SELECT
  id,
  email,
  'unclaimed_drip',
  1, -- Already sent Day 0 (they're live)
  NOW() + INTERVAL '3 days', -- Next email in 3 days
  'active'
FROM listings
WHERE
  status = 'Live'
  AND is_claimed = FALSE
  AND email IS NOT NULL
  AND id NOT IN (SELECT listing_id FROM email_campaigns WHERE campaign_type = 'unclaimed_drip')
ON CONFLICT (listing_id, campaign_type) DO NOTHING;

-- ========================================
-- END MIGRATION
-- ========================================

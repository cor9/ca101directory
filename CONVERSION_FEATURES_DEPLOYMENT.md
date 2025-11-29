# Conversion Features Deployment Guide

**Date:** November 29, 2025
**Features:** Automated Email Campaigns, Listing Views Tracking, Vendor ROI Dashboard, Social Proof Stats, Hot Leads

---

## 🎯 What Was Built

We've implemented 4 high-leverage conversion features to help grow revenue:

### 1. **Automated Email Campaign Manager** (The Money Printer)
- **4-step drip sequence** for unclaimed free listings
  - **Day 0:** "Your listing is live!" (existing `listing-live` email)
  - **Day 3:** "Complete your profile to appear higher"
  - **Day 7:** "Here's how parents are finding you" (with view count)
  - **Day 14:** "Upgrade to Pro - here's what you're missing"
- Automatically pauses when listing is claimed or upgraded
- Tracks opens, clicks, and opt-outs
- Runs on cron schedule (no manual intervention)

### 2. **Vendor ROI Dashboard** (Simplified)
- Shows vendors: **"Your listing was viewed X times this month"**
- Displays growth percentage vs last month
- Auto-upsell CTA for free users with high traffic
- Added to `/dashboard/vendor` page

### 3. **Social Proof & FOMO Generator**
- Live stats on pricing/claim pages:
  - "12 vendors upgraded to Pro this week"
  - "47 new professionals joined this month"
  - "Join 150+ Pro members"
- Creates urgency and social validation
- Added to `/claim-upgrade/[slug]` pages

### 4. **Hot Leads Dashboard** (Manual Outreach)
- SQL query identifying high-traffic free listings
- Shows: listing name, views, email, potential revenue
- One-click "Email" button with pre-filled outreach template
- Added to `/dashboard/admin/analytics` page
- Target: 15+ views in last 7 days

---

## 📦 Files Created/Modified

### New Files
```
supabase/migrations/20251129_conversion_features.sql
src/data/email-campaigns.ts
src/data/listing-views.ts
src/data/conversion-stats.ts
src/app/api/cron/email-campaigns/route.ts
src/app/api/track-view/route.ts
src/components/vendor/vendor-roi-stats.tsx
src/components/conversion/social-proof-stats.tsx
src/components/admin/hot-leads-table.tsx
src/components/analytics/view-tracker.tsx
emails/listing-day3-complete-profile.tsx
emails/listing-day7-traffic-update.tsx
emails/listing-day14-upgrade-offer.tsx
```

### Modified Files
```
src/lib/mail.ts (added drip email functions)
src/app/(website)/(protected)/dashboard/vendor/page.tsx (added ROI widget)
src/app/(website)/(public)/claim-upgrade/[slug]/page.tsx (added social proof)
src/app/(website)/(protected)/dashboard/admin/analytics/page.tsx (added hot leads)
src/app/(website)/(public)/listing/[slug]/page.tsx (added view tracking)
```

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration

Run the migration SQL in your Supabase SQL Editor:

```bash
# Copy the migration file to Supabase dashboard
cat supabase/migrations/20251129_conversion_features.sql
```

Or if using Supabase CLI:
```bash
supabase db push
```

**What it creates:**
- `email_campaigns` table
- `listing_views` table
- `listing_stats` materialized view
- Triggers for auto-creating campaigns
- RLS policies
- Helper functions

### Step 2: Add Environment Variables

Add to your `.env` or Vercel environment variables:

```bash
# Already exists (verify it's set):
RESEND_API_KEY=re_...

# New - for cron job authentication:
CRON_SECRET=your_secure_random_string_here
```

Generate a secure CRON_SECRET:
```bash
openssl rand -base64 32
```

### Step 3: Deploy to Vercel

```bash
# Commit changes
git add .
git commit -m "feat: add conversion-focused admin dashboard features"

# Push to your branch
git push origin claude/admin-dashboard-conversion-features-01Q3rAjegadv8Dsye2oYdDQV

# Deploy (Vercel will auto-deploy on push)
```

### Step 4: Set Up Cron Jobs in Vercel

1. Go to your Vercel project
2. Navigate to **Settings** → **Cron Jobs**
3. Add the following cron job:

**Email Campaigns Processor:**
```
Path: /api/cron/email-campaigns
Schedule: 0 */6 * * * (every 6 hours)
Or: 0 10 * * * (daily at 10am UTC)
```

**Listing Stats Refresh (optional):**
```
Path: /api/cron/refresh-stats
Schedule: 0 0 * * * (daily at midnight)
```

4. Set the `CRON_SECRET` environment variable in Vercel

### Step 5: Verify Cron Job Works

Test the cron endpoint manually:

```bash
curl -X POST https://yourdomain.com/api/cron/email-campaigns \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "success": true,
  "message": "Email campaigns processed",
  "total": 5,
  "successful": 5,
  "failed": 0
}
```

### Step 6: Backfill Existing Campaigns

The migration automatically creates campaigns for existing unclaimed listings.

To verify:
```sql
SELECT COUNT(*) FROM email_campaigns WHERE status = 'active';
```

---

## 🔧 Configuration

### Email Campaign Timing

Default schedule (can be changed in migration):
- Day 0: Immediate (existing flow)
- Day 3: 3 days after Day 0
- Day 7: 4 days after Day 3
- Day 14: 7 days after Day 7

### Hot Leads Threshold

Default: 15+ views in last 7 days

To change, edit:
```typescript
// src/components/admin/hot-leads-table.tsx
const hotLeads = await getHotLeads(20); // Change to 20
```

### View Tracking Delay

Default: 2 seconds (to avoid bots)

To change, edit:
```typescript
// src/components/analytics/view-tracker.tsx
const timer = setTimeout(() => {
  // Track view
}, 3000); // Change to 3 seconds
```

---

## 📊 Monitoring & Testing

### 1. Test Email Campaigns

**Check campaign status:**
```sql
SELECT
  listing_id,
  current_step,
  status,
  next_email_due_at,
  emails_sent
FROM email_campaigns
ORDER BY next_email_due_at ASC
LIMIT 10;
```

**Manually trigger next step:**
```sql
UPDATE email_campaigns
SET next_email_due_at = NOW()
WHERE id = 'campaign-id-here';
```

### 2. Test View Tracking

Visit any listing page and check:
```sql
SELECT * FROM listing_views
WHERE listing_id = 'your-listing-id'
ORDER BY viewed_at DESC
LIMIT 5;
```

### 3. Test Vendor ROI Widget

1. Log in as a vendor
2. Go to `/dashboard/vendor`
3. Should see "Your Listing Performance" widget
4. Check view count matches database

### 4. Test Social Proof

1. Go to any `/claim-upgrade/[slug]` page
2. Should see stats like "X vendors upgraded this week"
3. Verify data matches:
```sql
SELECT COUNT(*) FROM listings
WHERE plan != 'free'
AND updated_at >= NOW() - INTERVAL '7 days';
```

### 5. Test Hot Leads

1. Log in as admin
2. Go to `/dashboard/admin/analytics`
3. Scroll to "Revenue Opportunities"
4. Should see free listings with 15+ views
5. Click "Email" button - should open mailto link

---

## 🐛 Troubleshooting

### Email Campaigns Not Sending

**Check cron job logs:**
- Vercel Dashboard → Deployments → Functions → `/api/cron/email-campaigns`

**Common issues:**
1. `CRON_SECRET` not set → Add to Vercel env vars
2. `RESEND_API_KEY` missing → Verify in env vars
3. No campaigns due → Check `next_email_due_at` dates
4. RLS blocking → Verify admin role has access

**Manual test:**
```typescript
// In Vercel Function Logs
import { getCampaignsDueForEmail } from '@/data/email-campaigns';
const campaigns = await getCampaignsDueForEmail();
console.log('Campaigns due:', campaigns.length);
```

### View Tracking Not Working

**Check API endpoint:**
```bash
curl https://yourdomain.com/api/track-view
```

Should return:
```json
{
  "status": "ok",
  "endpoint": "track-view"
}
```

**Check RLS policies:**
```sql
-- Test if anyone can insert
INSERT INTO listing_views (listing_id, session_id)
VALUES ('test-id', 'test-session');
```

### Vendor ROI Widget Shows 0 Views

**Refresh materialized view:**
```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY listing_stats;
```

**Or call function:**
```sql
SELECT refresh_listing_stats();
```

### Hot Leads Shows No Results

**Lower threshold temporarily:**
```typescript
const hotLeads = await getHotLeads(5); // Lower to 5 views
```

**Check if any free listings have views:**
```sql
SELECT l.listing_name, COUNT(lv.id) as views
FROM listings l
LEFT JOIN listing_views lv ON lv.listing_id = l.id
WHERE l.plan = 'free'
  AND l.status = 'Live'
  AND lv.viewed_at >= NOW() - INTERVAL '7 days'
GROUP BY l.id
ORDER BY views DESC;
```

---

## 📈 Expected Results

### Week 1
- Email campaigns start running for all unclaimed listings
- View tracking begins accumulating data
- Social proof stats show on pricing pages
- Hot leads dashboard populated

### Week 2-4
- Day 3, 7, 14 emails sent automatically
- Vendors see ROI stats on their dashboard
- Admin can target hot leads manually
- First conversions from drip campaigns

### Month 2-3
- Drip campaigns complete full cycles
- View data shows trends
- Hot leads list grows
- Conversion rate improves

---

## 🎯 Success Metrics

Track these metrics to measure impact:

1. **Email Campaign Performance**
   ```sql
   SELECT
     current_step,
     COUNT(*) as campaigns,
     AVG(emails_opened) as avg_opens,
     AVG(emails_clicked) as avg_clicks
   FROM email_campaigns
   GROUP BY current_step;
   ```

2. **Conversion Rate**
   ```sql
   SELECT
     COUNT(*) FILTER (WHERE plan != 'free') * 100.0 / COUNT(*) as conversion_rate
   FROM listings
   WHERE created_at >= NOW() - INTERVAL '30 days';
   ```

3. **Hot Leads Converted**
   - Manually track emails sent from hot leads table
   - Track which vendors upgrade after outreach

4. **View Growth**
   ```sql
   SELECT
     DATE(viewed_at) as date,
     COUNT(*) as views
   FROM listing_views
   WHERE viewed_at >= NOW() - INTERVAL '30 days'
   GROUP BY DATE(viewed_at)
   ORDER BY date;
   ```

---

## 🚨 Important Notes

1. **Do NOT modify campaign triggers** - they auto-pause on claim/upgrade
2. **CRON_SECRET is required** - cron jobs won't run without it
3. **Resend API limits** - Monitor email sending limits (5000/month on free)
4. **RLS policies** - Don't disable, they protect user data
5. **Materialized view** - Refresh daily for performance

---

## 📞 Support

For issues or questions:
1. Check Vercel function logs first
2. Review Supabase database logs
3. Test endpoints manually with curl
4. Check this guide's troubleshooting section

---

## ✅ Deployment Checklist

- [ ] Database migration run successfully
- [ ] CRON_SECRET environment variable added
- [ ] Cron job configured in Vercel
- [ ] Code deployed to production
- [ ] Email campaigns table populated
- [ ] View tracking working on listing pages
- [ ] Vendor ROI widget displays on dashboard
- [ ] Social proof shows on claim pages
- [ ] Hot leads table shows in admin analytics
- [ ] Cron job tested manually
- [ ] First test email sent successfully

---

**Deployment completed on:** _________________
**Deployed by:** _________________
**Verified by:** _________________

# 📦 Phase 4 – Launch Production Version (Supabase + Vercel)

This phase transitions the Child Actor 101 Directory from staging to a fully functional production environment. It includes deployment, database finalization, Stripe plan verification, basic RLS, and dashboard routing.

## ✅ Assumptions

- Supabase is used for the database/backend
- Vercel hosts the front end
- Stripe is live with active plans (price_ IDs)
- Blob storage is Vercel (not Supabase buckets)
- This is pre-content phase (Phase 5), but content structure is partially scaffolded

---

## 1. 🏁 Deploy to Production

### GitHub & Vercel Setup
- [ ] Confirm GitHub repo connected to Vercel production environment
- [ ] Push main branch or deploy latest approved branch to https://directory.childactor101.com
- [ ] Verify custom domain configuration in Vercel

### Environment Variables Configuration
Configure the following environment variables in Vercel production environment:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_live_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_live_stripe_publishable_key

# Vercel Blob Storage
VERCEL_BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
VERCEL_BLOB_BUCKET_NAME=your_blob_bucket_name

# NextAuth Configuration
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://directory.childactor101.com

# Email Configuration
RESEND_API_KEY=your_resend_api_key

# Feature Flags (Choose deployment mode)
# For Full Directory Mode:
NEXT_PUBLIC_ENABLE_PARENT_AUTH=true
NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_FAVORITES=true

# For Directory Lite Mode:
# NEXT_PUBLIC_DIRECTORY_LITE=true
```

---

## 2. 🛠️ Supabase: Final Schema Audit

### Tables Confirmed
Verify these tables exist in your production Supabase database:

- [ ] `listings` - Main directory listings
- [ ] `submissions` - Vendor submissions
- [ ] `plans` - Pricing plans
- [ ] `claims` - Vendor claims
- [ ] `profiles` - User profiles
- [ ] `favorites` - Parent favorites
- [ ] `reviews` - Parent reviews
- [ ] `stripe_customers` - Stripe customer data
- [ ] `stripe_subscriptions` - Stripe subscription data

### Indexes / Constraints
Add these constraints and indexes:

```sql
-- Unique constraints
ALTER TABLE listings ADD CONSTRAINT unique_slug UNIQUE (slug);
ALTER TABLE favorites ADD CONSTRAINT unique_user_listing UNIQUE (user_id, listing_id);
ALTER TABLE reviews ADD CONSTRAINT unique_user_listing_review UNIQUE (user_id, listing_id);

-- Foreign key constraints
ALTER TABLE listings ADD CONSTRAINT fk_listings_owner FOREIGN KEY (owner_id) REFERENCES profiles(id);
ALTER TABLE submissions ADD CONSTRAINT fk_submissions_listing FOREIGN KEY (listing_id) REFERENCES listings(id);
ALTER TABLE claims ADD CONSTRAINT fk_claims_listing FOREIGN KEY (listing_id) REFERENCES listings(id);
ALTER TABLE claims ADD CONSTRAINT fk_claims_user FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE favorites ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE favorites ADD CONSTRAINT fk_favorites_listing FOREIGN KEY (listing_id) REFERENCES listings(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_listing FOREIGN KEY (listing_id) REFERENCES listings(id);

-- Performance indexes
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_owner_id ON listings(owner_id);
CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_claims_status ON claims(status);
```

### ENUM Types
Ensure these ENUM types exist:

```sql
-- Plan types
CREATE TYPE plan_type AS ENUM ('Free', 'Basic', 'Pro', 'Premium');

-- Listing status
CREATE TYPE listing_status AS ENUM ('Pending', 'Live', 'Rejected', 'Inactive');

-- Review status
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Claim status
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');

-- User roles
CREATE TYPE user_role AS ENUM ('guest', 'parent', 'vendor', 'admin');
```

---

## 3. 🔐 Supabase RLS Setup

### Apply RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings policies
CREATE POLICY "Public can view live listings" ON listings
    FOR SELECT USING (status = 'Live' AND active = true);

CREATE POLICY "Users can view own listings" ON listings
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update own listings" ON listings
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Service role can insert listings" ON listings
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Submissions policies
CREATE POLICY "Users can view own submissions" ON submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Claims policies
CREATE POLICY "Users can view own claims" ON claims
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON claims
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all claims" ON claims
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Favorites policies
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own reviews" ON reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" ON reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Stripe policies
CREATE POLICY "Service role can manage stripe data" ON stripe_customers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage subscriptions" ON stripe_subscriptions
    FOR ALL USING (auth.role() = 'service_role');
```

---

## 4. 💳 Stripe Configuration Verification

### Verify Stripe Plans
Confirm these plans exist in your live Stripe account:

- [ ] **Free Plan**: $0/forever
- [ ] **Basic Plan**: $25/month
- [ ] **Pro Plan**: $50/month
- [ ] **Premium Plan**: $90/month

### Update Price IDs
Update the price IDs in `src/config/price.ts`:

```typescript
export const PRICE_IDS = {
  FREE: 'price_free_plan', // or null for free
  BASIC: 'price_basic_plan',
  PRO: 'price_pro_plan',
  PREMIUM: 'price_premium_plan',
} as const;
```

### Webhook Configuration
- [ ] Configure Stripe webhook endpoint: `https://directory.childactor101.com/api/webhooks/stripe`
- [ ] Enable these events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

---

## 5. 🎯 Feature Flag Configuration

### Choose Deployment Mode

**Option A: Full Directory Mode (All Features)**
```env
NEXT_PUBLIC_ENABLE_PARENT_AUTH=true
NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_FAVORITES=true
```

**Option B: Directory Lite Mode (Vendor/Guest Only)**
```env
NEXT_PUBLIC_DIRECTORY_LITE=true
# Automatically disables all parent features
```

### Individual Feature Control
```env
NEXT_PUBLIC_ENABLE_PARENT_AUTH=false
NEXT_PUBLIC_ENABLE_REVIEWS=false
NEXT_PUBLIC_ENABLE_FAVORITES=false
NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD=false
```

---

## 6. 🧪 Production Testing Checklist

### Core Functionality
- [ ] Homepage loads correctly
- [ ] Directory listings display with filtering
- [ ] Search functionality works
- [ ] Category pages load
- [ ] Individual listing pages display

### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Role-based dashboard routing works
- [ ] Session persistence works

### Vendor Features
- [ ] Listing submission form works
- [ ] Image upload to Vercel Blob works
- [ ] Vendor dashboard displays correctly
- [ ] Listing management works

### Payment Integration
- [ ] Stripe checkout works
- [ ] Webhook processing works
- [ ] Subscription status updates
- [ ] Plan upgrades work

### Admin Features
- [ ] Admin dashboard accessible
- [ ] Content moderation works
- [ ] User management works

### Parent Features (if enabled)
- [ ] Parent registration works
- [ ] Favorites system works
- [ ] Review submission works
- [ ] Parent dashboard displays

---

## 7. 📊 Monitoring & Analytics

### Set Up Monitoring
- [ ] Configure Vercel Analytics
- [ ] Set up error tracking (Sentry or similar)
- [ ] Monitor Supabase usage and performance
- [ ] Track Stripe webhook success rates

### Key Metrics to Monitor
- [ ] Page load times
- [ ] Database query performance
- [ ] Stripe payment success rates
- [ ] User registration and login rates
- [ ] Listing submission rates

---

## 8. 🚀 Go-Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database schema finalized
- [ ] RLS policies applied
- [ ] Stripe plans verified
- [ ] Feature flags configured
- [ ] Custom domain configured
- [ ] SSL certificate active

### Launch Day
- [ ] Deploy to production
- [ ] Run production testing checklist
- [ ] Monitor error rates
- [ ] Verify payment processing
- [ ] Test user registration flow
- [ ] Confirm admin access

### Post-Launch
- [ ] Monitor system performance
- [ ] Check error logs
- [ ] Verify webhook processing
- [ ] Monitor user feedback
- [ ] Plan Phase 5 content strategy

---

## 9. 🔧 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies
- Confirm table permissions

**Stripe Integration Issues**
- Verify webhook endpoint
- Check price IDs
- Confirm webhook events

**Image Upload Issues**
- Verify Vercel Blob token
- Check bucket permissions
- Confirm file size limits

**Authentication Issues**
- Verify NextAuth configuration
- Check session persistence
- Confirm role assignments

---

## 10. 📞 Support & Maintenance

### Regular Maintenance
- [ ] Monitor database performance
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys
- [ ] Backup database regularly
- [ ] Monitor Stripe webhook logs

### Support Channels
- **Technical Issues**: GitHub Issues
- **Business Questions**: hello@childactor101.com
- **Urgent Issues**: Direct contact

---

## 🎉 Success Criteria

Phase 4 is complete when:
- [ ] Production deployment is live and stable
- [ ] All core functionality works in production
- [ ] Stripe payments process successfully
- [ ] User registration and authentication work
- [ ] Admin dashboard is accessible and functional
- [ ] Feature flags work as expected
- [ ] Monitoring and error tracking are active

**Ready for Phase 5: Content and Collections for Growth, SEO, and Engagement**

---

*Last updated: January 2025 - Phase 4 Production Deployment Guide*

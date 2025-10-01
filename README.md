# Child Actor 101 Directory

A curated directory of vetted coaches, photographers, editors, and industry professionals specializing in youth acting. Built with Next.js, Supabase, and Stripe payment integration.

## 🎭 Project Overview

**Child Actor 101 Directory** is a specialized platform that connects parents with trusted acting professionals for their children. Every listing is hand-picked for quality and safety, ensuring families can find the right professionals for their child's acting journey.

### Key Features
- **Vetted Professionals**: Every listing is manually reviewed for quality and safety
- **Specialized Categories**: Acting coaches, photographers, editors, and industry professionals
- **Vendor Payment Plans**: Free, Basic ($25/mo), Pro ($50/mo), Premium ($90/mo)
- **Parent-Friendly Interface**: Easy search and filtering for families
- **Safety First**: Background checks and verification processes
- **UUID-Based Architecture**: Scalable database with proper relationships
- **Tri-Role System**: Guest, Parent, Vendor, and Admin roles with distinct permissions
- **Smart Dashboard Routing**: Automatic redirection based on user role and listing ownership
- **Permission-Based Access**: Granular permissions with reusable components
- **Feature Flag System**: Deploy in Directory Lite mode (vendor/guest only) or Full Directory mode
- **Review System**: Parent reviews with admin moderation workflow
- **Favorites System**: Save and manage favorite listings
- **Real-Time Updates**: Live data synchronization with Supabase

## 🚀 Current Status

### ✅ **PRODUCTION READY**
- **Core Directory Functionality**: Homepage, search, categories, listings
- **Supabase Integration**: Complete UUID-based database with foreign key relationships
- **Child Actor 101 Branding**: Custom colors, fonts, and content
- **Stripe Payment Plans**: Live payment processing for vendor subscriptions
- **Authentication System**: Email-only auth with role-based access control
- **Vendor Management**: Claim listings, upgrade plans, manage profiles
- **Review System**: Parent reviews with admin moderation
- **Favorites System**: Save and manage favorite listings
- **Admin Dashboard**: Content moderation and user management
- **Feature Flag System**: Deploy in Directory Lite or Full Directory mode
- **Responsive Design**: Mobile and desktop optimized
- **SEO Optimization**: Meta tags and structured data

### 🎯 **LATEST UPDATES (January 2025)**
- **Phase 3 Complete**: Directory Lite mode with live Supabase data and advanced filtering
- **Phase 4 Complete**: Parent feature reintroduction with reviews and favorites
- **UUID Migration**: Complete migration from Airtable to Supabase with UUID primary keys
- **Database Schema**: Proper foreign key relationships and RLS policies
- **Performance**: Optimized queries with proper indexes
- **Security**: Enhanced authentication and authorization
- **Scalability**: UUID-based architecture for future growth
- **Tri-Role System**: Complete role-based authentication (Guest, Parent, Vendor, Admin)
- **Smart Dashboard Routing**: Automatic redirection based on user role and listing ownership
- **Permission System**: Granular permissions with reusable components
- **🚨 CRITICAL FIXES**: Database field name mismatches resolved - production errors fixed
- **Production Ready**: All database queries working with correct field names
- **Build Success**: 300/300 pages generated without errors
- **Feature Flag System**: Comprehensive toggle system for deployment modes
- **Review System**: Parent reviews with admin moderation workflow
- **Favorites System**: Save and manage favorite listings with real-time updates

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL with UUID primary keys)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel
- **Authentication**: Supabase Auth (email-only)
- **Email**: Resend
- **Image Storage**: Vercel Blob

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (website)/         # Public website pages
│   │   ├── (public)/      # Public pages (home, search, categories)
│   │   └── (protected)/   # Protected pages (submit, edit)
│   └── api/               # API routes
├── components/            # React components
├── config/                # Site configuration
├── data/                  # Data layer (Supabase integration)
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🔧 Setup Instructions

### 1. Environment Variables
Create `.env.local` with:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 2. Supabase Setup
1. **Create Supabase Project**: Set up a new project at [supabase.com](https://supabase.com)
2. **Run Migration**: Execute `supabase-uuid-migration.sql` in the Supabase SQL Editor
3. **Import Data**: Import your CSV data into the new UUID-based tables
4. **Configure RLS**: Review and adjust Row Level Security policies as needed

### 3. Feature Flag Configuration
Configure deployment mode via environment variables:

**Full Directory Mode (All Features):**
```env
NEXT_PUBLIC_ENABLE_PARENT_AUTH=true
NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_FAVORITES=true
```

**Directory Lite Mode (Vendor/Guest Only):**
```env
NEXT_PUBLIC_DIRECTORY_LITE=true
# Automatically disables all parent features
```

### 4. Stripe Configuration
Configure payment plans in `src/config/price.ts`:
- Free Plan: $0/forever
- Basic Plan: $25/month
- Pro Plan: $50/month  
- Premium Plan: $90/month
- Annual plans available with 2-month savings

### 5. Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📚 Documentation

- **Setup Guide**: `SETUP_GUIDE.md` - Comprehensive setup instructions
- **Supabase Migration**: `supabase-uuid-migration.sql` - Database schema with UUIDs
- **Migration Summary**: `UUID-MIGRATION-SUMMARY.md` - Complete migration details
- **Tri-Role System**: `tri-role-data-models.sql` - Complete role-based database schema
- **Deployment**: `VERCEL_DEPLOYMENT.md` - Vercel deployment checklist
- **Context Decisions**: `FOR CURSOR/context_Decisions.md` - Development history and decisions

## 🎯 User Flows

### For Guests
1. **Browse Directory**: Search and filter by category, location, price
2. **View Listings**: See detailed professional profiles with reviews
3. **Plan-Based Sorting**: Premium listings appear first
4. **Advanced Filtering**: Filter by category, region, state, 101 Approved badge

### For Parents
1. **Browse Directory**: Search and filter by category, location, price
2. **Save Favorites**: Bookmark preferred professionals
3. **Write Reviews**: Rate and review vendors (pending admin approval)
4. **Track Progress**: Monitor your child's acting journey
5. **Dashboard Access**: Personalized dashboard with saved content and activity

### For Vendors
1. **Choose Plan**: Select Free, Basic, Pro, or Premium subscription
2. **Submit Listing**: Create new listing or claim existing profile
3. **Get Verified**: Submit for "101 Approved" badge
4. **Manage Listings**: Update availability, pricing, services
5. **View Analytics**: Track listing performance and reviews
6. **Dashboard Access**: Role-based dashboard with listing management tools

### For Admins
1. **Content Moderation**: Approve/reject reviews, claims, and suggestions
2. **User Management**: Manage user accounts and roles
3. **Platform Analytics**: Track system usage and performance
4. **System Configuration**: Manage feature flags and platform settings

## 🎨 Branding

- **Primary Color**: #FF6B35 (Orange)
- **Secondary Color**: #004E89 (Blue)
- **Accent Color**: #F7931E (Gold)
- **Font**: Inter (Google Fonts)
- **Logo**: Child Actor 101 branding

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with `pnpm build` command
4. Configure custom domain (optional)

### Environment Variables for Production
Ensure all required environment variables are set in Vercel:
- Supabase database credentials
- Stripe payment keys
- NextAuth configuration
- Resend email API key
- Vercel Blob storage token

## 📋 Additional Documentation
- [Context Decisions](FOR%20CURSOR/context_Decisions.md) - Development history and decisions
- [Guardrails](FOR%20CURSOR/Guardrails.md) - Development guidelines and restrictions
- [Vercel Guardrails](FOR%20CURSOR/Vercel-Guardrails.md) - Deployment safety guidelines

## 📈 Future Features

- **Phase 5**: Content and collections for growth, SEO, and engagement
- **Advanced Search**: Location-based filtering, price ranges
- **Booking System**: Integrated scheduling
- **Mobile App**: React Native version
- **Analytics Dashboard**: Enhanced vendor performance metrics
- **Multi-language**: Spanish support for diverse communities
- **API Integration**: Third-party service integrations
- **Advanced Filtering**: More granular search options
- **Notification System**: Email and push notifications
- **Social Features**: Community forums and discussions

## 🤝 Contributing

This project is built on the MkDirs template. For core template updates, refer to the original [Mkdirs documentation](https://docs.mkdirs.com).

## 📞 Support

- **Email**: hello@childactor101.com
- **Documentation**: See `SETUP_GUIDE.md` for detailed instructions
- **Issues**: Use GitHub Issues for bug reports

## 📄 License

Built on MkDirs template. See original [License](LICENSE) for details.

---

**Built with ❤️ for the Child Actor 101 community**

*Every child deserves access to safe, professional acting resources.*

---

## 🎯 **Quick Start**

1. **Clone the repository**
2. **Set up environment variables** (see Setup Instructions)
3. **Run Supabase migration** (`supabase-uuid-migration.sql`)
4. **Install dependencies**: `pnpm install`
5. **Start development**: `pnpm dev`
6. **Build for production**: `pnpm build`

## 🚀 **Live Demo**

- **Production**: [directory.childactor101.com](https://directory.childactor101.com)
- **Staging**: [ca101-directory.vercel.app](https://ca101-directory.vercel.app)

---

*Last updated: January 2025 - Phase 4 Complete: Parent Feature Reintroduction*

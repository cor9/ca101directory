# Child Actor 101 Directory

A curated directory of vetted coaches, photographers, editors, and industry professionals specializing in youth acting. Built on the MkDirs template with Airtable CMS and Stripe payment integration.

## 🎭 Project Overview

**Child Actor 101 Directory** is a specialized platform that connects parents with trusted acting professionals for their children. Every listing is hand-picked for quality and safety, ensuring families can find the right professionals for their child's acting journey.

### Key Features
- **Vetted Professionals**: Every listing is manually reviewed for quality and safety
- **Specialized Categories**: Acting coaches, photographers, editors, and industry professionals
- **Vendor Payment Plans**: Basic ($29/mo), Pro ($49/mo), Premium ($99/mo), Add-on ($25)
- **Parent-Friendly Interface**: Easy search and filtering for families
- **Safety First**: Background checks and verification processes

## 🚀 Current Status

### ✅ **COMPLETED & WORKING**
- **Core Directory Functionality**: Homepage, search, categories, listings
- **Airtable Integration**: Data layer successfully implemented
- **Child Actor 101 Branding**: Custom colors, fonts, and content
- **Stripe Payment Plans**: Ready for vendor subscriptions
- **Responsive Design**: Mobile and desktop optimized
- **SEO Optimization**: Meta tags and structured data

### 🔄 **IN PROGRESS**
- **Sanity Dependencies**: Removing remaining Sanity CMS dependencies
- **Secondary Features**: Blog functionality (not core to directory)

### 📋 **NEXT STEPS**
- **Deploy to Vercel**: Core functionality ready for production
- **Airtable Setup**: Configure base with Listings and Categories tables
- **Stripe Configuration**: Set up payment webhooks
- **Content Migration**: Add initial listings and categories

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Airtable (replacing Sanity)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel
- **Authentication**: NextAuth.js (simplified)
- **Email**: Resend

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
├── data/                  # Data layer (Airtable integration)
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🔧 Setup Instructions

### 1. Environment Variables
Create `.env.local` with:
```bash
# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
```

### 2. Airtable Setup
Follow the detailed guide in `AIRTABLE_SETUP.md` to:
- Create Listings table with required fields
- Create Categories table with required fields
- Set up proper field types and relationships

### 3. Stripe Configuration
Configure payment plans in `src/config/price.ts`:
- Basic Plan: $29/month
- Pro Plan: $49/month  
- Premium Plan: $99/month
- 101 Badge Add-on: $25 one-time

### 4. Development
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
- **Airtable Schema**: `AIRTABLE_SETUP.md` - Database structure
- **Deployment**: `VERCEL_DEPLOYMENT.md` - Vercel deployment checklist

## 🎯 User Flows

### For Parents
1. **Browse Directory**: Search and filter by category, location, price
2. **View Listings**: See detailed professional profiles with reviews
3. **Contact Professionals**: Direct communication through platform
4. **Book Services**: Schedule sessions and manage bookings

### For Vendors
1. **Choose Plan**: Select Basic, Pro, or Premium subscription
2. **Create Profile**: Add business details, photos, services
3. **Get Verified**: Submit for "101 Approved" badge
4. **Manage Listings**: Update availability, pricing, services

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
- Airtable API credentials
- Stripe payment keys
- NextAuth configuration
- Resend email API key

## 📈 Future Features

- **Advanced Search**: Location-based filtering, price ranges
- **Reviews & Ratings**: Parent feedback system
- **Booking System**: Integrated scheduling
- **Mobile App**: React Native version
- **Analytics Dashboard**: Vendor performance metrics
- **Multi-language**: Spanish support for diverse communities

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
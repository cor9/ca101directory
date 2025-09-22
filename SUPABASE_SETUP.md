# Supabase Setup Guide for Child Actor 101 Directory

## 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## 2. Get Your Project Credentials
1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (for server-side operations)

## 3. Set Environment Variables
Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Set Up Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create tables and policies

## 5. Configure Authentication
1. Go to Authentication > Settings
2. Configure the following:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain
   - **Email**: Configure SMTP settings for email verification

## 6. Enable Email Authentication
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates if needed

## 7. Test the Setup
1. Start your development server: `npm run dev`
2. Go to `/auth/register`
3. Try creating a new account
4. Check your Supabase dashboard to see the user created

## Free Tier Limits
- **Database**: 500MB storage
- **Bandwidth**: 5GB/month
- **Auth users**: 50,000 monthly active users
- **API requests**: 50,000 requests/month

This should be more than enough for a directory website!

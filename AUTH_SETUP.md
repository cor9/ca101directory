# Authentication Setup Guide

## Overview
The Child Actor 101 Directory now supports three authentication methods:
1. **Google OAuth** - Sign in with Google account
2. **Facebook OAuth** - Sign in with Facebook account  
3. **Email/Password** - Traditional email and password login

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here
```

## Setting Up OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your environment variables

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. Go to "Facebook Login" → "Settings"
5. Add valid OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
6. Copy the App ID and App Secret to your environment variables

## Email/Password Authentication

Currently implemented with a placeholder admin account:
- **Email**: `admin@childactor101.com`
- **Password**: `admin123`

**⚠️ Important**: This is for development only. In production, you'll need to:
1. Implement proper password hashing
2. Store user data in Airtable
3. Create user registration flow
4. Implement password reset functionality

## Authentication Pages

The following pages are available:
- `/auth/login` - Login page with all three options
- `/auth/register` - Registration page (email/password only)
- `/auth/error` - Error page for authentication issues

## User Roles

The system supports these user roles:
- `USER` - Regular users (default)
- `ADMIN` - Administrative users
- `VENDOR` - Vendor users (for listing management)

## Next Steps

1. **Set up OAuth providers** using the instructions above
2. **Add environment variables** to your `.env.local` file
3. **Test authentication** in development
4. **Implement Airtable user storage** for production
5. **Add user registration flow** for email/password users
6. **Implement password reset** functionality

## Security Notes

- Always use HTTPS in production
- Keep your OAuth secrets secure
- Implement proper password hashing (bcrypt recommended)
- Add rate limiting for login attempts
- Consider implementing 2FA for admin accounts

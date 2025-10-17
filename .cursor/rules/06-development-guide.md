# Development Guide

### Setup
1. Clone repository  
2. Run `pnpm install`  
3. Copy `.env.example` → `.env.local`  
4. Fill in Supabase and Stripe credentials  
5. Start dev server: `pnpm dev`

### Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=

### Local Testing
- Use `pnpm run dev:local` to simulate local-only builds  
- Only push to production after verifying lint (`pnpm lint`) and build (`pnpm build`) pass

### Deployment
- All merges to `main` auto-deploy to **Vercel Production**  
- Preview branches deploy automatically via Vercel  
- Log each commit message clearly with format:  
  `fix:`, `feat:`, `refactor:`, `style:`, `chore:`, `docs:`

### Developer Rules
- No new dependencies without review  
- Commit early, push often  
- Maintain `.cursor/context` up to date after major structural changes

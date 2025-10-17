# Application Structure

The CA101 Directory follows a clean Next.js App Router layout with clear separation between public pages, dashboard routes, and API endpoints.
src/
├─ app/
│   ├─ (public)/
│   │    ├─ page.tsx                 # Landing page
│   │    ├─ directory/               # Vendor listing pages
│   │    ├─ vendor/[slug]/           # Individual vendor pages
│   │    └─ auth/                    # Sign-in / Sign-up
│   ├─ (dashboard)/                  # Admin/vendor dashboards
│   └─ api/                          # Supabase/Stripe endpoints
├─ components/                       # UI and reusable logic
├─ lib/                              # Utility functions, Supabase client
├─ styles/                           # Tailwind and Bauhaus CSS rules
└─ types/                            # Shared TypeScript interfaces

## Routing Notes
- Dynamic routes use `[slug]` for SEO-friendly vendor URLs  
- Protected routes (vendor dashboards) use Supabase auth middleware  
- All forms auto-sync with Supabase using server actions

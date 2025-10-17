# Tech Stack and Architecture

The CA101 Directory is built with modern, serverless-first architecture designed for scalability and maintainability.

## Core Technologies
- **Next.js (App Router)** — Framework for SSR, API routes, and dynamic rendering  
- **TypeScript** — Type safety across all components  
- **Supabase** — Database, authentication, and file storage  
- **Vercel** — Continuous deployment and hosting  
- **Stripe** — Payment processing and subscriptions  
- **Tailwind CSS** — Utility-first styling  
- **Shadcn/UI** — Accessible React component library  
- **Lucide Icons** — Consistent, minimalist icons  
- **OpenAI API** — Optional AI content generation for listings  

## Supporting Libraries
- `zod` for validation  
- `react-hook-form` for form handling  
- `@supabase/auth-helpers-nextjs` for secure user sessions  

## Key Architectural Principles
- Stateless server functions  
- API-first modular design  
- Minimal dependencies — no external CMS or third-party database  
- Environment-based configuration via `.env.local`

# Featured Listings Fix (Permanent Instruction for Cursor)

- File: `app/(components)/HomeFeaturedListings.tsx`
- This component must be treated as a **Client Component**.
- Always ensure the first line of the file contains:

  ```tsx
  "use client";
  ```

- **Reason**: The component renders `<Link>` and interactive props (hover/transition effects). Without this directive, Next.js throws the runtime error:
  ```
  Error: Event handlers cannot be passed to Client Component props.
  ```

- **When running refactors or automated edits, do not remove or move the "use client" directive.**

- **After confirming fix, build and push:**
  ```bash
  npm run build
  vercel --prod
  ```

- **Log the successful deploy in `.cursor/context/context_decisions.md` with the commit message:**
  ```
  fix: mark HomeFeaturedListings as client component to resolve Next.js prop error
  ```

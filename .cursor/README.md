# Cursor Setup Guidelines

**Context Boot Steps**
1. Read all files inside the `/for cursor/` folder and any `.md` files for latest context, notes, and changes.

**Code & Deployment Rules**
- CSS: Follow **Bauhaus styling guide**.  
  - Never use light text on cream or white backgrounds.  
  - Never use dark text on the dark navy background.  
- Use **Supabase + Vercel only**. Do **not** use Sanity or Airtable.  
- When fixing or editing code:
  - Run changes and verify no syntax or runtime errors.
  - Commit with descriptive message and unique build tag.
  - Push to **Vercel production** unless marked as local testing.
- Before moving on:
  - Update the change logs to document progress and files modified.

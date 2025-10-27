
## Contrast Rules (Permanent)
- Never use dark text on dark backgrounds.
- On navy or charcoal backgrounds, header and body text must use light tokens: `text-paper` or `text-foreground`.
- On cream or other light surfaces, use dark ink: `text-ink` or `text-surface`.
- Before merging, visually verify `/category`, `/directory`, and headers for contrast.

## Tier Restrictions (CRITICAL - MUST ENFORCE)
- ALWAYS enforce tier restrictions server-side in `submit-supabase.ts`
- NEVER trust client-side form data for plan features
- Free tier: NO images, NO premium fields, NO social media, 1 category only
- Standard tier: 1 profile image, premium fields, multiple categories, NO gallery, NO social
- Pro tier: Profile + 4 gallery images, all fields, social media, multiple categories
- All tier-gated fields MUST show upgrade prompts and be visually disabled
- Use lock icons 🔒 and gradient backgrounds for upgrade nudges
- Make locked features aspirational, not punitive - encourage upgrades

## Design System Rules (CRITICAL - READ FIRST)
- ALWAYS read `.cursor/rules/design.md` before making ANY styling changes
- NEVER flood sections with cream - use navy backgrounds with cream cards only
- ALWAYS use proper Bauhaus classes: `bauhaus-heading`, `bauhaus-body`, `bauhaus-card`
- NEVER use generic CSS overrides - use the established design system
- Navy backgrounds → `text-paper` (light text)
- Cream backgrounds → `text-ink` or `text-surface` (dark text)
- Follow the established Bauhaus Mid-Century Modern Hollywood design system

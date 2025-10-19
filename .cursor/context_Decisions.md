## 2025-10-19 — HELP PAGES TEXT CONTRAST FIX (COMPLETE)

### Problem
All help pages had invisible text due to using `text-gray-900` (dark text) on navy backgrounds, violating Bauhaus design system contrast rules.

### Solution Implemented
Fixed all help pages to use proper Bauhaus color tokens:
- Navy backgrounds → `text-paper` (light text) for main content
- White/cream card backgrounds → `text-ink` (dark text) for card content
- Applied proper contrast throughout all help pages

### Files Fixed:
- `src/app/(website)/(public)/help/page.tsx` - Main help center (already correct)
- `src/app/(website)/(public)/help/getting-started/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/claim-listing/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/editing-listing/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/image-guidelines/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/pricing-plans/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/troubleshooting/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/101-approved/page.tsx` - ✅ Fixed
- `src/app/(website)/(public)/help/faq/page.tsx` - Already fixed (Oct 18)

### Design System Applied:
- **Navy backgrounds** (#0d1b2a) → `text-paper` (#fafaf4) for headers and body
- **White/cream cards** → `text-ink` (#0f1113) for all card content
- **Colored info boxes** (blue-50, yellow-50, etc.) → `text-ink` for readability
- Maintained proper Bauhaus classes: `bauhaus-heading`, `bauhaus-body`, `bauhaus-card`

### Result:
All help pages now have proper text contrast and follow the established Bauhaus Mid-Century Modern Hollywood design system. No more invisible text on navy backgrounds.

---

## 2025-10-18 — COMPREHENSIVE DESIGN SYSTEM FIX (CRITICAL)

### Problem
Previous agent added harmful global CSS overrides (lines 757-841 in globals.css) that broke the Bauhaus design system:
- Used `text-gray-900` (dark text) on navy backgrounds causing unreadable text
- Added blanket `!important` overrides that conflicted with design system
- Ignored established Bauhaus classes and color tokens
- Created contrast violations across 20+ pages

### Solution Implemented
1. **Removed ALL harmful global CSS overrides** (lines 757-841 in globals.css)
   - Deleted all `text-gray-900` forced overrides
   - Deleted all navigation forced color overrides
   - Deleted all card content forced overrides

2. **Fixed Core Pages with Proper Bauhaus Design System:**
   - `/submit` page - Navy bg with `text-paper` (light text)
   - `/pricing` page - Navy bg with `text-paper`, cream cards with `text-ink`
   - `/category` page - Navy bg with `text-paper`, cream cards with `text-ink`
   - `/category/[slug]` pages - Navy bg with `text-paper`
   - `/search` page - Navy bg with `text-paper`
   - `/help/faq` page - Navy bg with `text-paper`, cream cards with `text-ink`

3. **Applied Proper Bauhaus Classes:**
   - Headers: `bauhaus-heading` with `text-paper` on navy backgrounds
   - Body text: `bauhaus-body` with `text-paper` on navy backgrounds
   - Cards: `bauhaus-card` with `bg-surface` and `text-ink`/`text-surface`
   - Buttons: `bauhaus-btn-primary` and `bauhaus-btn-secondary`
   - Links: `text-secondary-denim` with `hover:text-bauhaus-blue`

### Design System Rules (MUST FOLLOW):
- **Navy backgrounds** (#0d1b2a) → ALWAYS use `text-paper` (#fafaf4)
- **Cream/Surface backgrounds** (#fffdd0) → ALWAYS use `text-ink` (#0f1113) or `text-surface` (#1f2327)
- **NEVER use `text-gray-900`** on navy backgrounds
- **NEVER use generic CSS overrides** - use Bauhaus classes
- **NEVER flood sections with cream** - use navy with cream cards

### Files Fixed:
- `src/styles/globals.css` - Removed harmful overrides
- `src/app/(website)/(public)/submit/page.tsx`
- `src/app/(website)/(public)/pricing/page.tsx`
- `src/app/(website)/(public)/category/page.tsx`
- `src/app/(website)/(public)/category/[slug]/page.tsx`
- `src/app/(website)/(public)/search/page.tsx`
- `src/app/(website)/(public)/help/faq/page.tsx`

### Prevention:
- Added explicit rules to Guardrails.md
- Documented in design.md
- This decision log serves as reference for future agents

## 2025-10-18 — Category header contrast fix

- Problem: Dark text appeared on a navy background in `/category` header content.
- Decision: Use light text tokens on dark backgrounds across marketing pages.
- Implementation: Set container text to `text-paper` in `src/app/(website)/(public)/category/page.tsx` for header block. Added contrast rules to `Guardrails.md`.
- Rationale: Prevent recurrence and ensure AA/AAA readability.

## 2025-01-27 — MAJOR DESIGN SYSTEM VIOLATIONS (URGENT FIX NEEDED)

### Problems Created:
1. **Ignored Bauhaus Design System**: Failed to read `.cursor/rules/design.md` and `.cursor/Guardrails.md` before making changes
2. **Wrong Text Colors**: Used `text-gray-900` on navy backgrounds instead of `text-paper`
3. **Wrong Text Colors**: Used `text-paper` on cream backgrounds instead of `text-ink`/`text-surface`
4. **Flooded Sections with Cream**: Applied cream backgrounds everywhere instead of using navy with cream cards
5. **Missing CSS Variables**: Added `--cream-ink` variable but didn't follow design system usage
6. **Generic CSS Overrides**: Added blanket CSS overrides instead of using proper Bauhaus classes

### Files Damaged:
- `src/app/(website)/(public)/submit/page.tsx` - Wrong text colors on navy background
- `src/app/(website)/(public)/pricing/page.tsx` - Wrong text colors on navy background
- `src/app/(website)/(public)/category/page.tsx` - Wrong text colors
- `src/styles/globals.css` - Added incorrect CSS overrides instead of following design system
- Multiple component files - Applied wrong text colors throughout

### Design System Violations:
- Used `text-gray-900` on navy backgrounds (should be `text-paper`)
- Used `text-paper` on cream backgrounds (should be `text-ink`/`text-surface`)
- Ignored `bauhaus-heading`, `bauhaus-body`, `bauhaus-card` classes
- Created full-width cream sections instead of navy with cream cards
- Added generic CSS overrides instead of using proper Bauhaus component system

### Impact:
- Live site with paying customers has unreadable text
- Violated established design system
- Created inconsistent styling across pages
- Failed to follow documented contrast rules

### Required Fixes:
1. Revert all text color changes to follow Bauhaus design system
2. Use navy backgrounds with `text-paper` for headers
3. Use cream cards with `text-ink`/`text-surface` for content
4. Apply proper `bauhaus-heading`, `bauhaus-body`, `bauhaus-card` classes
5. Remove generic CSS overrides
6. Follow "Never flood sections with cream" rule
7. Use proper Bauhaus grid and component system


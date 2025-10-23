## Core Colors

### Core palette
- **Background navy**: `#0D1B2A` (var: `--background`)
- **Navy gradient end**: `#142B3B`
- **Surface (cream)**: `#FFFDD0` (var: `--card`, utility: `.bg-surface`)
- **Paper (off‑white)**: `#FAFAF4` (var: `--foreground`, utility: `.text-paper`)
- **Text (dark ink)**: `#1F2327` (vars: `--card-foreground`, `--popover-foreground`; utility: `.text-surface`)
- **Primary orange**: `#E4572E` (hover: `#CC4E2A`)
- **Secondary denim**: `#3A76A6` (hover: `#2E5E85`)
- **Highlight mustard**: `#E4A72E`
- **Success**: `#AEBF98`
- **Info**: `#3E9CA3`
- **Error**: `#C84F41`
- **Card border**: `#E6DFC3` (var: `--card-border`)
- **Chip background**: `#F7F1D8` (var: `--chip-bg`)

### Bauhaus accents
- **Mustard yellow**: `#D4A574` (var: `--mustard-yellow`)
- **Faded red‑orange**: `#CC5A47` (var: `--faded-red-orange`)
- **Robin egg blue**: `#2E77B8` (var: `--robin-egg-blue`)
- **Charcoal**: `#1E1F23` (var: `--charcoal`)
- **Cream**: `#FFFDD0` (var: `--cream`)
- **Light ink**: `#F7FAFC` (var: `--ink`, utility: `.text-ink`)

### Text/Ink system (for headers and body)
- **Dark ink on cream**: `.text-surface` → `#1F2327` (default body text on light surfaces)
- **Dark ink (alt)**: `--cream-ink` → `#1B1F29` (legacy dark text on cream)
- **Off‑white on navy**: `.text-paper` → `#FAFAF4` (headers/body on dark backgrounds)
- **Light ink**: `.text-ink` → `#F7FAFC` (used sparingly on very dark overlays)

Notes:
- Headings inherit the surrounding context. Use `.text-paper` on navy and `.text-surface` on cream/surface.
- These values reflect `src/styles/tokens.css`, `src/styles/globals.css`, and `tailwind.config.ts`.




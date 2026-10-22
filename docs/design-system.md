# Public site design system

Charcoal/navy frames the page, warm white carries content, and one restrained accent
(antique brass) marks interaction.

| Token | Value | Use |
|---|---|---|
| `ink` | `#12161D` | text on light, primary buttons on light, selected states |
| `navy` | `#0F1B2E` | hero / band backgrounds (with charcoal `#0E1117`) |
| `canvas` / `canvas-2` / `canvas-3` | `#FAF7F2` / `#F3EEE6` / `#EAE3D6` | content surfaces, alternating bands |
| `canvas-line` | `#E2DACB` | hairlines on light surfaces |
| `brass` | `#C9A66B` | the accent on dark (eyebrows, primary button, chips) |
| `brass-dark` | `#76561F` | the accent on light (6.3:1 on canvas) |
| `brass-tint` | `#F1E6CF` | selected-pill / notice fill |

Utilities (in `src/styles/globals.css`): `.surface-hero`, `.surface-navy`, `.surface-canvas`,
`.surface-canvas-2`, `.heading-display` (Source Serif headings), `.eyebrow`, `.btn-brass`,
`.btn-ink`, `.focus-ring`.

Rules: one primary button per surface (brass on dark, ink on light); no other bright
colors (the old orange / yellow / blue Bauhaus palette is not used); white listing cards sit
on warm canvas; vendor photography is never invented (placeholders are neutral warm tints).

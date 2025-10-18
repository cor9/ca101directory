## 2025-10-18 — Category header contrast fix

- Problem: Dark text appeared on a navy background in `/category` header content.
- Decision: Use light text tokens on dark backgrounds across marketing pages.
- Implementation: Set container text to `text-paper` in `src/app/(website)/(public)/category/page.tsx` for header block. Added contrast rules to `Guardrails.md`.
- Rationale: Prevent recurrence and ensure AA/AAA readability.



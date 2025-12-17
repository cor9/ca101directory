## Guardrails

- **Preserve the existing codebase**: change the smallest surface area possible; no re-architecture unless requested.
- **No misleading trust signals**: never imply background checks, permits, bonding, or legal compliance unless explicitly verified.
- **Directory-first UX**: avoid “SaaS dashboard” patterns on parent-facing pages; default UI should be calm and simple.
- **Always push + log decisions**: after each PR-sized change, **commit, push, and update** `cursor/session-log-2025-01-25.md`.
- **Data migrations**: add SQL migrations as files under `supabase/migrations/` and document any manual run requirements.



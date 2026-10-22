/**
 * Display-time de-duplication of tag-like labels (specialties, services,
 * categories). Case/punctuation-insensitive, order-preserving. The underlying
 * data is never modified.
 */
const norm = (v: unknown) =>
  typeof v === "string" ? v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";

export function dedupeLabels(
  labels: ReadonlyArray<string | null | undefined> | null | undefined,
  exclude: ReadonlyArray<string | null | undefined> = [],
): string[] {
  const seen = new Set(exclude.map(norm).filter(Boolean));
  const out: string[] = [];
  for (const l of labels || []) {
    const label = typeof l === "string" ? l.trim() : "";
    const key = norm(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

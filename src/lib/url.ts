/**
 * Normalize a vendor-entered URL for use in an href.
 * - adds https:// when the scheme is missing ("example.com" is otherwise a relative link)
 * - only allows http(s); anything else (javascript:, data:, ...) returns null
 */
export function safeExternalUrl(raw?: string | null): string | null {
  const value = (raw || "").trim();
  if (!value) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value.replace(/^\/+/, "")}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** "https://www.example.com/path/" -> "example.com/path" (display only) */
export function displayUrl(raw?: string | null): string {
  return (raw || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

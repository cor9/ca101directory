/**
 * Field Sanitization Utilities
 *
 * Handles the messy reality of array fields that may be:
 * - null/undefined
 * - empty arrays []
 * - JSON-stringified arrays "[]" or '["foo"]'
 * - single values "foo"
 * - placeholder garbage "_", "unknown", etc.
 */

/**
 * Parse any array-ish field into a clean string array.
 * Handles: null, [], "[]", '["foo"]', "foo", ["foo"], etc.
 */
export function parseArrayField(val: unknown): string[] {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val.filter((item) => typeof item === "string" && item.trim()) as string[];
  }

  if (typeof val === "string") {
    const s = val.trim();
    if (s === "" || s === "[]" || s === "_" || s === '[""]') return [];

    // Try parsing as JSON array
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string" && item.trim()) as string[];
      }
      // If parsed is a string, treat as single value
      if (typeof parsed === "string" && parsed.trim()) {
        return [parsed.trim()];
      }
    } catch {
      // Not valid JSON - treat as single token
      return [s];
    }
  }

  return [];
}

/**
 * Clean an array of strings by:
 * - Trimming whitespace
 * - Removing empty strings
 * - Removing placeholder values ("_", "unknown", "N/A", etc.)
 * - Removing UUIDs
 */
export function cleanArray(arr: string[]): string[] {
  const placeholders = new Set(["_", "unknown", "n/a", "na", "none", "[]", '[""]', ""]);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return arr
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x) => {
      if (!x) return false;
      if (placeholders.has(x.toLowerCase())) return false;
      if (uuidRegex.test(x)) return false;
      return true;
    });
}

/**
 * Parse and clean an array field in one step.
 * Returns empty array if no valid values.
 */
export function getCleanArray(val: unknown): string[] {
  return cleanArray(parseArrayField(val));
}

/**
 * Check if an array field has any valid displayable values.
 */
export function hasValidArrayData(val: unknown): boolean {
  return getCleanArray(val).length > 0;
}

/**
 * Format array for display (joined with separator).
 * Returns null if no valid values.
 */
export function formatArrayDisplay(val: unknown, separator = ", "): string | null {
  const clean = getCleanArray(val);
  return clean.length > 0 ? clean.join(separator) : null;
}

/**
 * Get the first N items from an array field, cleaned.
 * Useful for showing chips/pills with a max count.
 */
export function getTopItems(val: unknown, max: number): string[] {
  return getCleanArray(val).slice(0, max);
}

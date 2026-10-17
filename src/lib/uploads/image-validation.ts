/**
 * The file-acceptance rules /api/upload/route.ts enforces before ever
 * touching Supabase Storage. Extracted so this logic — the one part of
 * the upload path that doesn't require a live network call — can be
 * unit tested; see scripts/test-webhook-and-ownership.ts. The actual
 * storage.upload() call itself remains unverified in this environment
 * (no Supabase Storage network access, no fake for the Storage API) —
 * see the recovery report's Task 3 notes.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_PATTERN = /^image\/(jpeg|jpg|png|webp|heic)$/;

export type ImageValidationResult =
  | { valid: true }
  | { valid: false; reason: "too_large" | "unsupported_type" };

export function validateImageUpload(file: {
  size: number;
  type: string;
  name: string;
}): ImageValidationResult {
  if (file.size > MAX_UPLOAD_BYTES) {
    return { valid: false, reason: "too_large" };
  }

  const isAllowedMimeType = ALLOWED_MIME_PATTERN.test(file.type);
  const isHeicByExtension = /\.heic$/i.test(file.name || "");
  if (!isAllowedMimeType && !isHeicByExtension) {
    return { valid: false, reason: "unsupported_type" };
  }

  return { valid: true };
}

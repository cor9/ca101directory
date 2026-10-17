import { canUpdateListing } from "@/lib/listings/listing-ownership";
import { pickVendorEditableFields } from "@/lib/listings/vendor-editable-fields";

/**
 * Loose shape covering the chainable methods actions/listings.ts's
 * updateListing() actually calls on the Supabase client. Typed loosely
 * (not against @supabase/supabase-js's generics) so both the real
 * service-role client and the in-memory fake in
 * scripts/test-helpers/fake-supabase.ts satisfy it — this is a test seam,
 * not a schema.
 */
// biome-ignore lint/suspicious/noExplicitAny: a loose test-seam type (see module doc comment below), deliberately not the real row shape.
type SupabaseResult = { data: any; error: any };

export interface SupabaseFilterBuilder extends PromiseLike<SupabaseResult> {
  eq(col: string, val: unknown): SupabaseFilterBuilder;
  select(cols?: string): SupabaseFilterBuilder;
  single(): Promise<SupabaseResult>;
  maybeSingle(): Promise<SupabaseResult>;
}

export interface SupabaseQueryClient {
  from(table: string): {
    select(cols?: string): SupabaseFilterBuilder;
    update(payload: Record<string, unknown>): SupabaseFilterBuilder;
  };
}

export type UpdateListingResult =
  | { status: "success"; data: Record<string, unknown> }
  | { status: "error"; message: string };

/**
 * The full authorization + write path for updateListing(), independent
 * of the real Supabase client and Next.js cache APIs so it can be unit
 * tested directly (actions/listings.ts calls this with the real
 * service-role client, then does cache revalidation on success — see
 * that file).
 *
 * Security properties, each covered by scripts/test-vendor-authorization.ts:
 * 1. A non-admin may only write a listing whose owner_id already equals
 *    their own id (checked by fetching the row first).
 * 2. That same ownership condition is re-asserted ON THE WRITE ITSELF
 *    (`.eq("owner_id", actorId)`, non-admin only) rather than trusted
 *    from the earlier read — closing a TOCTOU window where the listing
 *    could change owner between the check and the write. If the row no
 *    longer matches at write time, the update affects zero rows and this
 *    returns an error rather than reporting success.
 * 3. A non-admin's payload is filtered through pickVendorEditableFields
 *    before it reaches the database, regardless of what the write
 *    targets (field names are schema-shaped, not row-identity-shaped,
 *    so this check doesn't depend on which listing is being written).
 */
export async function performListingUpdate(
  supabase: SupabaseQueryClient,
  actor: { id: string; role: string },
  listingId: string,
  payload: Record<string, unknown>,
): Promise<UpdateListingResult> {
  const isAdmin = actor.role === "admin";

  if (!isAdmin) {
    const { data: existingListing } = await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", listingId)
      .single();

    if (
      !canUpdateListing({
        isAdmin: false,
        listingOwnerId: existingListing?.owner_id ?? null,
        currentUserId: actor.id,
      })
    ) {
      return {
        status: "error",
        message: "Unauthorized: You can only edit your own listing.",
      };
    }
  }

  const payloadToWrite = isAdmin ? payload : pickVendorEditableFields(payload);

  let query = supabase
    .from("listings")
    .update(payloadToWrite)
    .eq("id", listingId);
  // Non-admin writes re-check ownership atomically at the write itself
  // (see property 2 above); admins intentionally skip this second filter.
  if (!isAdmin) {
    query = query.eq("owner_id", actor.id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    return {
      status: "error",
      message: `Database Error: Failed to update listing.${
        error?.message ? ` (${error.message})` : ""
      }`,
    };
  }

  return { status: "success", data };
}

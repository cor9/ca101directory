import { createServerClient } from "@/lib/supabase";
import { verifyOptOutToken } from "@/lib/tokens";

export const metadata = {
  title: "Removed from Directory - Child Actor 101",
  description: "Your listing has been removed from public view.",
};

export default async function RemoveListingPage({
  params,
}: {
  params: { token: string };
}) {
  const parsed = verifyOptOutToken(params.token);
  if (!parsed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink mb-2">Invalid link</h1>
        <p className="text-paper">This removal link is invalid or expired.</p>
      </div>
    );
  }

  const supabase = createServerClient();
  await supabase
    .from("listings")
    .update({ is_active: false })
    .eq("id", parsed.lid);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-ink mb-2">Listing removed</h1>
      <p className="text-paper">
        Your listing has been removed from public view. If this was a mistake,
        reply to this email and we can restore it.
      </p>
    </div>
  );
}

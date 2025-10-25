import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = (await req.json()) as { listingId?: string };
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Ensure listing exists
    const { data: listing, error: fetchErr } = await supabase
      .from("listings")
      .select("id, is_claimed, owner_id, status, plan")
      .eq("id", listingId)
      .single();

    if (fetchErr || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.is_claimed) {
      return NextResponse.json({ error: "Already claimed" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        is_claimed: true,
        owner_id: session.user.id,
        status: "Pending", // queue for admin review
        plan: listing.plan || "Free",
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to claim: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected error" },
      { status: 500 },
    );
  }
}


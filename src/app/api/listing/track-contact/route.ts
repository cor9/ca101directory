import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json(
        { ok: false, error: "listingId required" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const { data: existing, error: selectError } = await supabase
      .from("listings")
      .select("contact_clicks")
      .eq("id", listingId)
      .single();

    if (selectError) {
      console.error("[track-contact] select error", selectError);
      return NextResponse.json(
        { ok: false, error: "Failed to read contact clicks" },
        { status: 500 },
      );
    }

    const nextCount = (existing?.contact_clicks ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("listings")
      .update({ contact_clicks: nextCount })
      .eq("id", listingId);

    if (updateError) {
      console.error("[track-contact] update error", updateError);
      return NextResponse.json(
        { ok: false, error: "Failed to update contact clicks" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, contact_clicks: nextCount });
  } catch (error) {
    console.error("[track-contact] unexpected error", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 },
    );
  }
}

import { requireAdmin } from "@/lib/auth/guards";
import { sendEmail } from "@/lib/mail";
import {
  generateMockup,
  generateMockupEmailHTML,
} from "@/lib/mockup-generator";
import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      listingId,
      tier = "pro",
      sendEmail: shouldSendEmail = false,
    } = body as {
      listingId: string;
      tier?: "standard" | "pro";
      sendEmail?: boolean;
    };

    if (!listingId) {
      return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: listing, error } = await supabase
      .from("listings")
      .select(
        "id, listing_name, slug, what_you_offer, description, extras_notes, website, email, city, state, plan, categories, profile_image, gallery, tags",
      )
      .eq("id", listingId)
      .single();

    if (error || !listing) {
      console.error("generate-mockup: failed to load listing", error);
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const mockup = await generateMockup(listing, tier);

    let emailSent = false;
    if (shouldSendEmail && listing.email) {
      await sendEmail({
        to: listing.email,
        subject: `${listing.listing_name || "Your"} listing makeover (${tier === "pro" ? "Pro" : "Standard"})`,
        html: generateMockupEmailHTML(
          mockup,
          listing.listing_name,
          listing.slug,
        ),
      });
      emailSent = true;
    }

    return NextResponse.json({ success: true, mockup, emailSent });
  } catch (error) {
    console.error("generate-mockup API error", error);
    return NextResponse.json(
      { error: "Failed to generate mockup" },
      { status: 500 },
    );
  }
}

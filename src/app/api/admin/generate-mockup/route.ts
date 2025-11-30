import { NextResponse } from "next/server";
import { getListingById } from "@/data/listings";
import { generateMockup, generateMockupEmail, generateMockupEmailHTML, type MockupTier } from "@/lib/mockup-generator";
import { resend } from "@/lib/mail";
import { currentUser } from "@/lib/auth";

/**
 * Generate listing mockup
 * POST /api/admin/generate-mockup
 *
 * Body: {
 *   listingId: string
 *   tier: "standard" | "pro"
 *   sendEmail?: boolean
 * }
 */

export async function POST(request: Request) {
  try {
    // Verify admin access
    const user = await currentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingId, tier = "pro", sendEmail = false } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }

    // Get listing data
    const listing = await getListingById(listingId);

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Generate mockup
    const mockup = await generateMockup(listing, tier as MockupTier);

    // Optionally send email
    let emailSent = false;
    if (sendEmail && listing.email) {
      const vendorName = listing.listing_name?.split(" ")[0] || "there";
      const { subject, body } = generateMockupEmail(
        mockup,
        vendorName,
        listing.slug || ""
      );

      try {
        await resend.emails.send({
          from: process.env.RESEND_EMAIL_FROM || "Corey Ralston <corey@childactor101.com>",
          to: listing.email,
          subject,
          text: body,
          html: generateMockupEmailHTML(mockup, vendorName, listing.slug || ""),
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Error sending mockup email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      mockup,
      emailSent,
      message: emailSent
        ? "Mockup generated and email sent successfully"
        : "Mockup generated successfully",
    });
  } catch (error) {
    console.error("Error generating mockup:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "generate-mockup",
    description: "AI-powered listing mockup generator",
  });
}

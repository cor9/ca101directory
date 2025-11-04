import { redirect } from "next/navigation";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VendorAccessPage({ params }: PageProps) {
  const { token } = await params;

  try {
    // Verify the token
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET missing");
      redirect("/auth/error");
    }

    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) {
      redirect("/auth/error");
    }

    // Verify signature
    const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      redirect("/auth/error");
    }

    // Parse payload
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));

    // Validate payload
    if (!payload?.email || !payload?.uid || !payload?.exp || payload?.type !== 'vendor_access') {
      redirect("/auth/error");
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      redirect("/auth/expired");
    }

    // Log them in via Supabase
    const supabase = createClient();

    // Use admin API to create a session for this user
    const { data: { user }, error } = await supabase.auth.admin.getUserById(payload.uid);

    if (error || !user) {
      console.error("Error fetching user:", error);
      redirect("/auth/error");
    }

    // Generate a magic link for them using admin API
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    process.env.NEXT_PUBLIC_APP_URL ||
                    'https://directory.childactor101.com';

    const magicLinkUrl = new URL(`${siteUrl}/auth/magic-link`);
    magicLinkUrl.searchParams.set("email", payload.email);
    magicLinkUrl.searchParams.set("role", "vendor");
    magicLinkUrl.searchParams.set("remember", "1");
    magicLinkUrl.searchParams.set("redirectTo", "/dashboard/vendor");
    magicLinkUrl.searchParams.set("intent", "login");

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: payload.email,
      options: {
        redirectTo: magicLinkUrl.toString()
      }
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("Error generating magic link:", linkError);
      redirect("/auth/error");
    }

    // Redirect to the magic link which will log them in
    redirect(linkData.properties.action_link);

  } catch (error) {
    console.error("Vendor access error:", error);
    redirect("/auth/error");
  }
}


import { sendDiscordNotification } from "@/lib/discord";
import { createServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function isValidOrigin(requestHeaders: Headers): boolean {
  const referer = requestHeaders.get("referer") || "";
  const host = requestHeaders.get("host") || "";
  const allowed: string[] = [
    process.env.NEXT_PUBLIC_SITE_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
    host,
  ].filter(Boolean);
  return allowed.some((domain) => referer.includes(domain as string));
}

export async function POST(request: Request) {
  try {
    const hdrs = headers();
    if (!isValidOrigin(hdrs)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { path, message, context, userId, userEmail } = body || {};

    if (!message) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    try {
      await supabase.from("support_issues").insert([
        {
          user_id: userId || null,
          user_email: userEmail || null,
          path: path || null,
          message,
          context: context || null,
        },
      ]);
    } catch (e) {
      // Table may not exist yet; continue with Discord alert
    }

    // Discord notification (non-blocking)
    sendDiscordNotification("🚨 User Issue Reported", [
      { name: "Path", value: path || "N/A", inline: true },
      { name: "User", value: userEmail || "Unknown", inline: true },
      { name: "Message", value: message, inline: false },
    ]).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

import { sendDiscordNotification } from "@/lib/discord";
import { createServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function isValidOrigin(requestHeaders: Headers): boolean {
  const referer = requestHeaders.get("referer") || "";
  const origin = requestHeaders.get("origin") || "";
  const host = requestHeaders.get("host") || "";

  const allowedUrls = [
    process.env.NEXT_PUBLIC_SITE_URL || "",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean);

  const allowedHosts = allowedUrls
    .map((u) => {
      try {
        return new URL(u as string).host;
      } catch {
        return String(u);
      }
    })
    .filter(Boolean);

  const refererHost = (() => {
    try {
      return referer ? new URL(referer).host : "";
    } catch {
      return "";
    }
  })();

  const originHost = (() => {
    try {
      return origin ? new URL(origin).host : "";
    } catch {
      return "";
    }
  })();

  // Allow if any of the following is true:
  // - Referer host matches an allowed host
  // - Origin host matches an allowed host
  // - Request Host header matches an allowed host (covers server-side calls on our domain)
  // - Running on Vercel with our own host header
  return (
    allowedHosts.includes(refererHost) ||
    allowedHosts.includes(originHost) ||
    allowedHosts.includes(host) ||
    (!!process.env.VERCEL && !!host)
  );
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

// Lightweight GET handler for testing Discord delivery from Production without requiring POST clients
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "🚨 User Issue Reported (Test)";
    const path = searchParams.get("path") || "/test";
    const message = searchParams.get("message") || "This is a test support ping.";
    const userEmail = searchParams.get("userEmail") || "test@example.com";

    // Origin validation relaxed as in POST
    const hdrs = headers();
    if (!isValidOrigin(hdrs)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only send Discord notification (do not write to DB on GET)
    sendDiscordNotification(title, [
      { name: "Path", value: path, inline: true },
      { name: "User", value: userEmail, inline: true },
      { name: "Message", value: message, inline: false },
    ]).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

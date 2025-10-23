import { sendDiscordNotification } from "@/lib/discord";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "🔔 Discord Test";
    const msg = searchParams.get("msg") || "This is a test notification.";
    const hasWebhook = !!process.env.DISCORD_WEBHOOK_URL;

    await sendDiscordNotification(title, [
      { name: "Message", value: msg, inline: false },
      {
        name: "Env",
        value: process.env.VERCEL ? "Vercel" : "Local",
        inline: true,
      },
      { name: "Webhook Set", value: hasWebhook ? "Yes" : "No", inline: true },
    ]);

    return NextResponse.json({ ok: true, hasWebhook });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

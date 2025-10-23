import { sendDiscordNotification } from "@/lib/discord";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "🔔 Discord Test";
    const msg = searchParams.get("msg") || "This is a test notification.";

    await sendDiscordNotification(title, [
      { name: "Message", value: msg, inline: false },
      {
        name: "Env",
        value: process.env.VERCEL ? "Vercel" : "Local",
        inline: true,
      },
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

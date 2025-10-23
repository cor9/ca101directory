import { sendDiscordNotification } from "@/lib/discord";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "test-user@example.com";
    const role = searchParams.get("role") || "user";

    await sendDiscordNotification("🆕 New Sign-up (Test)", [
      { name: "Email", value: email, inline: true },
      { name: "Role", value: role, inline: true },
      { name: "Env", value: process.env.VERCEL ? "Vercel" : "Local", inline: true },
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}



import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Force this route to be dynamic (not statically optimized)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Lazy initialization for Resend client
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "you@childactor101.com";

export async function GET() {
  const resend = getResendClient();
  // 1) fetch notifications that haven't been emailed yet
  const { data: notifications, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("emailed", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }

  if (!notifications || notifications.length === 0) {
    return NextResponse.json({ message: "No new notifications" });
  }

  // 2) build a simple text + HTML digest
  const lines = notifications.map((n: any) => {
    const created = new Date(n.created_at).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    return `• [${created}] ${n.title} — ${n.message}`;
  });

  const textBody = [
    `Daily Directory Summary`,
    ``,
    ...lines,
    ``,
    `Total: ${notifications.length} notification(s)`,
  ].join("\n");

  const htmlBody = `
    <h2>Daily Directory Summary</h2>
    <ul>
      ${notifications
        .map((n: any) => {
          const created = new Date(n.created_at).toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          });
          return `<li><strong>[${created}] ${n.title}</strong><br/>${n.message}</li>`;
        })
        .join("")}
    </ul>
    <p>Total: ${notifications.length} notification(s)</p>
  `;

  // 3) send with Resend
  try {
    await resend.emails.send({
      from: "Child Actor 101 Directory <no-reply@directory.childactor101.com>",
      to: ADMIN_EMAIL,
      subject: "Daily Directory Summary",
      text: textBody,
      html: htmlBody,
    });
  } catch (e) {
    console.error("Error sending digest email:", e);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }

  // 4) mark notifications as emailed
  const ids = notifications.map((n: any) => n.id);
  const { error: updateError } = await supabaseAdmin
    .from("notifications")
    .update({ emailed: true })
    .in("id", ids);

  if (updateError) {
    console.error("Error updating notifications as emailed:", updateError);
    // email already sent; don't fail the route
  }

  return NextResponse.json({
    message: `Sent digest for ${notifications.length} notifications.`,
  });
}

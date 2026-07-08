import { sendEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// Force this route to be dynamic (not statically optimized)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DigestNotification = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

const ADMIN_EMAIL =
  process.env.SES_EMAIL_ADMIN ||
  process.env.ADMIN_EMAIL ||
  "you@childactor101.com";

export async function GET(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const isVercelCron = userAgent.includes("vercel-cron");
  const hasValidAuth = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !hasValidAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1) fetch notifications that haven't been emailed yet
  const { data, error } = await supabaseAdmin
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

  const notifications = (data || []) as DigestNotification[];

  if (notifications.length === 0) {
    return NextResponse.json({ message: "No new notifications" });
  }

  // 2) build a simple text + HTML digest
  const lines = notifications.map((notification) => {
    const created = new Date(notification.created_at).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    return `• [${created}] ${notification.title} — ${notification.message}`;
  });

  const textBody = [
    "Daily Directory Summary",
    "",
    ...lines,
    "",
    `Total: ${notifications.length} notification(s)`,
  ].join("\n");

  const htmlBody = `
    <h2>Daily Directory Summary</h2>
    <ul>
      ${notifications
        .map((notification) => {
          const created = new Date(notification.created_at).toLocaleString(
            "en-US",
            {
              timeZone: "America/Los_Angeles",
            },
          );
          return `<li><strong>[${created}] ${notification.title}</strong><br/>${notification.message}</li>`;
        })
        .join("")}
    </ul>
    <p>Total: ${notifications.length} notification(s)</p>
  `;

  // 3) send with SES
  try {
    await sendEmail({
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
  const ids = notifications.map((notification) => notification.id);
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

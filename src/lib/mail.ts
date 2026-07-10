import { ApprovalEmail } from "@/emails/approval-email";
import ListingDay3CompleteProfileEmail from "@/emails/listing-day3-complete-profile";
import ListingDay7TrafficUpdateEmail from "@/emails/listing-day7-traffic-update";
import ListingDay14UpgradeOfferEmail from "@/emails/listing-day14-upgrade-offer";
import ListingLiveEmail from "@/emails/listing-live";
import ListingSubmittedEmail from "@/emails/listing-submitted";
import { NotifySubmissionEmail } from "@/emails/notify-submission-to-admin";
import { NotifySubmissionToUserEmail } from "@/emails/notify-submission-to-user";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import RejectionEmail from "@/emails/rejection-email";
import VerifyEmail from "@/emails/verify-email";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render, toPlainText } from "@react-email/render";
import type { ReactNode } from "react";
import { Resend } from "resend";

let sesClient: SESv2Client | null = null;
let resendInstance: Resend | null = null;

function getSesClient(): SESv2Client {
  if (!sesClient) {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "AWS SES is not configured. Transactional email sending is disabled.",
      );
    }

    sesClient = new SESv2Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return sesClient;
}

function getResendClient(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured. Newsletter contact operations are disabled.",
      );
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }

  return resendInstance;
}

// Keep the Resend client available for newsletter contact operations.
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const instance = getResendClient();
    const value = instance[prop as keyof Resend];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

function getFrom() {
  return (
    process.env.SES_EMAIL_FROM || "Corey Ralston <corey@childactor101.com>"
  );
}
function getReplyTo() {
  return process.env.SES_REPLY_TO || "corey@childactor101.com";
}
function getAdminAddress() {
  return process.env.SES_EMAIL_ADMIN || getReplyTo();
}
function getToAddresses(original: string | string[]) {
  const override = process.env.RESEND_FORCE_TO;
  const recipients =
    override && override.length > 0
      ? [override]
      : Array.isArray(original)
        ? original
        : [original];
  return recipients.filter(Boolean);
}

type SendEmailOptions = {
  from?: string;
  to: string | string[];
  replyTo?: string | string[];
  subject: string;
  react?: ReactNode;
  html?: string;
  text?: string;
};

export async function sendEmail({
  from = getFrom(),
  to,
  replyTo = getReplyTo(),
  subject,
  react,
  html,
  text,
}: SendEmailOptions) {
  let resolvedHtml = html;
  let resolvedText = text;

  if (react) {
    resolvedHtml = await render(react);
    resolvedText = toPlainText(resolvedHtml);
  } else if (resolvedHtml && !resolvedText) {
    resolvedText = toPlainText(resolvedHtml);
  }

  if (!resolvedHtml && !resolvedText) {
    throw new Error("Email content is missing. Provide react, html, or text.");
  }

  await getSesClient().send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: getToAddresses(to),
      },
      ReplyToAddresses: (Array.isArray(replyTo) ? replyTo : [replyTo]).filter(
        Boolean,
      ),
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: "UTF-8",
          },
          Body: {
            ...(resolvedHtml
              ? {
                  Html: {
                    Data: resolvedHtml,
                    Charset: "UTF-8",
                  },
                }
              : {}),
            ...(resolvedText
              ? {
                  Text: {
                    Data: resolvedText,
                    Charset: "UTF-8",
                  },
                }
              : {}),
          },
        },
      },
    }),
  );

  return { error: null as null };
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm your email",
    react: VerifyEmail({ confirmLink }),
  });
};

export const sendNotifySubmissionEmail = async (
  userName: string,
  userEmail: string,
  itemName: string,
  statusLink: string,
  reviewLink: string,
) => {
  await sendEmail({
    to: userEmail,
    subject: "Thank you for your submission",
    react: NotifySubmissionToUserEmail({
      userName,
      itemName,
      statusLink,
    }),
  });

  await sendEmail({
    to: getAdminAddress(),
    subject: "New submission",
    react: NotifySubmissionEmail({ itemName, reviewLink }),
  });
};

export const sendPaymentSuccessEmail = async (
  userName: string,
  email: string,
  itemLink: string,
) => {
  await sendEmail({
    to: email,
    subject: "Thank your for your submission",
    react: PaymentSuccessEmail({ userName, itemLink }),
  });
};

export const sendApprovalEmail = async (
  userName: string,
  email: string,
  itemLink: string,
) => {
  await sendEmail({
    to: email,
    subject: "Your submission has been approved",
    react: ApprovalEmail({ userName, itemLink }),
  });
};

export const sendRejectionEmail = async (
  userName: string,
  email: string,
  dashboardLink: string,
) => {
  await sendEmail({
    to: email,
    subject: "Please check your submission",
    react: RejectionEmail({ userName, dashboardLink }),
  });
};

export const sendListingSubmittedEmail = async (
  vendorName: string,
  vendorEmail: string,
  listingName: string,
  listingId: string,
  plan: string,
  isEdit = false,
) => {
  const subject = isEdit
    ? `Listing Updated: ${listingName}`
    : `Listing Submitted: ${listingName}`;

  await sendEmail({
    to: vendorEmail,
    subject,
    react: ListingSubmittedEmail({
      vendorName,
      listingName,
      listingId,
      plan,
      isEdit,
    }),
  });
};

export const sendListingLiveEmail = async (payload: {
  vendorName: string;
  vendorEmail: string;
  listingName: string;
  slug: string;
  listingId: string;
  claimUrl: string;
  upgradeUrl: string;
  manageUrl: string;
  optOutUrl: string;
}) => {
  await sendEmail({
    to: payload.vendorEmail,
    subject: `Your listing is live: ${payload.listingName}`,
    react: ListingLiveEmail({
      vendorName: payload.vendorName,
      listingName: payload.listingName,
      slug: payload.slug,
      listingId: payload.listingId,
      claimUrl: payload.claimUrl,
      upgradeUrl: payload.upgradeUrl,
      manageUrl: payload.manageUrl,
      siteUrl: process.env.NEXT_PUBLIC_APP_URL,
      optOutUrl: payload.optOutUrl,
    }),
  });
};

/**
 * Admin-only notifications for key listing activities
 */
export const sendAdminSubmissionNotification = async (
  listingName: string,
  listingId: string,
  isEdit = false,
) => {
  const reviewLink = `${SITE_URL}/dashboard/admin/edit/${listingId}`;
  const subject = isEdit
    ? `Listing Updated (Review): ${listingName}`
    : `New Listing Submission: ${listingName}`;

  await sendEmail({
    to: getAdminAddress(),
    subject,
    react: NotifySubmissionEmail({ itemName: listingName, reviewLink }),
  });
};

export const sendAdminClaimNotification = async (
  listingName: string,
  listingId: string,
  claimerEmail?: string | null,
) => {
  const reviewLink = `${SITE_URL}/dashboard/admin/edit/${listingId}`;
  const subject = `Listing Claimed: ${listingName}`;

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Listing Claimed</h2>
      <p><strong>${listingName}</strong> was just claimed${claimerEmail ? ` by ${claimerEmail}` : ""}.</p>
      <p>
        <a href="${reviewLink}" target="_blank" rel="noopener noreferrer">Review listing</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: getAdminAddress(),
    subject,
    html,
  });
};

export const sendAdminUpgradeNotification = async (
  listingName: string,
  listingId: string,
  plan: string | null,
  billingCycle?: string | null,
  vendorId?: string | null,
) => {
  const reviewLink = `${SITE_URL}/dashboard/admin/edit/${listingId}`;
  const subject = `Listing Upgraded: ${listingName} → ${plan || "Unknown Plan"}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Listing Upgraded</h2>
      <p><strong>${listingName}</strong> upgraded to <strong>${plan || "Unknown"}</strong>${billingCycle ? ` (${billingCycle})` : ""}.</p>
      ${vendorId ? `<p>Vendor ID: ${vendorId}</p>` : ""}
      <p>
        <a href="${reviewLink}" target="_blank" rel="noopener noreferrer">Review listing</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: getAdminAddress(),
    subject,
    html,
  });
};

/**
 * Notify admin when a new vendor suggestion is submitted
 */
export const sendAdminVendorSuggestionNotification = async (payload: {
  vendorName: string;
  website?: string;
  category?: string;
  city?: string;
  state?: string;
  suggestedBy?: string;
  vendorEmail?: string;
  vendorPhone?: string;
}) => {
  const subject = `New Vendor Suggestion: ${payload.vendorName}`;
  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>New Vendor Suggestion</h2>
      <p><strong>${payload.vendorName}</strong></p>
      ${payload.website ? `<p>Website: <a href="${payload.website}" target="_blank" rel="noopener noreferrer">${payload.website}</a></p>` : ""}
      ${payload.category ? `<p>Category: ${payload.category}</p>` : ""}
      ${payload.city || payload.state ? `<p>Location: ${payload.city ?? ""}${payload.city && payload.state ? ", " : ""}${payload.state ?? ""}</p>` : ""}
      ${payload.vendorEmail ? `<p>Vendor Email: <a href="mailto:${payload.vendorEmail}">${payload.vendorEmail}</a></p>` : ""}
      ${payload.vendorPhone ? `<p>Vendor Phone: ${payload.vendorPhone}</p>` : ""}
      ${payload.suggestedBy ? `<p>Suggested by: ${payload.suggestedBy}</p>` : ""}
    </div>
  `;

  await sendEmail({
    to: getAdminAddress(),
    subject,
    html,
  });
};

/**
 * Drip Campaign Emails: Send automated follow-up emails to unclaimed listings
 */

/** Day 3: Complete your profile */
export const sendDay3CompleteProfileEmail = async (payload: {
  vendorName: string;
  vendorEmail: string;
  listingName: string;
  slug: string;
}) => {
  const claimUrl = `${SITE_URL}/claim-upgrade/${payload.slug}`;
  const manageUrl = `${SITE_URL}/dashboard/vendor`;

  await sendEmail({
    to: payload.vendorEmail,
    subject: "Complete your profile to appear higher in search results",
    react: ListingDay3CompleteProfileEmail({
      vendorName: payload.vendorName,
      listingName: payload.listingName,
      claimUrl,
      manageUrl,
      siteUrl: SITE_URL,
    }),
  });
};

/** Day 7: Here's how parents are finding you */
export const sendDay7TrafficUpdateEmail = async (payload: {
  vendorName: string;
  vendorEmail: string;
  listingName: string;
  slug: string;
  viewCount?: number;
}) => {
  const claimUrl = `${SITE_URL}/claim-upgrade/${payload.slug}`;
  const upgradeUrl = `${SITE_URL}/claim-upgrade/${payload.slug}#pricing`;
  const count = payload.viewCount ?? 0;

  const subject =
    count > 0
      ? `${count} parents viewed your listing this week`
      : "See how parents are finding you in the Child Actor 101 Directory";

  await sendEmail({
    to: payload.vendorEmail,
    subject,
    react: ListingDay7TrafficUpdateEmail({
      vendorName: payload.vendorName,
      listingName: payload.listingName,
      viewCount: count,
      claimUrl,
      upgradeUrl,
      siteUrl: SITE_URL,
    }),
  });
};

/** Day 14: Upgrade to Pro - here's what you're missing */
export const sendDay14UpgradeOfferEmail = async (payload: {
  vendorName: string;
  vendorEmail: string;
  listingName: string;
  slug: string;
  viewCount?: number;
}) => {
  const upgradeUrl = `${SITE_URL}/claim-upgrade/${payload.slug}#pricing`;
  const count = payload.viewCount ?? 0;

  await sendEmail({
    to: payload.vendorEmail,
    subject: "Is it time to move your listing to the top?",
    react: ListingDay14UpgradeOfferEmail({
      vendorName: payload.vendorName,
      listingName: payload.listingName,
      viewCount: count,
      upgradeUrl,
      siteUrl: SITE_URL,
    }),
  });
};

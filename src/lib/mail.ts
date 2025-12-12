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
import { Resend } from "resend";

// Lazy-load Resend to avoid errors if API key is missing
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured. Email sending is disabled.",
      );
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// Export a proxy that lazy-loads all Resend properties
export const resend = new Proxy({} as Resend, {
  get(target, prop) {
    const instance = getResend();
    const value = instance[prop as keyof Resend];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

// Standardize From/Reply-To and allow forcing a single recipient during testing
function getFrom() {
  return (
    process.env.RESEND_EMAIL_FROM || "Corey Ralston <corey@childactor101.com>"
  );
}
function getReplyTo() {
  return process.env.RESEND_REPLY_TO || "corey@childactor101.com";
}
function getToAddress(original: string) {
  const override = process.env.RESEND_FORCE_TO;
  return override && override.length > 0 ? override : original;
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(email),
    reply_to: getReplyTo(),
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
  // console.log(`sendNotifySubmissionEmail,
  //   userName: ${userName},
  //   userEmail: ${userEmail},
  //   itemName: ${itemName},
  //   reviewLink: ${reviewLink},
  //   statusLink: ${statusLink}`);

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(userEmail),
    reply_to: getReplyTo(),
    subject: "Thank you for your submission",
    react: NotifySubmissionToUserEmail({
      userName,
      itemName,
      statusLink,
    }),
  });

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(process.env.RESEND_EMAIL_ADMIN || getReplyTo()),
    reply_to: getReplyTo(),
    subject: "New submission",
    react: NotifySubmissionEmail({ itemName, reviewLink }),
  });
};

export const sendPaymentSuccessEmail = async (
  userName: string,
  email: string,
  itemLink: string,
) => {
  // console.log(`sendPaymentSuccessEmail,
  //   email: ${email},
  //   userName: ${userName},
  //   itemLink: ${itemLink}`);

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(email),
    reply_to: getReplyTo(),
    subject: "Thank your for your submission",
    react: PaymentSuccessEmail({ userName, itemLink }),
  });
};

export const sendApprovalEmail = async (
  userName: string,
  email: string,
  itemLink: string,
) => {
  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(email),
    reply_to: getReplyTo(),
    subject: "Your submission has been approved",
    react: ApprovalEmail({ userName, itemLink }),
  });
};

export const sendRejectionEmail = async (
  userName: string,
  email: string,
  dashboardLink: string,
) => {
  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(email),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(vendorEmail),
    reply_to: getReplyTo(),
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
  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(payload.vendorEmail),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(process.env.RESEND_EMAIL_ADMIN || getReplyTo()),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(process.env.RESEND_EMAIL_ADMIN || getReplyTo()),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(process.env.RESEND_EMAIL_ADMIN || getReplyTo()),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject,
    html,
  });
};

/**
 * Drip Campaign Emails: Send automated follow-up emails to unclaimed listings
 */

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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(payload.vendorEmail),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(payload.vendorEmail),
    reply_to: getReplyTo(),
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

  await resend.emails.send({
    from: getFrom(),
    to: getToAddress(payload.vendorEmail),
    reply_to: getReplyTo(),
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

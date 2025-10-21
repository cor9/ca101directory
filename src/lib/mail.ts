import { ApprovalEmail } from "@/emails/approval-email";
import ListingSubmittedEmail from "@/emails/listing-submitted";
import { NotifySubmissionEmail } from "@/emails/notify-submission-to-admin";
import { NotifySubmissionToUserEmail } from "@/emails/notify-submission-to-user";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import RejectionEmail from "@/emails/rejection-email";
import { ResetPasswordEmail } from "@/emails/reset-password";
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

export const sendPasswordResetEmail = async (
  userName: string,
  email: string,
  token: string,
) => {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({ userName, resetLink: resetLink }),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
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
  // console.log(`sendNotifySubmissionEmail,
  //   userName: ${userName},
  //   userEmail: ${userEmail},
  //   itemName: ${itemName},
  //   reviewLink: ${reviewLink},
  //   statusLink: ${statusLink}`);

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: userEmail,
    subject: "Thank you for your submission",
    react: NotifySubmissionToUserEmail({
      userName,
      itemName,
      statusLink,
    }),
  });

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
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
    from: process.env.RESEND_EMAIL_FROM,
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
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
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
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
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

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
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
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
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
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
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
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject,
    html,
  });
};

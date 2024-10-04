import { Resend } from "resend";
import { ResetPasswordEmail } from "@/emails/reset-password";
import VerifyEmail from "@/emails/verify-email";
import { NotifySubmissionEmail } from "@/emails/notify-submission";

export const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string,
) => {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`;

  // html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({ userName: name, resetLink: resetLink })
  });
};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  // html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Confirm your email",
    react: VerifyEmail({ confirmLink: confirmLink })
  });
};

export const sendNotifySubmissionEmail = async (
  link: string,
) => {
  
  // html: `<p>Click <a href="${link}">here</a> to review submission.</p>`
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject: "New submission",
    react: NotifySubmissionEmail({ submissionLink: link })
  });
};
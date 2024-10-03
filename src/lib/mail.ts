import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  });
};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};

export const sendSubmissionNotificationEmail = async (
  link: string,
) => {
  
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject: "New submission",
    html: `<p>Click <a href="${link}">here</a> to review submission.</p>`
  });
};
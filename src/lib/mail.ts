import { Resend } from "resend";
import { ResetPasswordEmail } from "@/emails/reset-password";
import VerifyEmail from "@/emails/verify-email";
import { NotifySubmissionEmail } from "@/emails/notify-submission";
import { PaymentSuccessEmail } from "@/emails/payment-success";

export const resend = new Resend(process.env.RESEND_API_KEY);

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
    react: ResetPasswordEmail({ userName, resetLink: resetLink })
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
    react: VerifyEmail({ confirmLink })
  });
};

export const sendNotifySubmissionEmail = async (
  submissionLink: string,
) => {
  
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject: "New submission",
    react: NotifySubmissionEmail({ submissionLink })
  });
};

export const sendPaymentSuccessEmail = async (
  email: string,
  userName: string,
  itemLink: string,
) => {
  
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Thank your for your submission",
    react: PaymentSuccessEmail({ userName,itemLink })
  });
};
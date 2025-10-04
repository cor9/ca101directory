"use server";

import { NewsletterWelcomeEmail } from "@/emails/newsletter-welcome";
import { resend } from "@/lib/mail";
import { addSubscriberToMailerLite } from "@/lib/mailerlite";
import { type NewsletterFormData, NewsletterFormSchema } from "@/lib/schemas";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  formdata: NewsletterFormData,
): Promise<ServerActionResponse> {
  try {
    const validatedInput = NewsletterFormSchema.safeParse(formdata);
    if (!validatedInput.success) {
      return { status: "error", message: "Invalid input" };
    }

    // Add subscriber to MailerLite (with fallback)
    let mailerLiteSuccess = false;
    try {
      const mailerLiteResult = await addSubscriberToMailerLite({
        email: validatedInput.data.email,
        fields: {
          source: "childactor101-directory",
          subscribed_at: new Date().toISOString(),
        },
      });

      mailerLiteSuccess = mailerLiteResult.success;

      if (!mailerLiteResult.success) {
        console.warn("MailerLite subscription failed:", mailerLiteResult.error);
        // Don't fail the entire process if MailerLite fails
      }
    } catch (mailerLiteError) {
      console.warn("MailerLite error:", mailerLiteError);
      // Continue without failing the entire process
    }

    // Send welcome email via Resend (with fallback)
    let emailSent = false;
    try {
      const emailSentResult = await resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM,
        to: validatedInput.data.email,
        subject: "Welcome to Child Actor 101 Directory Newsletter!",
        react: NewsletterWelcomeEmail({ email: validatedInput.data.email }),
      });

      emailSent = !emailSentResult.error;

      if (emailSentResult.error) {
        console.warn("Welcome email failed to send:", emailSentResult.error);
      }
    } catch (emailError) {
      console.warn("Welcome email error:", emailError);
    }

    // Return success if either MailerLite or email worked
    if (mailerLiteSuccess || emailSent) {
      return {
        status: "success",
        message: "Successfully subscribed to newsletter",
      };
    }

    return {
      status: "error",
      message: "Failed to subscribe to newsletter",
    };
  } catch (error) {
    console.error("subscribeToNewsletter, error:", error);
    return {
      status: "error",
      message: "Failed to subscribe to the newsletter",
    };
  }
}

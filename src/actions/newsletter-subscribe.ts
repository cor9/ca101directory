"use server";

import { resend } from "@/lib/mail";
import { NewsletterFormData, NewsletterFormSchema } from "@/lib/schemas";
import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome-email"

/**
 * Subscribe to the newsletter
 */
export async function subscribeToNewsletter(
  formdata: NewsletterFormData
): Promise<"exists" | "error" | "success"> {
  try {
    const validatedInput = NewsletterFormSchema.safeParse(formdata);
    if (!validatedInput.success) return "error";

    const subscribedResult = await resend.contacts.create({
      email: validatedInput.data.email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    console.log("subscribeToNewsletter, subscribedResult", subscribedResult);
    const subscribed = !subscribedResult.error;

    if (subscribed) {
      const emailSentResult = await resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM,
        to: validatedInput.data.email,
        subject: "Welcome to our newsletter!",
        react: NewsletterWelcomeEmail(),
      });
      console.log("subscribeToNewsletter, emailSentResult", emailSentResult);
      const emailSent = !emailSentResult.error;
      return emailSent ? "success" : "error";
    }

    return "error";
  } catch (error) {
    console.error(error);
    throw new Error("Error subscribing to the newsletter");
  }
}

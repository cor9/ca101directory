"use server";

import { resend } from "@/lib/mail";
import { NewsletterFormSchema } from "@/lib/schemas";
import { NewsletterFormData } from "@/types";

/**
 * unsubscribe to the newsletter
 */
export async function unsubscribeToNewsletter(
  formdata: NewsletterFormData
): Promise<"error" | "success"> {
  try {
    const validatedInput = NewsletterFormSchema.safeParse(formdata);
    if (!validatedInput.success) return "error";

    const unsubscribedResult = await resend.contacts.create({
      email: validatedInput.data.email,
      unsubscribed: true,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    console.log("unsubscribeToNewsletter, unsubscribedResult", unsubscribedResult);
    const unsubscribed = !unsubscribedResult.error;
    return unsubscribed ? "success" : "error";
  } catch (error) {
    console.error(error);
    throw new Error("Error subscribing to the newsletter");
  }
}

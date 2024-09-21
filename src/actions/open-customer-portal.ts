"use server";

import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export type ServerActionResponse = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/billing");

// TODO(javayhu): not used yet
export async function openCustomerPortal(
  stripeCustomerId: string,
): Promise<ServerActionResponse> {
  let redirectUrl: string = "";

  try {
    const user = await currentUser();
    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }

    if (stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: billingUrl,
      });

      redirectUrl = stripeSession.url as string;
    }
  } catch (error) {
    throw new Error("Failed to open customer portal");
  }

  redirect(redirectUrl);
}

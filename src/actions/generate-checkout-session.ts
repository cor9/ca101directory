"use server";

import { auth } from "@/auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getUserPricePlan } from "@/lib/payment";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
}

const billingUrl = absoluteUrl("/dashboard");
// const billingUrl = absoluteUrl("/pricing");

// https://github.com/javayhu/lms-studio-antonio/blob/main/app/api/courses/%5BcourseId%5D/checkout/route.ts
// stripe checkout session
export async function generateCheckoutSession(priceId: string, itemId: string): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    const user = useCurrentUser();
    if (!user || !user.email || !user.id) {
      throw new Error("Unauthorized");
    }

    const userPricePlan = await getUserPricePlan(user.id);
    console.log('userPricePlan:', userPricePlan);

    // User on Paid Plan - Create a portal session to manage billing.
    if (userPricePlan.isPaid && userPricePlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userPricePlan.stripeCustomerId,
        return_url: billingUrl,
      });

      redirectUrl = stripeSession.url as string;
    }

    // User on Free Plan - Create a checkout session to upgrade.
    else {
      // create a customer in Stripe and in Sanity If not exists
      let stripeCustomer = await sanityClient.fetch(
        `*[_type == "customer" && userId == "${user.id}"][0]`
      );
      if (!stripeCustomer) {
        console.log('creating customer in Stripe and Sanity');
        const customer = await stripe.customers.create({
          email: user.email,
        });
        if (!customer) {
          throw new Error("Failed to create customer");
        }

        stripeCustomer = await sanityClient.create({
          _type: "customer",
          user: {
            _type: "reference",
            _ref: user.id,
          },
          stripeCustomer: customer.id,
        });
      }

      // define line items for stripe check out page.
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: 'Test Product',
            },
            unit_amount: Math.round(item.price! * 100),
          },
          quantity: 1,
        },
      ];

      // create stripe checkout session
      const stripeSession = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        success_url: billingUrl,
        cancel_url: billingUrl,
        // payment_method_types: ["card"],
        // billing_address_collection: "auto",
        // customer_email: user.email,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          itemId: itemId ?? "",
        },
      })

      redirectUrl = stripeSession.url as string;
    }
  } catch (error) {
    throw new Error("Failed to generate user stripe session");
  }

  // no revalidatePath because redirect
  redirect(redirectUrl);
}
"use server";

import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { Item, User } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { redirect } from "next/navigation";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  stripeUrl?: string;
}

// https://github.com/javayhu/lms-studio-antonio/blob/main/app/api/courses/%5BcourseId%5D/checkout/route.ts
// TODO(javayhu): stripe checkout session, how to handle the errors???
export async function createCheckoutSession(itemId: string, priceId: string): Promise<ServerActionResponse> {
  let redirectUrl: string = "";

  try {
    // TODO(javayhu): can not useCurrentUser but can use currentUser() here, don't know why
    const user = await currentUser();
    if (!user || !user.email || !user.id) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    const item = await sanityFetch<Item>({
      query: `*[_type == "item" && _id == "${itemId}"][0]`
    });
    if (!item) {
      return {
        status: "error",
        message: "Not found",
      };
    }

    // 1. get user's stripeCustomerId
    const sanityUser = await sanityFetch<User>({
      query: `*[_type == "user" && _id == "${user.id}"][0]`
    });
    if (item.submitter._ref != user.id) {
      return {
        status: "error",
        message: "You are not the submitter of this item",
      }
    }
    let stripeCustomerId = sanityUser?.stripeCustomerId;
    console.log('stripeCustomerId:', stripeCustomerId);

    // 2. if the item is paid and the submitter is the user, then redirect to the billing portal
    if (stripeCustomerId && item.paid) {
      console.log('item is paid, redirect to billing portal');
      const billingUrl = absoluteUrl("/billing");
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: billingUrl,
      });
      redirectUrl = stripeSession.url as string;
      // console.log('stripe billing portal session created, url:', redirectUrl);
    } else {
      // 3. make sure the user has a stripeCustomerId
      console.log('item is not paid, redirect to stripe checkout session');
      if (!stripeCustomerId) {
        console.log('creating customer in Stripe and Sanity');
        const customer = await stripe.customers.create({
          email: user.email,
        });
        if (!customer) {
          return {
            status: "error",
            message: "Failed to create customer in Stripe",
          };
        }

        const result = await sanityClient.patch(user.id).set({
          stripeCustomerId: customer.id,
        }).commit();
        if (!result) {
          return {
            status: "error",
            message: "Failed to save customer in Sanity",
          };
        }
        stripeCustomerId = customer.id;
      }

      // 4. create stripe checkout session
      console.log('creating stripe checkout session'
        + ', customerId:' + stripeCustomerId +
        + ', priceId:' + priceId +
        + ', userId:' + user.id +
        + ', itemId:' + itemId);
      const successUrl = absoluteUrl(`/submit/publish/${itemId}`);
      const cancelUrl = absoluteUrl(`/submit/plan/${itemId}`);
      const stripeSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          itemId: itemId,
        },
        // TODO(javayhu): payment_method_types and billing_address_collection???
        payment_method_types: ["card"],
        billing_address_collection: "auto",
      })

      redirectUrl = stripeSession.url as string;
      console.log('stripe checkout session created, url:', redirectUrl);
    }
  } catch (error) {
    return {
      status: "error",
      message: "Failed to generate stripe checkout session",
    };
  }

  // 5. redirect to new url, no revalidatePath because redirect
  redirect(redirectUrl);
}
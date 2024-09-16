"use server";

import { auth } from "@/auth";
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
    // TODO(javayhu): can not useCurrentUser here, don't know why
    const session = await auth();
    const user = session?.user;
    if (!user || !user.email || !user.id) {
      throw new Error("Unauthorized");
    }

    // const userPricePlan = await getUserPricePlan(user.id);
    // console.log('userPricePlan:', userPricePlan);
    // // User on Paid Plan - Create a portal session to manage billing.
    // if (userPricePlan.isPaid && userPricePlan.stripeCustomerId) {
    //   const stripeSession = await stripe.billingPortal.sessions.create({
    //     customer: userPricePlan.stripeCustomerId,
    //     return_url: billingUrl,
    //   });

    //   redirectUrl = stripeSession.url as string;
    // }

    // User on Free Plan - Create a checkout session to upgrade.
    else {
      // create a customer in Stripe and in Sanity If not exists
      let stripeCustomer = await sanityClient.fetch(
        `*[_type == "stripeCustomer" && user._id == "${user.id}"][0]`
      );
      if (!stripeCustomer) {
        console.log('creating customer in Stripe and Sanity');
        const customer = await stripe.customers.create({
          email: user.email,
        });
        if (!customer) {
          throw new Error("Failed to create stripe customer");
        }

        stripeCustomer = await sanityClient.create({
          _type: "stripeCustomer",
          user: {
            _type: "reference",
            _ref: user.id,
          },
          stripeCustomerId: customer.id,
        });
        if (!stripeCustomer) {
          console.log("create stripeCustomer, fail");
          throw new Error("Failed to create stripe customer in sanity");
        }
      }

      // TODO(javayhu): how to get price!!!
      // define line items for stripe check out page.
      
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {

          // price_data 下面这里创建price_data有问题，还需要指定prodcut
          // // StripeInvalidRequestError: You must specify either `product` or `product_data` when creating a price.
          // price_data: {
          //   currency: "usd",
          //   unit_amount: Math.round(9.9 * 100),
          // },

          // 另一种写法就是直接给priceId
          price: priceId,
          quantity: 1,
        },
      ];

      // create stripe checkout session
      console.log('creating stripe checkout session, '
        +'customerId:', stripeCustomer.stripeCustomerId,
        +'email:', user.email,
        +'userId:', user.id,
        +'itemId:', itemId);
      const stripeSession = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        success_url: billingUrl,
        cancel_url: billingUrl,
        // payment_method_types: ["card"],
        // billing_address_collection: "auto",

        // NOTICE(javayhu) set customer_email maybe helpful for quick checkout
        // nope, you can not set both customer and customer_email
        // 亲测，如果设置了customer，其实在checkout页面，email也就自动填充了
        // StripeInvalidRequestError: You may only specify one of these parameters: customer, customer_email.
        // customer_email: user.email,
        mode: "payment",
        line_items: lineItems,
        metadata: {
          userId: user.id,
          itemId: itemId ?? "",
        },
      })

      redirectUrl = stripeSession.url as string;
      console.log('stripe checkout session created, url:', redirectUrl);
    }
  } catch (error) {
    console.log('generateCheckoutSession, error:', error);
    throw new Error("Failed to generate user stripe checkout session");
  }

  // no revalidatePath because redirect
  redirect(redirectUrl);
}
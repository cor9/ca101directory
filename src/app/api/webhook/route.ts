import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/lib/client";
import { getUserById } from "@/data/user";

// https://github.com/mickasmt/next-saas-stripe-starter/blob/main/app/api/webhooks/stripe/route.ts


// https://github.com/javayhu/lms-studio-antonio/blob/main/app/api/webhook/route.ts
// This file handles webhook events from Stripe. It verifies the signature
// of each request to ensure that the request is coming from Stripe. It also
// handles the checkout.session.completed event type by creating a new purchase record in the database.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // console.log('stripe webhook event:', event);
  console.log('stripe webhook event.type:', event.type);

  if (event.type === "checkout.session.completed") {
    console.log('checkout.session.completed event');
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const itemId = session?.metadata?.itemId;
    // console.log('session:', session);
    console.log('session?.metadata?.userId:', userId);
    console.log('session?.metadata?.itemId:', itemId);

    // Retrieve the subscription details from Stripe.
    // const subscription = await stripe.subscriptions.retrieve(
    //   session.subscription as string,
    // );
    // console.log('subscription:', subscription);

    // console.log('subscription.id:', subscription.id);
    // console.log('subscription.customer:', subscription.customer);
    // console.log('subscription.items.data[0].price.id:', subscription.items.data[0].price.id);
    // console.log('subscription.current_period_end:', subscription.current_period_end);

    const user = await getUserById(session?.metadata?.userId);
    console.log('user:', user);

    // 获取 stripeCustomerId
  const stripeCustomerId = session.customer as string;
  console.log('stripeCustomerId:', stripeCustomerId);

  // 获取 stripePriceId
  const stripePriceId = session.line_items?.data[0]?.price?.id;
  console.log('stripePriceId:', stripePriceId);
    
    if (user) {
      const result = await sanityClient.patch(user._id).set({
        // stripeSubscriptionId: subscription.id,
        stripeCustomerId: stripeCustomerId,
        stripePriceId: stripePriceId,
        // stripeCurrentPeriodEnd: new Date(
        //   subscription.current_period_end * 1000,
        // ),
      }).commit();

      if (!result) {
        console.log("checkout.session.completed, update data failed");
        return new Response(null, { status: 500 });
      }
    } else {
      console.log("checkout.session.completed, user not found");
      return new Response(null, { status: 404 });
    }
  }

  return new Response(null, { status: 200 });
}

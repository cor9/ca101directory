import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/lib/client";
import { getUserById } from "@/data/user";


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
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const itemId = session?.metadata?.itemId;

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    // await prisma.user.update({
    //   where: {
    //     id: session?.metadata?.userId,
    //   },
    //   data: {
    //     stripeSubscriptionId: subscription.id,
    //     stripeCustomerId: subscription.customer as string,
    //     stripePriceId: subscription.items.data[0].price.id,
    //     stripeCurrentPeriodEnd: new Date(
    //       subscription.current_period_end * 1000,
    //     ),
    //   },
    // });

    // change query from Prisma to Sanity
    console.log('checkout.session.completed event');
    // console.log('session:', session);
    // console.log('subscription:', subscription);
    console.log('session?.metadata?.userId:', session?.metadata?.userId);
    console.log('subscription.id:', subscription.id);
    console.log('subscription.customer:', subscription.customer);
    console.log('subscription.items.data[0].price.id:', subscription.items.data[0].price.id);
    console.log('subscription.current_period_end:', subscription.current_period_end);

    const user = await getUserById(session?.metadata?.userId);
    // console.log('user:', user);
    
    if (user) {
      const result = await sanityClient.patch(user._id).set({
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
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

  if (event.type === "invoice.payment_succeeded") {
    const session = event.data.object as Stripe.Invoice;

    // If the billing reason is not subscription_create, it means the customer has updated their subscription.
    // If it is subscription_create, we don't need to update the subscription id and it will handle by the checkout.session.completed event.
    if (session.billing_reason != "subscription_create") {
      // Retrieve the subscription details from Stripe.
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      // Update the price id and set the new period end.
      // await prisma.user.update({
      //   where: {
      //     stripeSubscriptionId: subscription.id,
      //   },
      //   data: {
      //     stripePriceId: subscription.items.data[0].price.id,
      //     stripeCurrentPeriodEnd: new Date(
      //       subscription.current_period_end * 1000,
      //     ),
      //   },
      // });

      // change query from Prisma to Sanity
      console.log('invoice.payment_succeeded event');
      console.log('session:', session);
      console.log('subscription:', subscription);

      // use patch(selection: MutationSelection, operations?: PatchOperations): Patch to patch document
      const user = await sanityClient.fetch(`*[_type == "user" && stripeSubscriptionId == $subscriptionId][0]`, {
        subscriptionId: subscription.id,
      });
      console.log('user:', user);

      if (user) {
        const result = await sanityClient.patch( user._id ).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          })
          .commit();
        
        if (!result) {
          console.log("invoice.payment_succeeded, update data failed");
          return new Response(null, { status: 500 });
        }
      } else {
        console.log("invoice.payment_succeeded, user not found");
        return new Response(null, { status: 404 });
      }
    }
  }

  return new Response(null, { status: 200 });
}

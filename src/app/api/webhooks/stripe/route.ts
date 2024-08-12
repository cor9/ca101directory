import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sanityClient } from "@/sanity/lib/client";

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

  console.log('stripe webhook event:', event);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.

    // TODO: update query
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

    console.log('checkout.session.completed event');
    console.log('session:', session);
    console.log('subscription:', subscription);
    console.log('session?.metadata?.userId:', session?.metadata?.userId);
    console.log('subscription.id:', subscription.id);
    console.log('subscription.customer:', subscription.customer);
    console.log('subscription.items.data[0].price.id:', subscription.items.data[0].price.id);
    console.log('subscription.current_period_end:', subscription.current_period_end);

    sanityClient.patch(session?.metadata?.userId).set({
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscription.current_period_end * 1000,
      ),
    });
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
      
      // TODO: update query
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

      console.log('invoice.payment_succeeded event');
      console.log('session:', session);
      console.log('subscription:', subscription);

      // use patch(selection: MutationSelection, operations?: PatchOperations): Patch to patch document
      const user = await sanityClient.fetch(`*[_type == "user" && stripeSubscriptionId == $subscriptionId][0]`, {
        subscriptionId: subscription.id,
      });
      sanityClient.patch( user._id ).set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      })
    }
  }

  return new Response(null, { status: 200 });
}

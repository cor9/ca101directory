"use client";

import { generateCheckoutSession } from "@/actions/generate-checkout-session";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { PricePlan, UserPricePlan } from "@/types";
import { useTransition } from "react";

interface PayButtonProps {
  itemId?: string;
  pricePlan: PricePlan;
  userPricePlan: UserPricePlan;
}

export function PayButton({ itemId, pricePlan, userPricePlan }: PayButtonProps) {
  let [isPending, startTransition] = useTransition();

  // TODO: server action bind id!!!
  const generateUserStripeSession = generateCheckoutSession.bind(
    null,
    pricePlan.stripePriceId,
    itemId,
  );

  const stripeSessionAction = () => {
    startTransition(async () => {
      await generateUserStripeSession();
    });
  };

  // TODO(javayhu): what does uesrOffer means???
  const userOffer = pricePlan.stripePriceId === userPricePlan.stripePriceId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      className="w-full rounded-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{userOffer ? "Manage" : "Upgrade"}</>
      )}
    </Button>
  );
}

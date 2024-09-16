"use client";

import { generateCheckoutSession } from "@/actions/generate-checkout-session";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { ItemFullInfo, PricePlan } from "@/types";
import { useTransition } from "react";

interface PayButtonProps {
  item: ItemFullInfo;
  pricePlan: PricePlan;
}

export function PayButton({ item, pricePlan }: PayButtonProps) {
  let [isPending, startTransition] = useTransition();

  // TODO: server action bind id!!!
  const generateSubmissionCheckoutSession = generateCheckoutSession.bind(
    null,
    pricePlan.stripePriceId,
    item._id,
  );

  const stripeCheckoutSessionAction = () => {
    startTransition(async () => {
      await generateSubmissionCheckoutSession();
    });
  };

  // TODO(javayhu): what does uesrOffer means???
  // const userOffer = pricePlan.stripePriceId === userPricePlan.stripePriceId;

  return (
    <Button
      // variant={userOffer ? "default" : "outline"}
      variant={"outline"}
      className="w-full rounded-full"
      disabled={isPending}
      onClick={stripeCheckoutSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {/* {userOffer ? "Manage" : "Upgrade"} */}
          {"Pay"}
        </>
      )}
    </Button>
  );
}

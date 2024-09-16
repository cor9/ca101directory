"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
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

  // TODO(javayhu): server action bind id!!!
  const createSubmissionCheckoutSessionAction = createCheckoutSession.bind(
    null,
    pricePlan.stripePriceId,
    item._id,
  );

  const createCheckoutSessionAction = () => {
    startTransition(async () => {
      try {
        const result = await createSubmissionCheckoutSessionAction();
        if (result.status === "success") {
          window.location.href = result.stripeUrl;
        }
      } catch (error) {
        console.error(error);
      }
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
      onClick={createCheckoutSessionAction}
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

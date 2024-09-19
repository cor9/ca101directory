"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { ItemFullInfo, PricePlan } from "@/types";
import { RocketIcon } from "lucide-react";
import { useTransition } from "react";

interface ProPlanButtonProps {
  item: ItemFullInfo;
  pricePlan: PricePlan;
}

export function ProPlanButton({ item, pricePlan }: ProPlanButtonProps) {
  let [isPending, startTransition] = useTransition();

  // TODO(javayhu): server action bind args!!!
  const createSubmissionCheckoutSessionAction = createCheckoutSession.bind(
    null,
    pricePlan.stripePriceId,
    item._id,
  );

  const createCheckoutSessionAction = () => {
    startTransition(async () => {
      try {
        const result = await createSubmissionCheckoutSessionAction();
        console.log('createCheckoutSessionAction, result:', result);
      } catch (error) {
        console.error('createCheckoutSessionAction, error:', error);
      }
    });
  };

  return (
    <Button
      size="lg"
      variant={"default"}
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
          <RocketIcon className="mr-2 size-4 animate-pulse" />
          <span>Pay to Publish Right Now</span>
        </>
      )}
    </Button>
  );
}

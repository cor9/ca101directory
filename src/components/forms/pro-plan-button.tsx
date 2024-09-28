"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItemInfo, PricePlan } from "@/types";
import { RocketIcon } from "lucide-react";
import { useTransition } from "react";

interface ProPlanButtonProps {
  item: ItemInfo;
  pricePlan: PricePlan;
  className?: string;
}

export function ProPlanButton({ item, pricePlan, className }: ProPlanButtonProps) {
  let [isPending, startTransition] = useTransition();

  // TODO(javayhu): why server action bind args here?
  // const createCheckoutSessionAction = createCheckoutSession.bind(
  //   null,
  //   item._id,
  //   pricePlan.stripePriceId,
  // );

  const createCheckoutSessionAction = () => {
    startTransition(async () => {
      try {
        const result = await createCheckoutSession(item._id, pricePlan.stripePriceId);
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
      className={cn("rounded-full group overflow-hidden", className)}
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
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Pay to Publish Right Now</span>
        </>
      )}
    </Button>
  );
}

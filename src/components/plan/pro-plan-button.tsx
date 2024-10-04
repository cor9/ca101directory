"use client";

import React from "react";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Icons } from "@/components/icons/icons";
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

  const handleCreateCheckoutSession = () => {
    startTransition(async () => {
      try {
        const result = await createCheckoutSession(item._id, pricePlan.stripePriceId);
        console.log('handleCreateCheckoutSession, result:', result);
      } catch (error) {
        console.error('handleCreateCheckoutSession, error:', error);
      }
    });
  };

  return (
    <Button
      size="lg"
      variant={"default"}
      className={cn("rounded-full group overflow-hidden", className)}
      disabled={isPending}
      onClick={handleCreateCheckoutSession}
    >
      {isPending ? (
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Pay to Publish Right Now</span>
        </div>
      )}
    </Button>
  );
}

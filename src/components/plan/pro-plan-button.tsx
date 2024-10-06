"use client";

import React from "react";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItemInfo, PricePlan } from "@/types";
import { ArrowUpLeftIcon, CheckCircleIcon, EditIcon, RocketIcon } from "lucide-react";
import { useTransition } from "react";
import { ProPlanStatus } from "@/lib/submission";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProPlanButtonProps {
  item: ItemInfo;
  pricePlan: PricePlan;
  className?: string;
}

export function ProPlanButton({ item, pricePlan, className }: ProPlanButtonProps) {
  console.log('ProPlanButton, item:', item);
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const handleCreateCheckoutSession = () => {
    startTransition(async () => {
      createCheckoutSession(item._id, pricePlan.stripePriceId)
        .then((data) => {
          console.log('createCheckoutSession, data:', data);
          // already redirected to stripe checkout page in server action
        })
        .catch((error) => {
          console.error('createCheckoutSession, error:', error);
          toast.error('Failed to create checkout session');
        });
    });
  };

  const handleClick = () => {
    console.log('ProPlanButton, handleClick, item.proPlanStatus:', item.proPlanStatus);
    if (item.proPlanStatus === ProPlanStatus.SUBMITTING
      || item.proPlanStatus === ProPlanStatus.PENDING) {
      // maybe in pro plan or free plan before
      console.log('ProPlanButton, handleClick, creating checkout session');
      handleCreateCheckoutSession();
    } else if (item.proPlanStatus === ProPlanStatus.SUCCESS) {
      if (item.publishDate) {
        // already published
        console.log('ProPlanButton, handleClick, already published');
        router.push(`/dashboard`);
      } else {
        // pay success but not published yet
        console.log('ProPlanButton, handleClick, pay success but not published yet');
        router.push(`/publish/${item._id}`);
      }
    } else {
      console.error('ProPlanButton, invalid pro plan status:', item.proPlanStatus);
    }
  };

  return (
    <Button
      size="lg"
      variant="default"
      className={cn("group overflow-hidden", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        // when creating checkout session
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : item.proPlanStatus === ProPlanStatus.SUCCESS ? (
        // maybe published already(pay success or approved in free plan)
        item.publishDate ? (
          <div className="flex items-center justify-center">
            <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
            <span>Go back to dashboard</span>
          </div>
        ) : (
          // maybe pay success but not published yet
          <div className="flex items-center justify-center">
            <CheckCircleIcon className="mr-2 size-4 icon-scale" />
            <span>Go to Publish</span>
          </div>
        )
      ) : (
        // not paid success yet
        <div className="flex items-center justify-center">
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Pay to Publish Right Now</span>
        </div>
      )}
    </Button>
  );
}

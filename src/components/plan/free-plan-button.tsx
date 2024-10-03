"use client";

import React from "react";
import { submitToReview } from "@/actions/submit-to-review";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ArrowUpLeftIcon, CheckCircleIcon, Clock3Icon, EditIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons/icons";
import { FreePlanStatus } from "@/lib/submission";

interface FreePlanButtonProps {
  item: ItemInfo;
  className?: string;
}

export function FreePlanButton({ item, className }: FreePlanButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  // console.log('FreePlanButton, item:', item);

  const submitToReviewAction = () => {
    startTransition(async () => {
      try {
        const result = await submitToReview(item._id);
        console.log('submitToReviewAction, result:', result);
        if (result.success) {
          router.refresh();

          toast.success("Submit to review success");
        } else { // TODO: handle error
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('submitToReviewAction, error:', error);
      }
    });
  };

  const handleClick = () => {
    if (item.publishDate) { // already published
      router.push(`/dashboard`);
    } else if (item.freePlanStatus === FreePlanStatus.SUBMITTING) {
      submitToReviewAction();
    } else if (item.freePlanStatus === FreePlanStatus.APPROVED) {
      router.push(`/publish/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.REJECTED) {
      router.push(`/edit/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.PENDING) {
      router.push(`/dashboard`);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn("rounded-full group overflow-hidden", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {
        item.publishDate ? (
          <div className="flex items-center justify-center">
            <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
            <span>Go back to dashboard</span>
          </div>
        ) : (
          <div>
            {isPending ? (
              <div className="flex items-center justify-center">
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                <span>Submitting to review...</span>
              </div>
            ) : item.freePlanStatus === FreePlanStatus.PENDING ? (
              <div className="flex items-center justify-center">
                <Clock3Icon className="mr-2 size-4 icon-scale" />
                <span>Go back and Wait for review</span>
              </div>
            ) : item.freePlanStatus === FreePlanStatus.APPROVED ? (
              <div className="flex items-center justify-center">
                <CheckCircleIcon className="mr-2 size-4 icon-scale" />
                <span>Go to Publish</span>
              </div>
            ) : item.freePlanStatus === FreePlanStatus.REJECTED ? (
              <div className="flex items-center justify-center">
                <EditIcon className="mr-2 size-4 icon-scale" />
                <span>Go to Edit and Submit again</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <SendIcon className="mr-2 size-4 icon-scale" />
                <span>Submit to review</span>
              </div>
            )}
          </div>
        )
      }
    </Button>
  );
}

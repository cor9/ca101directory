"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ArrowUpLeftIcon, CheckCircleIcon, Clock3Icon, EditIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
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
      router.push(`/submit/publish/${item._id}`);
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
          <>
            <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
            <span>Go back to dashboard</span>
          </>
        ) : (
          <>
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                <span>Submitting to review...</span>
              </>
            ) : item.freePlanStatus === FreePlanStatus.PENDING ? (
              <>
                <Clock3Icon className="mr-2 size-4 icon-scale" />
                <span>Go back and Wait for review</span>
              </>
            ) : item.freePlanStatus === FreePlanStatus.APPROVED ? (
              <>
                <CheckCircleIcon className="mr-2 size-4 icon-scale" />
                <span>Go to Publish</span>
              </>
            ) : item.freePlanStatus === FreePlanStatus.REJECTED ? (
              <>
                <EditIcon className="mr-2 size-4 icon-scale" />
                <span>Go to Edit and Submit again</span>
              </>
            ) : (
              <>
                <SendIcon className="mr-2 size-4 icon-scale" />
                <span>Submit to review</span>
              </>
            )}
          </>
        )
      }
    </Button>
  );
}

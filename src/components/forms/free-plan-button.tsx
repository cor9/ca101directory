"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { Clock3Icon, HourglassIcon, CheckCircleIcon, FilePenLineIcon, ChevronLeftIcon, ArrowLeftIcon } from "lucide-react";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FreePlanButtonProps {
  item: ItemFullInfo;
  className?: string;
}

export function FreePlanButton({ item, className }: FreePlanButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const submitToReviewAction = () => {
    startTransition(async () => {
      try {
        const result = await submitToReview(item._id);
        console.log('submitToReviewAction, result:', result);
        if (result.success) {
          router.refresh();
        } else { // TODO: handle error
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('submitToReviewAction, error:', error);
      }
    });
  };

  const handleClick = () => {
    if (item.publishDate) {
      router.push(`/dashboard`);
    } else if (item.freePlanStatus === 'submitted') {
      submitToReviewAction();
    } else if (item.freePlanStatus === 'approved') {
      router.push(`/submit/publish/${item._id}`);
    } else if (item.freePlanStatus === 'rejected') {
      router.push(`/edit/${item._id}`);
    } else if (item.freePlanStatus === 'pending') {
      router.push(`/dashboard`);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn("rounded-full", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {
        item.publishDate ? (
          <>
            <ArrowLeftIcon className="mr-2 size-4" />
            <span>Go back to dashboard</span>
          </>
        ) : (
          <>
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 size-4 animate-spin" />
                <span>Submitting to review...</span>
              </>
            ) : item.freePlanStatus === 'pending' ? (
              <>
                <HourglassIcon className="mr-2 size-4" />
                <span>Go back and wait for review</span>
              </>
            ) : item.freePlanStatus === 'approved' ? (
              <>
                <CheckCircleIcon className="mr-2 size-4" />
                <span>Go to Publish</span>
              </>
            ) : item.freePlanStatus === 'rejected' ? (
              <>
                <FilePenLineIcon className="mr-2 size-4" />
                <span>Go to Edit</span>
              </>
            ) : (
              <>
                <Clock3Icon className="mr-2 size-4" />
                <span>Submit to review queue</span>
              </>
            )}
          </>
        )
      }
    </Button>
  );
}

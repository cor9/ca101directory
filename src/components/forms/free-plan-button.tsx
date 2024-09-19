"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { Clock3Icon, HourglassIcon, CheckCircleIcon, XCircleIcon, FilePenLineIcon } from "lucide-react";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { useRouter } from "next/navigation";

interface FreePlanButtonProps {
  item: ItemFullInfo;
}

export function FreePlanButton({ item }: FreePlanButtonProps) {
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
    if (item.freePlanStatus === 'submitted') {
      submitToReviewAction();
    } else if (item.freePlanStatus === 'approved') {
      router.push(`/submit/publish/${item._id}`);
    } else if (item.freePlanStatus === 'rejected') {
      router.push(`/update/${item._id}`);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full rounded-full"
      disabled={isPending || item.freePlanStatus === 'reviewing'}
      onClick={handleClick}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Submitting to review...</span>
        </>
      ) : item.freePlanStatus === 'reviewing' ? (
        <>
          <HourglassIcon className="mr-2 size-4 animate-spin" />
          <span>Waiting for review</span>
        </>
      ) : item.freePlanStatus === 'approved' ? (
        <>
          <CheckCircleIcon className="mr-2 size-4 text-green-500" />
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
          <span>Submit to waiting queue</span>
        </>
      )}
    </Button>
  );
}

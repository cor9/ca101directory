"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { HourglassIcon } from "lucide-react";
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
          router.push(`/dashboard`);
        } else { // TODO(javayhu): handle error
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('submitToReviewAction, error:', error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full"
      disabled={isPending}
      onClick={submitToReviewAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <HourglassIcon className="mr-2 size-4" />
          <span>Submit to waiting queue</span>
        </>
      )}
    </Button>
  );
}

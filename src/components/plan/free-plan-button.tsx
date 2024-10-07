"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { FreePlanStatus } from "@/lib/submission";
import { cn } from "@/lib/utils";
import { ItemInfo } from "@/types";
import { ArrowUpLeftIcon, CheckCircleIcon, Clock3Icon, EditIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface FreePlanButtonProps {
  item?: ItemInfo;
  className?: string;
}

export function FreePlanButton({ item, className }: FreePlanButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  // console.log('FreePlanButton, item:', item);

  const submitToReviewAction = () => {
    startTransition(async () => {
      submitToReview(item._id)
        .then((data) => {
          if (data.status === "success") {
            console.log('submitToReviewAction, success:', data.message);
            router.refresh();
            toast.success('Successfully submitted to review');
          }
          if (data.status === "error") {
            console.error('submitToReviewAction, error:', data.message);
            toast.error(data.message);
          }
        })
        .catch((error) => {
          console.error('submitToReviewAction, error:', error);
          toast.error('Failed to submit to review');
        });
    });
  };

  const handleClick = () => {
    if (!item) { // no specific item in pricing page
      router.push(`/submit`);
    } else if (item.publishDate) { // already published
      router.push(`/dashboard`);
    } else if (item.freePlanStatus === FreePlanStatus.SUBMITTING) {
      submitToReviewAction();
    } else if (item.freePlanStatus === FreePlanStatus.APPROVED) {
      router.push(`/publish/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.REJECTED) {
      router.push(`/edit/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.PENDING) {
      router.push(`/dashboard`);
    } else {
      console.error('FreePlanButton, invalid free plan status:', item.freePlanStatus);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      className={cn("group overflow-hidden", className)}
      disabled={isPending}
      onClick={handleClick}
    >
      {!item ? (
        <div className="flex items-center justify-center">
          <span>Go to Submit</span>
        </div>
      ) : item.publishDate ? (
        <div className="flex items-center justify-center">
          <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
          <span>Go back to dashboard</span>
        </div>
      ) : (
        <div>
          {isPending ? (
            <div className="flex items-center justify-center">
              <Icons.spinner className="mr-2 size-4 animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : item.freePlanStatus === FreePlanStatus.PENDING ? (
            <div className="flex items-center justify-center">
              <Clock3Icon className="mr-2 size-4 icon-scale" />
              <span>Go back and Wait</span>
            </div>
          ) : item.freePlanStatus === FreePlanStatus.APPROVED ? (
            <div className="flex items-center justify-center">
              <CheckCircleIcon className="mr-2 size-4 icon-scale" />
              <span>Go to Publish</span>
            </div>
          ) : item.freePlanStatus === FreePlanStatus.REJECTED ? (
            <div className="flex items-center justify-center">
              <EditIcon className="mr-2 size-4 icon-scale" />
              <span>Go to Edit</span>
            </div>
          ) : item.freePlanStatus === FreePlanStatus.SUBMITTING ? (
            <div className="flex items-center justify-center">
              <SendIcon className="mr-2 size-4 icon-scale" />
              <span>Submit to review</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <ArrowUpLeftIcon className="mr-2 size-4 icon-scale" />
              <span>Go back to dashboard</span>
            </div>
          )}
        </div>
      )}
    </Button>
  );
}

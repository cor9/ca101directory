"use client";

import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import { ItemInfo } from "@/types";
import { ArrowBigUpIcon, ArrowUpIcon, ArrowUpToLineIcon } from "lucide-react";

interface PublishButtonProps {
  item: ItemInfo;
}

export function PublishButton({ item }: PublishButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const handlePublishClick = async () => {
    const publishable = (item.pricePlan === 'free' && item.freePlanStatus === 'approved') ||
                        (item.pricePlan === 'pro' && item.proPlanStatus === 'success');

    if (publishable) {
      await publishAction();
    } else {
      router.push(`/submit/price/${item._id}`);
    }
  };

  const publishAction = () => {
    startTransition(async () => {
      try {
        const result = await publish(item._id);
        console.log('publishAction, result:', result);
        if (result.success) {
          toast.success('Published successfully');
          router.refresh();
        } else { // TODO(javayhu): handle error
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('publishAction, error:', error);
      }
    });
  };

  return (
    <Button
      variant="default"
      disabled={isPending}
      onClick={handlePublishClick}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          <span>Publish</span>
        </>
      ) : (
        <>
          <ArrowUpToLineIcon className="mr-2 w-4 h-4" />
          <span>Publish</span>
        </>
      )}
    </Button>
  );
}

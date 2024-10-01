"use client";

import React from "react";
import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { ItemInfo } from "@/types";
import { ArrowUpToLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "../shared/icons";
import { getPublishable } from "@/lib/submission";

interface PublishButtonProps {
  item: ItemInfo;
}

export function PublishButton({ item }: PublishButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const handlePublishClick = async () => {
    const publishable = getPublishable(item);
    if (publishable) {
      await publishAction();
    } else {
      router.push(`/submit/plan/${item._id}`);
    }
  };

  const publishAction = () => {
    startTransition(async () => {
      try {
        const result = await publish(item._id);
        console.log('publishAction, result:', result);
        if (result.success) {
          router.refresh();
          toast.success('Published successfully');
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
      className="group overflow-hidden"
    >
      {isPending ? (
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          <span>Publish</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ArrowUpToLineIcon className="mr-2 w-4 h-4 icon-scale" />
          <span>Publish</span>
        </div>
      )}
    </Button>
  );
}

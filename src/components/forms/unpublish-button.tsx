"use client";

import React from "react";
import { unpublish } from "@/actions/unpublish";
import { Button } from "@/components/ui/button";
import { ItemInfo } from "@/types";
import { ArrowDownToLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Icons } from "../shared/icons";

interface UnpublishButtonProps {
  item: ItemInfo;
}

export function UnpublishButton({ item }: UnpublishButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const UnpublishAction = () => {
    startTransition(async () => {
      try {
        const result = await unpublish(item._id);
        console.log('UnpublishAction, result:', result);
        if (result.success) {
          toast.success('Unpublished successfully');
          router.refresh();
        } else { // TODO(javayhu): handle error
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('UnpublishAction, error:', error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={UnpublishAction}
      className="group overflow-hidden"
    >
      {isPending ? (
        <div>
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          <span>Unpublish</span>
        </div>
      ) : (
        <div>
          <ArrowDownToLineIcon className="mr-2 w-4 h-4 icon-scale" />
          <span>Unpublish</span>
        </div>
      )}
    </Button>
  );
}

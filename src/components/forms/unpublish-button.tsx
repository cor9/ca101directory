"use client";

import { Button } from "@/components/ui/button";
import { ItemFullInfo, ItemInfo } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { unpublish } from "@/actions/unpublish";
import { toast } from "sonner";

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
      size="sm"
      variant="outline"
      className="w-[120px]"
      disabled={isPending}
      onClick={UnpublishAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Unpublish</span>
        </>
      ) : (
        <>
          <span>Unpublish</span>
        </>
      )}
    </Button>
  );
}

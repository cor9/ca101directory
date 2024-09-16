"use client";

import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { unpublish } from "@/actions/unpublish";

interface UnpublishButtonProps {
  item: ItemFullInfo;
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
          // router.push(`/dashboard`);
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
      size="sm"
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

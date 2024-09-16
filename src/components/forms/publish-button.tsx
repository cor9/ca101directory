"use client";

import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";

interface PublishButtonProps {
  item: ItemFullInfo;
}

export function PublishButton({ item }: PublishButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const publishAction = () => {
    startTransition(async () => {
      try {
        const result = await publish(item._id);
        console.log('publishAction, result:', result);
        if (result.success) {
          // router.push(`/dashboard`);
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
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={publishAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Publish</span>
        </>
      ) : (
        <>
          <span>Publish</span>
        </>
      )}
    </Button>
  );
}

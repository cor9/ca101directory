"use client";

import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { ItemInfo } from "@/types";
import confetti from 'canvas-confetti';
import { RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";

interface PublishNowButtonProps {
  item: ItemInfo;
}

export function PublishNowButton({ item }: PublishNowButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const publishAction = () => {
    startTransition(async () => {
      try {
        const result = await publish(item._id);
        console.log('publishAction, result:', result);
        if (result.success) {
          confetti();
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
      size="lg"
      variant="default"
      className="w-full group overflow-hidden"
      disabled={isPending}
      onClick={publishAction}
    >
      {isPending ? (
        <section>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Publishing...</span>
        </section>
      ) : (
        <section>
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Publish Now</span>
        </section>
      )}
    </Button>
  );
}

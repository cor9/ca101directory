"use client";

import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { RocketIcon } from "lucide-react";
import confetti from 'canvas-confetti';

interface PublishNowButtonProps {
  item: ItemFullInfo;
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
      className="w-full rounded-full"
      disabled={isPending}
      onClick={publishAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Publishing...</span>
        </>
      ) : (
        <>
          <RocketIcon className="mr-2 size-4
            transition-all duration-300 ease-in-out group-hover:scale-125" />
          <span>Publish Now</span>
        </>
      )}
    </Button>
  );
}

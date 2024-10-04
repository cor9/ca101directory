"use client";

import React from "react";
import { publish } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { ItemInfo } from "@/types";
import confetti from 'canvas-confetti';
import { RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "@/components/icons/icons";
import { toast } from "sonner";

interface PublishNowButtonProps {
  item: ItemInfo;
}

export function PublishNowButton({ item }: PublishNowButtonProps) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const publishAction = () => {
    startTransition(async () => {
      publish(item._id)
        .then((data) => {
          if (data.status === "success") {
            console.log('publishAction, success:', data.message);
            confetti({
              particleCount: 300,
              spread: 90,
              origin: { y: 0.6 }
            });
            router.refresh();
            toast.success('Successfully published');
          }
          if (data.status === "error") {
            console.error('publishAction, error:', data.message);
            toast.error('Failed to publish');
          }
        })
        .catch((error) => {
          console.error('publishAction, error:', error);
          toast.error('Failed to publish');
        });
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
        <div className="flex items-center justify-center">
          <Icons.spinner className="mr-2 size-4 animate-spin" />
          <span>Publishing...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <RocketIcon className="mr-2 size-4 icon-scale" />
          <span>Publish Now</span>
        </div>
      )}
    </Button>
  );
}

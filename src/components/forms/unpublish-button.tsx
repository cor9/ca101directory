"use client";

import { Button } from "@/components/ui/button";
import { ItemFullInfo, ItemInfo } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icons } from "../shared/icons";
import { unpublish } from "@/actions/unpublish";
import { toast } from "sonner";
import { ArrowBigDownIcon, ArrowDownIcon, ArrowDownToLineIcon } from "lucide-react";

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
      variant="default"
      disabled={isPending}
      onClick={UnpublishAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          <span>Unpublish</span>
        </>
      ) : (
        <>
          <ArrowDownToLineIcon className="mr-2 w-4 h-4" />
          <span>Unpublish</span>
        </>
      )}
    </Button>
  );
}

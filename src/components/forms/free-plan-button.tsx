"use client";

import { Button } from "@/components/ui/button";
import { ItemFullInfo } from "@/types";
import Link from "next/link";

interface FreePlanButtonProps {
  item: ItemFullInfo;
}

export function FreePlanButton({ item }: FreePlanButtonProps) {

  return (
    <Button asChild
      variant="outline"
      className="w-full rounded-full">
      <Link
        href="/dashboard"
        className="w-full rounded-full"
      >
        Submit to waiting queue
      </Link>
    </Button>
  );
}

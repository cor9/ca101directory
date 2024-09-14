"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BottomButtonProps {
  href: string;
  label: string;
};

export const BottomButton = ({
  href,
  label,
}: BottomButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full"
      size="sm"
      asChild
    >
      <Link href={href} className="underline">
        {label}
      </Link>
    </Button>
  );
};
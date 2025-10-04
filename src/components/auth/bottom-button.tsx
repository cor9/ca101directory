"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BottomButtonProps {
  href: string;
  label: string;
}

export const BottomButton = ({ href, label }: BottomButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full text-secondary hover:text-primary"
      size="sm"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

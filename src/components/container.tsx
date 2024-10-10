import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    // max-w-6xl
    <div className={cn("container", "max-w-7xl", className)}>{children}</div>
  );
}

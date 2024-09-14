import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "container",
        "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

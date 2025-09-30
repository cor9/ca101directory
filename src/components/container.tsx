import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export default function Container({
  className,
  children,
  id,
  ...props
}: ContainerProps) {
  return (
    // max-w-6xl
    <div id={id} className={cn("container", "max-w-7xl", className)} {...props}>
      {children}
    </div>
  );
}

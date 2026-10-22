import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Titled block inside the white profile card. */
export function ProfileSection({
  title,
  id,
  children,
  className,
}: {
  title?: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("border-t border-zinc-200 px-6 py-8 sm:px-8", className)}
    >
      {title && (
        <h2 className="mb-4 text-xl font-bold text-zinc-900">{title}</h2>
      )}
      {children}
    </section>
  );
}

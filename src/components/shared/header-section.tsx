import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function HeaderSection({ label, title, subtitle, className }: HeaderSectionProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {label ? (
        <div className="text-gradient_indigo-purple mb-4 font-semibold">
          {label}
        </div>
      ) : null}
      <h2 className="font-heading text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

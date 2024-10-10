import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  label?: string;
  labelAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  title?: string;
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  subtitle?: string;
  className?: string;
}

/**
 * different pages may use this component as different heading style for SEO friendly
 */
export function HeaderSection({
  label,
  labelAs = "p",
  title,
  titleAs = "p",
  subtitle,
  className,
}: HeaderSectionProps) {
  const LabelComponent = labelAs;
  const TitleComponent = titleAs;

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {label ? (
        <LabelComponent className="tracking-wider text-gradient_indigo-purple font-semibold">
          {label}
        </LabelComponent>
      ) : null}
      {title ? (
        <TitleComponent className="mt-4 text-2xl md:text-4xl">
          {title}
        </TitleComponent>
      ) : null}
      {subtitle ? (
        <p className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

import BackButtonSmall from "../shared/back-button-small";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
  showBackButton = false,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-4">

        <div className="flex gap-4">
          {showBackButton && <BackButtonSmall />}

          <h1 className="text-2xl font-semibold">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

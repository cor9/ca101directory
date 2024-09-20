import BackButtonSmall from "../shared/back-button-small";

interface DashboardSubmitHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function DashboardSubmitHeader({
  title,
  subtitle,
  children,
  showBackButton = false,
}: DashboardSubmitHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:items-center md:flex-row md:justify-between">
      <div className="flex flex-col space-y-4">

        {/* title */}
        <div className="flex items-center space-x-4">
          {showBackButton && <BackButtonSmall />}

          <h1 className="text-2xl font-semibold">
            {title}
          </h1>
        </div>

        {/* subtitle */}
        {subtitle && (
          <p className="text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* actions */}
      {children}
    </div>
  );
}

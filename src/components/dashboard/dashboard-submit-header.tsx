
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
}: DashboardSubmitHeaderProps) {
  return (
    <div className="flex flex-col gap-8 md:gap-36 lg:gap-48 md:items-center md:flex-row md:justify-between">
      <div className="flex flex-col space-y-4">

        {/* title */}
        <div className="flex items-center space-x-4">
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
      <div className="flex-1 md:max-w-[50%]">
        {children}
      </div>
    </div>
  );
}

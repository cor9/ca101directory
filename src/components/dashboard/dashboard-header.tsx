interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>
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

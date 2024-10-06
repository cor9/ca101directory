import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function EditLayout({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title="Edit"
          subtitle="Update product info"
          showBackButton={true}
        />

        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

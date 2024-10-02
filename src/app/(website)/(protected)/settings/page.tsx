import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { constructMetadata } from "@/lib/metadata";
import SettingsForm from "./settings-form";

export const metadata = constructMetadata({
  title: "Settings",
  description: "Manage account settings.",
});

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader
        title="Settings"
        subtitle="Manage account settings."
      />

      <div className="mt-6 space-y-6">
        <SettingsForm />
      </div>
    </div>
  );
}
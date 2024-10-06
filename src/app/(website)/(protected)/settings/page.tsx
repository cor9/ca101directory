import SettingsForm from "@/components/settings/settings-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Settings",
  description: "Manage account settings",
  canonicalUrl: `${siteConfig.url}/settings`,
});

export default function SettingsPage() {
  return (
    <SettingsForm />
  );
}
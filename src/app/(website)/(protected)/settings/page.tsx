import { auth } from "@/auth";
import { RoleSwitchForm } from "@/components/settings/role-switch-form";
import { UserNameForm } from "@/components/settings/user-name-form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Settings - Child Actor 101 Directory",
  description: "Manage your account settings and preferences",
  canonicalUrl: `${siteConfig.url}/settings`,
});

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-paper mb-2">
            Account Settings
          </h1>
          <p className="text-paper">
            Manage your account information and preferences
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            {/* Role Switching - Bug #2 Fix */}
            <RoleSwitchForm />

            <Separator />

            {/* Name Management */}
            <UserNameForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

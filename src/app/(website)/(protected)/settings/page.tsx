import { UserLinkForm } from "@/components/settings/user-link-form";
import { UserNameForm } from "@/components/settings/user-name-form";
import { UserPasswordForm } from "@/components/settings/user-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { auth } from "@/auth";
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <UserNameForm />
            <UserLinkForm />
            <UserPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

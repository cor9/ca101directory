import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Calendar, Plus, Eye, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Dashboard - Child Actor 101 Directory",
  description: "Your dashboard for managing your Child Actor 101 Directory account",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

/**
 * Dashboard page - User account management
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your Child Actor 101 Directory account and submissions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and login information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm">{session.user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/submit">
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Submit New Listing
                </Button>
              </Link>
              <Link href="/submit">
                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View My Submissions
                </Button>
              </Link>
              <Link href="/settings">
                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest submissions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent activity</p>
                <p className="text-xs text-gray-400 mt-1">
                  Submit your first listing to get started
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Welcome to Child Actor 101 Directory!</CardTitle>
            <CardDescription>
              You're now logged in and ready to submit your professional listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Thank you for joining the Child Actor 101 Directory! This is your personal dashboard where you can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Submit new professional listings</li>
                <li>Manage your existing submissions</li>
                <li>Track the status of your listings</li>
                <li>Update your account information</li>
              </ul>
              <div className="pt-4">
                <Link href="/submit">
                  <Button size="lg">
                    Get Started - Submit Your First Listing
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
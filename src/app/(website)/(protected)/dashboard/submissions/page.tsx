import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Globe,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "My Submissions - Child Actor 101 Directory",
  description: "View and manage your submitted listings",
  canonicalUrl: `${siteConfig.url}/dashboard/submissions`,
});

/**
 * User submissions page - Shows all listings submitted by the current user
 */
export default async function UserSubmissionsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // TODO: Fetch user's submissions from Airtable
  // For now, showing placeholder content
  const userSubmissions = [
    {
      id: "1",
      name: "Sample Acting Studio",
      description: "Professional acting classes for children",
      status: "Approved",
      plan: "Premium",
      submittedAt: "2024-01-15",
      location: "Los Angeles, CA",
      website: "https://example.com",
    },
    {
      id: "2",
      name: "Voice Coach Services",
      description: "Voice training for young performers",
      status: "Pending",
      plan: "Basic",
      submittedAt: "2024-01-20",
      location: "New York, NY",
      website: "https://example2.com",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Pro":
        return "bg-blue-100 text-blue-800";
      case "Basic":
        return "bg-orange-100 text-orange-800";
      case "Free":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Submissions
          </h1>
          <p className="text-muted-foreground">
            View and manage all your submitted listings
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Link href="/submit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit New Listing
            </Button>
          </Link>
        </div>

        {/* Submissions List */}
        {userSubmissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any listings yet. Get started by
                submitting your first listing.
              </p>
              <Link href="/submit">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Your First Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {submission.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {submission.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <Badge className={getPlanColor(submission.plan)}>
                        {submission.plan}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Submitted:{" "}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {submission.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a
                          href={submission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-blue hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Link href={`/listing/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/edit/${submission.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




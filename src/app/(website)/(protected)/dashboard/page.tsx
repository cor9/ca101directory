import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import EmptySubmission from "@/components/dashboard/submission-empty";
import SubmissionList from "@/components/dashboard/submission-list";
import CustomPagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSubmissions } from "@/data/submission";
import { currentUser } from "@/lib/auth";
import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Overview of submissions",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  const userId = user?.id;
  // console.log('DashboardPage, user:', user);

  console.log('DashboardPage, searchParams', searchParams);
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { submissions, totalCount } = await getSubmissions({ userId, currentPage });
  const totalPages = Math.ceil(totalCount / SUBMISSIONS_PER_PAGE);
  console.log('DashboardPage, totalCount', totalCount, ", totalPages", totalPages);
  // console.log('DashboardPage, submissions:', submissions);

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle="Overview of submissions">
        <Button asChild className="group whitespace-nowrap">
          <Link href="/submit" prefetch={false}
            className="flex items-center justify-center space-x-2">
            <UploadIcon className="w-4 h-4" />
            <span>Submit</span>
          </Link>
        </Button>
      </DashboardHeader>

      <div className="mt-8">
        {/* when no submissions are found */}
        {
          submissions?.length === 0 && (
            <EmptySubmission />
          )
        }

        {/* when submissions are found */}
        {
          submissions && submissions.length > 0 && (
            <section className=''>
              <SubmissionList items={submissions} />

              <div className="mt-8 flex items-center justify-center">
                  <CustomPagination routePreix='/dashboard' totalPages={totalPages} />
              </div>
            </section>
          )
        }
      </div>
    </div>
  );
}
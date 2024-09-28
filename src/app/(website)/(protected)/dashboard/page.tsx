import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import CustomPagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { getSubmissions } from "@/data/submission";
import { currentUser } from "@/lib/auth";
import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import EmptySubmission from "./empty-submission";
import SubmissionList from "./submission-list";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Overview of submissions.",
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
    <>
      <DashboardHeader
        title="Dashboard"
        subtitle="Overview of submissions.">
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
                <Suspense fallback={null}>
                  <CustomPagination routePreix='/dashboard' totalPages={totalPages} />
                </Suspense>
              </div>
            </section>
          )
        }
      </div>
    </>
  );
}
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { SubmissionTable } from "@/components/submission-table";
import { Button } from "@/components/ui/button";
import { getSubmissions } from "@/data/submission";
import { currentUser } from "@/lib/auth";
import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/utils";
import { PlusIcon, UploadIcon } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Dashboard",
  description: "Overview of your submissions.",
});

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();
  const userId = user?.id;
  console.log('DashboardPage, userId:', userId);

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
        subtitle="Overview of your submissions.">
        <Button asChild className="group whitespace-nowrap">
          <Link href="/submit" prefetch={false}
            className="flex items-center justify-center space-x-2">
            <UploadIcon className="w-4 h-4" />
            <span>Submit</span>
          </Link>
        </Button>
      </DashboardHeader>

      <div className="mt-8">
        {submissions.length === 0 ? (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>
              No submissions
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any submissions yet.
            </EmptyPlaceholder.Description>
            <Button asChild className="group whitespace-nowrap">
              <Link href="/submit" prefetch={false}
                className="flex items-center justify-center space-x-2">
                <UploadIcon className="w-4 h-4" />
                <span>Submit</span>
              </Link>
            </Button>
          </EmptyPlaceholder>
        ) : (
          <SubmissionTable submissions={submissions}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        )}
      </div>

    </>
  );
}
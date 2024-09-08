import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { SubmissionTable } from "@/components/submission-table";
import { buttonVariants } from "@/components/ui/button";
import { getSubmissions } from "@/data/submission";
import { currentUser } from "@/lib/auth";
import { SUBMISSIONS_PER_PAGE } from "@/lib/constants";
import { cn, constructMetadata } from "@/lib/utils";
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
  console.log('DashboardPage, submissions:', submissions);

  return (
    <>
      <DashboardHeader
        heading="Submissions"
      // text="Overview of your submissions."
      />

      {submissions.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            No submissions
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any submissions yet.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/submit"
            className={cn(
              buttonVariants({ variant: "default" })
            )}
          >
            Submit
          </Link>
        </EmptyPlaceholder>
      ) : (
        <SubmissionTable submissions={submissions} 
          totalCount={totalCount} 
          totalPages={totalPages}
        />
      )}

    </>
  );
}
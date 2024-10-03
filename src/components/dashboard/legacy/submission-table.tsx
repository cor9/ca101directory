'use client';

import CustomPagination from '@/components/shared/pagination';
import { SubmissionRow } from '@/components/dashboard/legacy/submission-row';
import {
    Card,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { SUBMISSIONS_PER_PAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ItemInfo } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export function SubmissionTable({
    submissions,
    totalCount,
    totalPages
}: {
    submissions: ItemInfo[];
    totalCount: number;
    totalPages: number;
}) {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const startItem = (currentPage - 1) * SUBMISSIONS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * SUBMISSIONS_PER_PAGE, totalCount);

    return (
        <Card>
            {/* <CardHeader>
                <CardTitle>
                    <div className='flex items-center justify-between'>
                        <span>
                            Submissions
                        </span>
                        <Link href="/submit"
                            className={cn(buttonVariants({ variant: 'default' }),
                                "flex items-center gap-1")}>
                            <PlusIcon className="h-4 w-4" />
                            Submit
                        </Link>
                    </div>
                </CardTitle>
                <CardDescription>
                    Manage your submissions.
                </CardDescription>
            </CardHeader> */}
            <CardContent className='px-0 py-0'>
                <Table>
                    <TableHeader className='py-2'>
                        <TableRow>
                            <TableHead className="w-[110px] hidden lg:table-cell lg:px-6">
                                {/* Image */}
                            </TableHead>
                            <TableHead className='px-6 lg:px-0 w-[150px]'>
                                Name
                            </TableHead>
                            <TableHead className='w-[120px]'>
                                Pricing
                            </TableHead>
                            <TableHead className='w-[120px]'>
                                Status
                            </TableHead>
                            <TableHead className="w-[150px] hidden md:table-cell">
                                Published at
                            </TableHead>
                            <TableHead className="w-[150px] hidden md:table-cell">
                                Created at
                            </TableHead>
                            <TableHead>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((submission) => (
                            <SubmissionRow key={submission._id} submission={submission} />
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className='px-0 pb-0'>
                <div className={cn("flex w-full justify-center items-center",
                    "space-y-4 border-t bg-accent/50 px-6 py-4",
                    "sm:flex-row sm:justify-between sm:space-y-0")}>
                    <div className="hidden sm:block text-sm text-muted-foreground">
                        Showing{' '}
                        <strong>
                            {startItem}{' '}-{' '}{endItem}
                        </strong>{' '}
                        of <strong>{totalCount}</strong> submissions
                    </div>
                    <div className="flex items-center">
                        {/* TODO: client component, remove suspense? */}
                        <Suspense fallback={null}>
                            <CustomPagination routePreix="/dashboard" totalPages={totalPages} />
                        </Suspense>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
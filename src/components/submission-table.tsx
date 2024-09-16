'use client';

import CustomPagination from '@/components/pagination';
import { SubmissionRow } from '@/components/submission-row';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { SUBMISSIONS_PER_PAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ItemInfo } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button, buttonVariants } from './ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

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
                            <TableHead className="hidden sm:table-cell w-[100px] sm:px-6">
                                {/* Image */}
                            </TableHead>
                            <TableHead className='px-6 sm:px-0 max-w-[300px]'>
                                Name
                            </TableHead>
                            <TableHead>
                                PricePlan
                            </TableHead>
                            <TableHead>
                                PlanStatus
                            </TableHead>
                            {/* <TableHead>
                                PublishStatus
                            </TableHead> */}
                            <TableHead className="hidden md:table-cell">
                                Published at
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
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
                <div className={cn("flex w-full justify-between items-center",
                    "space-y-4 border-t bg-accent/50 px-6 py-4",
                    "sm:flex-row sm:justify-between sm:space-y-0")}>
                    <div className="text-sm text-muted-foreground">
                        Showing{' '}
                        <strong>
                            {startItem}{' '}-{' '}{endItem}
                        </strong>{' '}
                        of <strong>{totalCount}</strong> submissions
                    </div>
                    <div className="flex">
                        <Suspense fallback={null}>
                            <CustomPagination routePreix="/dashboard" totalPages={totalPages} />
                        </Suspense>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
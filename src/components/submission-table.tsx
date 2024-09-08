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
            <CardHeader>
                {/* <CardTitle>
                    Submissions
                </CardTitle> */}
                <CardDescription>
                    Manage your submissions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                {/* <span className="sr-only">Image</span> */}
                                Image
                            </TableHead>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Created at
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Published at
                            </TableHead>
                            <TableHead>
                                {/* <span className="sr-only">Actions</span> */}
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
                <div className="flex w-full justify-between
                items-center space-y-4 bg-muted/50 px-6 py-4 sm:flex-row sm:justify-between sm:space-y-0">
                    <div className="text-sm text-muted-foreground">
                        Showing{' '}
                        <strong>
                            {startItem}-{endItem}
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
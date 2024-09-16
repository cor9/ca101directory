import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { urlForImage } from '@/lib/image';
import { getLocaleDate } from '@/lib/utils';
import { SubmissionInfo } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PublishButton } from './forms/publish-button';
import { UnpublishButton } from './forms/unpublish-button';

export function SubmissionRow({ submission }: { submission: SubmissionInfo }) {

    const publishable = (submission.pricePlan === 'free'
        && submission.freePlanStatus === 'approved')
        || (submission.pricePlan === 'pro'
            && submission.proPlanStatus === 'success');
    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell w-[100px] sm:px-6">
                <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover my-2"
                    src={urlForImage(submission.image).src}
                    width="72"
                    height="72"
                />
            </TableCell>
            <TableCell className='px-6 sm:px-0 max-w-[300px] font-medium'>
                <span className='line-clamp-1'>
                    {submission.name}
                </span>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">
                    {submission.pricePlan}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="capitalize">
                    {
                        submission.pricePlan == "free" ?
                            submission.freePlanStatus :
                            submission.proPlanStatus
                    }
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {
                    submission.published && submission.publishDate ?
                        getLocaleDate(submission.publishDate) :
                        'Not published'
                }
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {getLocaleDate(submission._createdAt)}
            </TableCell>
            <TableCell>
                <>
                    <div className='hidden sm:block'>
                        <div className='flex items-center gap-2'>
                            <Button asChild variant="default" size="sm">
                                <Link href={`/item/${submission.slug.current}`} target='_blank'>
                                    View
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="sm">
                                <Link href={`/plan/${submission._id}`}>
                                    Pay
                                </Link>
                            </Button>

                            <Button asChild variant="outline" size="sm">
                                <Link href={`/update/${submission._id}`}>
                                    Update
                                </Link>
                            </Button>

                            {
                                publishable ? (
                                    submission.published ?
                                        <UnpublishButton item={submission} /> :
                                        <PublishButton item={submission} />
                                ) : null
                            }
                        </div>
                    </div>
                    <div className='sm:hidden'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">
                                        Toggle menu
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form> */}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            </TableCell>
        </TableRow>
    );
}
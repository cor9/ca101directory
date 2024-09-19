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
import { sub } from 'date-fns';

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
                            {/* view button if published */}
                            {
                                submission.published ?
                                    <Button asChild variant="default" size="sm">
                                        <Link href={`/item/${submission.slug.current}`} target='_blank'>
                                            View
                                        </Link>
                                    </Button> : null
                            }

                            {/* edit button always visible */}
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/update/${submission._id}`}>
                                    Edit
                                </Link>
                            </Button>

                            {/* show upgrade plan button if in free plan */}
                            {
                                submission.pricePlan === 'free' ?
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/submit/plan/${submission._id}`}>
                                            Upgrade Plan
                                        </Link>
                                    </Button> : null
                            }

                            {/* publish button currently visible for test */}
                            {/* <Button asChild variant="outline" size="sm">
                                <Link href={`/submit/publish/${submission._id}`}>
                                    Publish Page
                                </Link>
                            </Button> */}

                            {/* publish or unpublish button if publishable */}
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

                                {/* view button if published */}
                                {
                                    submission.published ?
                                        <DropdownMenuItem>
                                            <Button asChild variant="default" size="sm">
                                                <Link href={`/item/${submission.slug.current}`} target='_blank'>
                                                    View
                                                </Link>
                                            </Button>
                                        </DropdownMenuItem> : null
                                }

                                {/* show upgrade plan button if in free plan */}
                                {
                                    submission.pricePlan === 'free' ?
                                        <DropdownMenuItem>
                                            <Link href={`/submit/plan/${submission._id}`}>
                                                Upgrade Plan
                                            </Link>
                                        </DropdownMenuItem> : null
                                }

                                {/* show upgrade plan button if in free plan */}
                                <DropdownMenuItem>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/update/${submission._id}`}>
                                            Edit
                                        </Link>
                                    </Button>
                                </DropdownMenuItem>

                                {/* publish or unpublish button if publishable */}
                                {
                                    publishable ? (
                                        submission.published ?
                                            <DropdownMenuItem>
                                                <UnpublishButton item={submission} />
                                            </DropdownMenuItem> :
                                            <DropdownMenuItem>
                                                <PublishButton item={submission} />
                                            </DropdownMenuItem>
                                    ) : null
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            </TableCell>
        </TableRow>
    );
}
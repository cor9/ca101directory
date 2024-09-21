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
import { cn } from "@/lib/utils";

export function SubmissionRow({ submission }: { submission: SubmissionInfo }) {

    const publishable = (submission.pricePlan === 'free'
        && submission.freePlanStatus === 'approved')
        || (submission.pricePlan === 'pro'
            && submission.proPlanStatus === 'success');
    const getBadgeStatus = (plan: string, status: string): "default" | "secondary" | "destructive" | "outline" => {
        if (plan === "free") {
            switch (status) {
                case "approved": return "default";
                case "rejected": return "destructive";
                case "pending": return "secondary";
                default: return "outline";
            }
        } else if (plan === "pro") {
            switch (status) {
                case "success": return "default";
                case "failed": return "destructive";
                case "pending": return "secondary";
                default: return "outline";
            }
        }
        return "outline";
    };

    const status = submission.pricePlan === "free" ? submission.freePlanStatus : submission.proPlanStatus;
    const badgeStatus = getBadgeStatus(submission.pricePlan, status);

    return (
        <TableRow>
            <TableCell className="w-[110px] hidden lg:table-cell lg:px-6">
                <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover my-2"
                    src={urlForImage(submission.image).src}
                    width="72"
                    height="72"
                />
            </TableCell>
            <TableCell className='px-6 lg:px-0 w-[150px]'>
                <span className='line-clamp-1 font-semibold'>
                    {submission.name}
                    {/* {
                        submission.published ? (
                            <Link target='_blank'
                                href={`/item/${submission.slug.current}`}
                                className='underline underline-offset-4'>
                                {submission.name}
                            </Link>
                        ) : (
                            <span>{submission.name}</span>
                        )
                    } */}
                </span>
            </TableCell>
            <TableCell className='w-[120px]'>
                {
                    submission.pricePlan === "free" ? (
                        <Badge variant="secondary" className="capitalize">
                            {submission.pricePlan}
                        </Badge>
                    ) : (
                        <Badge variant="default" className="capitalize">
                            {submission.pricePlan}
                        </Badge>
                    )
                }
            </TableCell>
            <TableCell className='w-[120px]'>
                {

                    <Badge variant='outline' className={cn(
                        "capitalize",
                        badgeStatus === "default" && "bg-green-100 text-green-800",
                        badgeStatus === "destructive" && "bg-red-100 text-red-800",
                        badgeStatus === "secondary" && "bg-yellow-100 text-yellow-800",
                        badgeStatus === "outline" && "bg-gray-100 text-gray-800"
                    )}>
                        {status}
                    </Badge>
                }

            </TableCell>
            <TableCell className="w-[150px] hidden md:table-cell">
                {
                    submission.published && submission.publishDate ?
                        (
                            getLocaleDate(submission.publishDate)
                        ) :
                        (
                            <span className='text-muted-foreground'>
                                Not published
                            </span>
                        )
                }
            </TableCell>
            <TableCell className="w-[150px] hidden md:table-cell">
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
                                        <Link target='_blank'
                                            href={`/item/${submission.slug.current}`}
                                        >
                                            View
                                        </Link>
                                    </Button> : null
                            }

                            {/* edit button always visible */}
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/edit/${submission._id}`}>
                                    Edit
                                </Link>
                            </Button>

                            {/* show upgrade plan button if in free plan */}
                            {
                                submission.pricePlan === 'free' ?
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/submit/price/${submission._id}`}>
                                            Upgrade
                                        </Link>
                                    </Button> : null
                            }

                            {/* publish or unpublish button if publishable */}
                            {
                                publishable ? (
                                    submission.published ?
                                        <UnpublishButton item={submission} /> :
                                        <PublishButton item={submission} />
                                ) : null
                            }

                            {/* publish button currently visible for test */}
                            {/* <Button asChild variant="outline" size="sm">
                                <Link href={`/submit/publish/${submission._id}`}>
                                    Publish Page
                                </Link>
                            </Button> */}

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
                                            <Link target='_blank'
                                                href={`/item/${submission.slug.current}`}
                                            >
                                                View
                                            </Link>
                                        </DropdownMenuItem> : null
                                }

                                {/* show upgrade plan button if in free plan */}
                                <DropdownMenuItem>
                                    <Link href={`/edit/${submission._id}`}>
                                        Edit
                                    </Link>
                                </DropdownMenuItem>

                                {/* show upgrade plan button if in free plan */}
                                {
                                    submission.pricePlan === 'free' ?
                                        <DropdownMenuItem>
                                            <Link href={`/submit/price/${submission._id}`}>
                                                Upgrade
                                            </Link>
                                        </DropdownMenuItem> : null
                                }

                                {/* publish or unpublish button if publishable */}
                                {
                                    publishable ? (
                                        <div className="">
                                            {submission.published ?
                                                <DropdownMenuItem>
                                                    <UnpublishButton item={submission} />
                                                </DropdownMenuItem> :
                                                <DropdownMenuItem>
                                                    <PublishButton item={submission} />
                                                </DropdownMenuItem>
                                            }
                                        </div>
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
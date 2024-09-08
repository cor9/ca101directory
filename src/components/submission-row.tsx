import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { urlForImage } from '@/lib/image';
import { cn, getLocaleDate } from '@/lib/utils';
import { SubmissionInfo } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function SubmissionRow({ submission }: { submission: SubmissionInfo }) {
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
                <Badge variant="default" className="capitalize">
                    active
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {getLocaleDate(submission._createdAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {submission.publishDate ? getLocaleDate(submission.publishDate) : 'Not published'}
            </TableCell>
            <TableCell>
                <>
                    <div className='hidden sm:block'>
                        <div className='flex items-center gap-2'>
                            <Link href={`/item/${submission.slug.current}`} target='_blank'
                                className={cn(
                                    buttonVariants({ variant: "default", size: "sm" })
                                )}
                            >
                                View
                            </Link>

                            <Link href={`/dashboard/pay/${submission._id}`}
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "sm" })
                                )}
                            >
                                Pay
                            </Link>

                            <Link href={`/dashboard/update/${submission._id}`}
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "sm" })
                                )}
                            >
                                Update
                            </Link>

                            <Button variant="outline" size="sm">
                                Unpublish
                            </Button>
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
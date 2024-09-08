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

export function SubmissionRow({ submission }: { submission: SubmissionInfo }) {
    return (
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    src={urlForImage(submission.image).src}
                    width="64"
                    height="64"
                />
            </TableCell>
            <TableCell className="font-medium">
                {submission.name}
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
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Delete</Button>
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
import CustomPagination from '@/components/pagination';
import { ItemInfo } from '@/types';
import { Suspense } from 'react';
import SubmissionCard from './submission-card';

interface SubmissionListProps {
    items: ItemInfo[];
    totalPages: number;
    paginationPrefix: string;
}

export default function SubmissionList({ items, totalPages, paginationPrefix }: SubmissionListProps) {
    return (
        <>
            {/* when no items are found */}
            {items?.length === 0 && (
                <div className="my-8 h-32 w-full flex items-center justify-center">
                    <p className='font-medium text-muted-foreground'>
                        No results found.
                    </p>
                </div>
            )}

            {/* when items are found */}
            {items && items.length > 0 && (
                <section className=''>
                    <div className="gap-8 grid grid-cols-1">
                        {items.map((item) => (
                            <SubmissionCard key={item._id} item={item} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center">
                        <Suspense fallback={null}>
                            <CustomPagination routePreix={paginationPrefix} totalPages={totalPages} />
                        </Suspense>
                    </div>
                </section>
            )
            }
        </>
    );
}
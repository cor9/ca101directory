import { ItemInfo } from '@/types';
import SubmissionCard from './submission-card';

interface SubmissionListProps {
    items: ItemInfo[];
}

export default function SubmissionList({ items }: SubmissionListProps) {
    return (
        <div>
            {items && items.length > 0 && (
                <div className="gap-8 grid grid-cols-1">
                    {items.map((item) => (
                        <SubmissionCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
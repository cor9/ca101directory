'use client';

import { ItemFullInfo } from '@/types';
import { Clock3Icon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function ItemDetailClient({ item }: { item: ItemFullInfo }) {
  console.log('ItemDetailClient, item:', item);
  if (!item) {
    console.error('ItemDetailClient, item not found');
    return null;
  }

  const publishDate = item.publishDate || item._createdAt;
  const date = new Date(publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* details */}
      <div className='order-1 md:order-2 md:col-span-5 lg:col-span-4'>
        <h2 className="text-xl font-semibold mb-4">
          Details
        </h2>

        {/* link */}
        {
          item.link &&
          <>
            <div className="flex items-center justify-between py-4 border-b space-x-6">
              <div className='flex items-center space-x-2'>
                <GlobeIcon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  Website
                </h3>
              </div>
              <Button asChild variant="link">
                <Link href={`${item.link}`} target="_blank" className="line-clamp-1" >
                  {/* if no http or https, new URL will return invalid URL */}
                  {item.link.includes('http') ? new URL(item.link).hostname
                    : new URL(`https://${item.link}`).hostname}
                </Link>
              </Button>
            </div>
          </>
        }

        {/* publish date */}
        {
          item.publishDate &&
          <>
            <div className="flex items-center justify-between py-4 border-b space-x-6">
              <div className='flex items-center space-x-2'>
                <Clock3Icon className='size-4 inline-block' />
                <h3 className="text-muted-foreground">
                  Date
                </h3>
              </div>
              
              <time className="line-clamp-1 text-muted-foreground text-sm">
                {date}
              </time>
            </div>
          </>
        }
      </div>
    </>
  )
}

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { TagFilter } from '@/components/tag/tag-filter';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TagFilter />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}

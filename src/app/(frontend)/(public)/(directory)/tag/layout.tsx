import MaxWidthContainer from '@/components/shared/max-width-container';
import { TagFilter } from '@/components/tag/tag-filter';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TagFilter />

      <MaxWidthContainer className="pb-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}

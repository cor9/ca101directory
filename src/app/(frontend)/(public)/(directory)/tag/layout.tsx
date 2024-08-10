import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { TagHeaderLayout } from '@/components/tag-header-layout';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TagHeaderLayout />

      <MaxWidthWrapper className="pb-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}

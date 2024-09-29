import Container from '@/components/shared/container';
import { HeaderSection } from '@/components/shared/header-section';
import { TagFilter } from '@/components/tag/tag-filter';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            label="Tag"
            title="Explore by tags"
          />

          <div className="w-full">
            <TagFilter />
          </div>
        </div>
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}

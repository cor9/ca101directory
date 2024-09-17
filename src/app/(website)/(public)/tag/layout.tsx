import Container from '@/components/shared/container';
import { TagFilter } from '@/components/tag/tag-filter';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8">
        <TagFilter />
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}

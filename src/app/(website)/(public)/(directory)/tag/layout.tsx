import Container from '@/components/shared/container';
import { TagFilter } from '@/components/tag/tag-filter';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TagFilter />

      <Container className="pb-16">
        {children}
      </Container>
    </>
  );
}

import Container from '@/components/shared/container';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container className="pb-16">
        {children}
      </Container>
    </>
  );
}

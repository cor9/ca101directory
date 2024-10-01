import Container from '@/components/shared/container';

export default function CustomPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </section>
  );
}

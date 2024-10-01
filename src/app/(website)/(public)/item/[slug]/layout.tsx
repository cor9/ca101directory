import { NewsletterForm } from '@/components/emails/newsletter-form';
import Container from '@/components/shared/container';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container className="mt-8 mb-16">
        {children}
      </Container>

      <Container className="pb-16">
        <NewsletterForm />
      </Container>
    </>
  );
}

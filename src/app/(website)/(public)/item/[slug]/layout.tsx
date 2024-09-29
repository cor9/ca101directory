import { NewsletterForm } from '@/components/emails/newsletter-form';
import Container from '@/components/shared/container';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container className="mt-8 pb-16">
        {children}
      </Container>

      <NewsletterForm />
    </>
  );
}

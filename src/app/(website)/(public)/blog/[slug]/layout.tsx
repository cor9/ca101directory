import { NewsletterForm } from '@/components/emails/newsletter-form';
import Container from '@/components/shared/container';

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Container className="mt-8 pb-16">
        {children}
      </Container>

      <Container className="pb-16">
        <NewsletterForm />
      </Container>
    </section>
  );
}

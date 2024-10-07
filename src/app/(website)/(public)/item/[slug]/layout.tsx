import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import Container from '@/components/container';
import React from 'react';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Container className="mt-8">
        {children}
      </Container>

      <Container className="my-16">
        <NewsletterForm />
      </Container>
    </div>
  );
}

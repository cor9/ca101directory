import { NewsletterCard } from '@/components/newsletter/newsletter-card';
import Container from '@/components/container';
import React from 'react';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Container className="mt-8">
        {children}
      </Container>

      <Container className="my-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}

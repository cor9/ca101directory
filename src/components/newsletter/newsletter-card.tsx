"use client";

import { HeaderSection } from "../shared/header-section";
import { NewsletterForm } from "./newsletter-form";

export function NewsletterCard() {
  return (
    <div className="w-full px-4 py-8 md:p-12 bg-surface border border-surface rounded-lg">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderSection
          id="newsletter"
          labelAs="h2"
          label="Newsletter"
          title="Join 12,000+ families for tips, insights, and trusted vendor spotlights"
          titleAs="h3"
          subtitle="Get weekly updates on industry trends, featured professionals, and exclusive resources for your child's acting journey"
        />

        <NewsletterForm />
      </div>
    </div>
  );
}

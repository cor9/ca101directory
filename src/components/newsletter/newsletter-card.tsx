"use client";

import { HeaderSection } from "../shared/header-section";
import { NewsletterForm } from "./newsletter-form";

export function NewsletterCard() {
  return (
    <div className="w-full px-4 py-8 md:p-12 bg-surface border border-surface rounded-lg">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl uppercase tracking-wider text-gradient_blue-orange font-bold">
            Newsletter
          </h2>
          <h3
            className="mt-4 px-4 text-2xl md:text-4xl font-bold"
            style={{ color: "#1F2327" }}
          >
            Join 12,000+ families for tips, insights, and trusted vendor
            spotlights
          </h3>
          <p
            className="mt-6 px-4 text-balance text-lg"
            style={{ color: "#333" }}
          >
            Get weekly updates on industry trends, featured professionals, and
            exclusive resources for your child's acting journey
          </p>
        </div>

        <NewsletterForm />
      </div>
    </div>
  );
}

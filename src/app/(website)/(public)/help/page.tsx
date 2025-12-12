import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help | Child Actor 101 Directory",
  description:
    "Quick answers for parents and professionals using the Child Actor 101 Directory",
};

export default function HelpPage() {
  return (
    <div className="bg-bg-dark min-h-screen">
      {/* STEP 1: Page structure */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* STEP 2: Header - reassuring, not techy */}
        <header className="mb-12">
          <h1 className="text-3xl font-semibold text-text-primary">
            How can we help?
          </h1>
          <p className="mt-3 text-text-secondary max-w-2xl">
            Quick answers for parents and professionals using the Child Actor 101
            Directory.
          </p>
        </header>

        {/* STEP 3: Primary help tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="
            bg-card-surface
            border border-border-subtle
            rounded-xl
            p-6
            hover:bg-bg-dark-3
            transition
          ">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              For Parents
            </h3>
            <p className="text-text-secondary text-sm">
              Finding trusted professionals, saving favorites, and understanding
              listings.
            </p>
          </div>

          <div className="
            bg-card-surface
            border border-border-subtle
            rounded-xl
            p-6
            hover:bg-bg-dark-3
            transition
          ">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              For Vendors
            </h3>
            <p className="text-text-secondary text-sm">
              Creating listings, managing your profile, and understanding plans.
            </p>
          </div>

          <div className="
            bg-card-surface
            border border-border-subtle
            rounded-xl
            p-6
            hover:bg-bg-dark-3
            transition
          ">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Listings & Reviews
            </h3>
            <p className="text-text-secondary text-sm">
              How listings work, what reviews mean, and how to leave feedback.
            </p>
          </div>

          <div className="
            bg-card-surface
            border border-border-subtle
            rounded-xl
            p-6
            hover:bg-bg-dark-3
            transition
          ">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Safety & Trust
            </h3>
            <p className="text-text-secondary text-sm">
              Verification, background checks, and what makes a listing trusted.
            </p>
          </div>
        </div>

        {/* STEP 4: FAQ sections - short + human */}
        <section className="space-y-10">
          <h2 className="text-xl font-semibold text-text-primary">
            Common questions
          </h2>

          {/* For Parents */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">
              For Parents
            </h3>

            <div>
              <h4 className="font-medium text-text-primary">
                How do I know who's legit?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Listings are reviewed before going live. Some providers go through
                additional verification, which is clearly marked on their profile.
                Look for the "101 Approved" badge for extra peace of mind.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-text-primary">
                Can I save favorites?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Yes. Create a free account to save listings you're interested in
                and compare options before reaching out.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-text-primary">
                Do you take commissions?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                No. We don't take any commission from bookings. Contact providers
                directly and work out terms with them.
              </p>
            </div>
          </div>

          {/* For Vendors */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">
              For Vendors
            </h3>

            <div>
              <h4 className="font-medium text-text-primary">
                Is there a free listing?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Yes. Free listings include basic information and appear in search
                results. You can upgrade anytime to add photos, featured placement,
                and more.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-text-primary">
                Can I upgrade later?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Absolutely. Start with a free listing and upgrade when you're ready.
                Changes take effect immediately.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-text-primary">
                How do parents contact me?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Parents use the contact information on your listing—email, phone, or
                website. You'll receive inquiries directly, no middleman.
              </p>
            </div>
          </div>

          {/* Trust */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">
              Safety & Trust
            </h3>

            <div>
              <h4 className="font-medium text-text-primary">
                What does "101 Approved" mean?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                The 101 Approved badge means a professional has met our highest
                standards: proper certifications, background checks, experience with
                children, and positive references. We personally vet each
                application.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-text-primary">
                Are background checks required?
              </h4>
              <p className="mt-2 text-text-secondary text-sm max-w-3xl">
                Background checks are required for 101 Approved professionals. For
                other listings, we review credentials and references. Always do your
                own due diligence when choosing a provider.
              </p>
            </div>
          </div>
        </section>

        {/* STEP 5: Contact without inviting chaos */}
        <div className="
          mt-16
          border-t border-border-subtle
          pt-8
        ">
          <p className="text-text-secondary text-sm">
            Still stuck? Email us at{" "}
            <a
              href="mailto:support@childactor101.com"
              className="text-accent-blue hover:underline"
            >
              support@childactor101.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

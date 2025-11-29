import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { VendorSuggestionForm } from "@/components/vendor-suggestion/vendor-suggestion-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Suggest a Vendor | Child Actor 101 Directory",
  description: "Know a great acting coach, headshot photographer, or talent rep for child actors? Suggest them to our directory and help families discover trusted professionals. Share recommendations for acting coaches, photographers, agents, managers, and more.",
  canonicalUrl: `${siteConfig.url}/suggest-vendor`,
});

export default function SuggestVendorPage() {
  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Suggest a Vendor"
            titleAs="h2"
            title="Help us grow our directory"
            subtitle="Know a great child actor professional? We'd love to hear about them! Your suggestions help us build the most comprehensive directory for parents and young actors."
          />
        </div>
      </div>

      <Container className="mt-8">
        <div className="max-w-2xl mx-auto">
          <VendorSuggestionForm />
        </div>
      </Container>
    </div>
  );
}

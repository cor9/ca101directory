import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { VendorSuggestionForm } from "@/components/vendor-suggestion/vendor-suggestion-form";

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

import { SimpleTestForm } from "@/components/submit/simple-test-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Submit Your Listing",
  description: "Submit your child actor business to our directory",
  canonicalUrl: `${siteConfig.url}/submit`,
});

/**
 * Submit page - testing with simple form
 */
export default async function SubmitPage() {
  return <SimpleTestForm />;
}

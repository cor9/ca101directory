import Container from "@/components/container";
import { BlogSection } from "@/components/blog/blog-section";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
  title: "Blog - Child Actor 101 Directory",
  description: "Read our latest blog posts about child acting, headshots, training, and industry insights.",
  canonicalUrl: `${siteConfig.url}/blog`,
});

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      <Container className="py-16">
        <BlogSection />
      </Container>
    </div>
  );
}

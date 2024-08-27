import { BlogHeaderLayout } from "@/components/content/blog-header-layout";
import MaxWidthContainer from "@/components/shared/max-width-container";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlogHeaderLayout />

      <MaxWidthContainer>
        {children}
      </MaxWidthContainer>
    </>
  );
}

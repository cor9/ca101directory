import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    // TODO: remove large
    <MaxWidthWrapper className="min-h-screen">
      {children}
    </MaxWidthWrapper>
  );
}

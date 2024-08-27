import MaxWidthContainer from "@/components/shared/max-width-container";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-16">
        {children}
      </div>
    </>
  );
}

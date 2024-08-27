import MaxWidthContainer from "@/components/shared/max-width-container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MaxWidthContainer className="flex items-center justify-center p-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}
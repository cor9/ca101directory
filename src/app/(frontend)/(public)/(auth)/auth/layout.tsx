import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MaxWidthWrapper className="flex items-center justify-center p-16">
        {children}
      </MaxWidthWrapper>
    </>
  );
}
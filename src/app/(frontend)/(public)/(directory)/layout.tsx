import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MaxWidthWrapper className="">
        {children}
      </MaxWidthWrapper>
    </>
  );
}

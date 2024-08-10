import { CategoryListLayout } from "@/components/category-list-layout";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CategoryListLayout />
      <MaxWidthWrapper className="">
        {children}
      </MaxWidthWrapper>
    </>
  );
}

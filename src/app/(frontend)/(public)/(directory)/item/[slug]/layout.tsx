import MaxWidthContainer from '@/components/shared/max-width-container';

export default function ItemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MaxWidthContainer className="pb-16">
        {children}
      </MaxWidthContainer>
    </>
  );
}

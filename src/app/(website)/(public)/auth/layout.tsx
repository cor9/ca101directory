import Container from "@/components/shared/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container className="flex items-center justify-center px-8 py-16">
        {children}
      </Container>
    </>
  );
}
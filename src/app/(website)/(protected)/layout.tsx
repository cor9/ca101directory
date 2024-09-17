import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import Container from "@/components/shared/container";
import { dashboardConfig } from "@/config/dashboard";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={true} config={dashboardConfig} />

      <main className="flex-1">
        <Container className="mt-8 pb-16">
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

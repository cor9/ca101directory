import { Navbar } from "@/components/layout/navbar";
import { NavbarMobile } from "@/components/layout/navbar-mobile";
import { Footer } from "@/components/layout/site-footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar in Mobile View */}
      <NavbarMobile />
      {/* Navbar in Desktop View */}
      <Navbar scroll={true} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

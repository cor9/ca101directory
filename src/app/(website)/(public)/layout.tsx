import { BannerAd } from "@/components/layout/banner-ad";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { marketingConfig } from "@/config/marketing";
import { currentUser } from "@/lib/auth";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  // Get user session for public pages
  const user = await currentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* <div className="sticky top-0 z-50">
        <BannerAd />
        <Navbar scroll={true} config={marketingConfig} user={user} />
      </div> */}
      <Navbar scroll={true} config={marketingConfig} user={user} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

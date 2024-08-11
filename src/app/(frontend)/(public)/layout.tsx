import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavbarMobile } from "@/components/layout/navbar-mobile";
import { DashboardSidebarMobile } from "@/components/layout/dashboard-sidebar-mobile";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sidebarLinks } from "@/config/dashboard";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  const user = await currentUser();
  // if (!user) {
  //   redirect("/auth/login");
  // }
  
  let filteredLinks = [];
  if (user) {
    filteredLinks = sidebarLinks.map((section) => ({
      ...section,
      items: section.items.filter(
        ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
      ),
    }));
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar in Mobile View */}
      <NavbarMobile />
      {/* Navbar in Desktop View */}
      <Navbar scroll={true} />

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}

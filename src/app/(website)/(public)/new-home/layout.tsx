import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { marketingConfig } from "@/config/marketing";
import { currentUser } from "@/lib/auth";
import SidebarNav from "./components/SidebarNav";

interface NewHomeLayoutProps {
  children: React.ReactNode;
}

export default async function NewHomeLayout({ children }: NewHomeLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex bg-bg-dark text-text-primary">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-bg-dark-3 border-r border-border-subtle sticky top-0 h-screen">
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar scroll={true} config={marketingConfig} user={user} />

        {/* Page Content */}
        <main className="flex-1 pt-16">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

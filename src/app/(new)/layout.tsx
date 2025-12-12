import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { marketingConfig } from "@/config/marketing";
import { currentUser } from "@/lib/auth";
import SidebarNav from "./components/SidebarNav";

interface NewLayoutProps {
  children: React.ReactNode;
}

export default async function NewLayout({ children }: NewLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen bg-[#0F121A]">
      {/* Left Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
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

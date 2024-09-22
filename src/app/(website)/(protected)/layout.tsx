import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import Container from "@/components/shared/container";
import { dashboardConfig } from "@/config/dashboard";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={false} config={dashboardConfig} user={user} />

      <main className="flex-1">
        <Container className="mt-8 pb-16">
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

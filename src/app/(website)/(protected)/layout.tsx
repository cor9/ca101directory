import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardSidebarMobile } from "@/components/layout/dashboard-sidebar-mobile";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserButton } from "@/components/layout/user-button";
import Container from "@/components/shared/container";
import { sidebarLinks } from "@/config/dashboard";
import { currentUser } from "@/lib/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user.role,
    ),
  }));

  return (
    <div className="relative flex min-h-screen w-full">
      {/* sidebar section */}
      <DashboardSidebar links={filteredLinks} />

      {/* content section flex-1 */}
      <div className="flex flex-1 flex-col">
        {/* header section */}
        {/* hide border for now: border-b border-border */}
        <header className="sticky top-0 z-50 flex h-16 px-4 bg-background">
          <Container className="flex items-center gap-x-4 px-0">
            <DashboardSidebarMobile links={filteredLinks} />

            <div className="w-full flex-1">
            </div>

            <UserButton />
            <ModeToggle />
          </Container>
        </header>

        {/* p-8 is for set top padding of content */}
        <main className="flex-1 p-4">
          {/* gap-4 is header section and content section, removed */}
          <Container className="flex flex-col h-full px-0">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}

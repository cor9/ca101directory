import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardSidebarMobile } from "@/components/layout/dashboard-sidebar-mobile";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
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
      <DashboardSidebar links={filteredLinks} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-16 bg-background px-4">
          {/* remove max-w-7xl  */}
          <Container className="flex items-center gap-x-4 px-0">
            <DashboardSidebarMobile links={filteredLinks} />

            <div className="w-full flex-1">
              {/* TODO: show something here later */}
              {/* <SearchCommand links={filteredLinks} /> */}
            </div>

            <UserAccountNav />
            <ModeToggle />
          </Container>
        </header>

        <main className="flex-1 p-4">
          {/* remove max-w-7xl  */}
          <Container className="flex h-full flex-col gap-4 px-0">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}

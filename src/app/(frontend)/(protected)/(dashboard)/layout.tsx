import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardSidebarMobile } from "@/components/layout/dashboard-sidebar-mobile";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { sidebarLinks } from "@/config/dashboard";
import { currentUser } from "@/lib/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
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
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <DashboardSidebarMobile links={filteredLinks} />

            <div className="w-full flex-1">
              {/* <SearchCommand links={filteredLinks} /> */}
            </div>

            <UserAccountNav />
            <ModeToggle />
          </MaxWidthWrapper>
        </header>

        <main className="flex-1 p-4">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}

import { DocsSidebarNav } from "@/components/docs/docs-sidebar-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <MaxWidthWrapper className="pb-16">
      {/* set aside width to 200px, show in md */}
      <div className="flex-1 items-start md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-5">
        <aside className="hidden fixed top-14 h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6">
            <DocsSidebarNav />
          </ScrollArea>
        </aside>
        
        {children}
      </div>
    </MaxWidthWrapper>
  );
}

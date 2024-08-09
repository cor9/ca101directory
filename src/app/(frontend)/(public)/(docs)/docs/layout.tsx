import { DocsSidebarNav } from "@/components/docs/sidebar-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    // min-h-screen 
    <MaxWidthWrapper className="">
      <div className="flex-1 items-start md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-5">
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

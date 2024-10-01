import Link from "next/link";
import { Check } from "lucide-react";

export interface MobileFilterItemProps {
  title: string;
  href: string;
  active: boolean;
  clickAction?: () => void;
}

export default function MobileFilterItem({ title, href, active, clickAction }: MobileFilterItemProps) {
  return (
    <div>
      {/* shwo in mobile, wrapped in Link and shwo in a Drawer */}
      <Link href={href}
        prefetch={false}
        onClick={clickAction}>
        <li className="rounded-lg text-foreground hover:bg-muted">
          <div className="flex items-center justify-between p-3 text-sm">
            <span>{title}</span>
            {active && <Check className="size-4" />}
          </div>
        </li>
      </Link>
    </div>
  );
};

import Link from "next/link";
import { Button } from "../ui/button";

export interface FilterItemDesktopProps {
  title: string;
  href: string;
  active: boolean;
  clickAction?: () => void;
}

export default function FilterItemDesktop({ title, href, active, clickAction }: FilterItemDesktopProps) {
  return (
    <div>
      {/* show in desktop, wrapped in Link and Button and show as Button */}
      <Button asChild
        variant={active ? 'default' : 'outline'}
        size="sm"
        className='px-3 py-3'>
        <Link href={href}
          prefetch={false}
          onClick={clickAction}>
          <li>
            <div className="">
              <span>{title}</span>
            </div>
          </li>
        </Link>
      </Button>
    </div>
  );
};

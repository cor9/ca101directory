import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "../logo";
import { buttonVariants } from "../ui/button";

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      href="https://mkdirs.com?utm_source=demo&utm_medium=website&utm_campaign=built-with-mkdirs-button&utm_content=built-with-mkdirs"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "px-4 rounded-md",
      )}
    >
      <span className="mr-2">Built with</span>
      <span className="mr-2">
        <Logo className="size-4 rounded-full" />
      </span>
      <span className="font-bold">Mkdirs</span>
    </Link>
  );
}

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function SubmitCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>
          Submit your product
        </CardTitle>
        <CardDescription>
          Submit your product, get listed immediately, more traffic means more sales.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        {/* <Button className="w-full">
          Submit
        </Button> */}
        <Link href="/dashboard/submit"
          className={cn(buttonVariants({ variant: 'default' }),
            "flex items-center gap-1")}>
          <PlusIcon className="h-4 w-4" />
          Submit
        </Link>
      </CardContent>
    </Card>
  );
}

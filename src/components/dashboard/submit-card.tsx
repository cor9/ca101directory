import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <Button className="w-full">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}

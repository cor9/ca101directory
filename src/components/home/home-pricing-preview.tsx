import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function HomePricingPreview() {
  return (
    <section className="py-16">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits where you are today and upgrade as your
            performer grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold text-brand-blue">$0</div>
              <p className="text-muted-foreground">
                Perfect for getting started
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Basic listing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Profile photo</span>
                </li>
              </ul>
              <Button className="w-full mt-6" variant="outline" asChild>
                <Link href="/submit">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-brand-orange">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold text-brand-orange">$29</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-brand-orange" />
                  <span>Featured placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}



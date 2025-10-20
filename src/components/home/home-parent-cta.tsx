import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, HeartIcon, StarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function HomeParentCta() {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-paper mb-4">
            Ready to Find the Perfect Professionals?
          </h2>
          <p className="text-lg text-paper max-w-2xl mx-auto">
            Create a free parent account to save favorites, write reviews, and
            get personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <HeartIcon className="h-8 w-8 text-tomato-red mx-auto mb-2" />
              <CardTitle className="text-lg">Save Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-paper">
                Bookmark professionals you love and build your trusted network.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <StarIcon className="h-8 w-8 text-retro-blue mx-auto mb-2" />
              <CardTitle className="text-lg">Write Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-paper">
                Share your experiences to help other families make informed
                decisions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <UsersIcon className="h-8 w-8 text-mustard-gold mx-auto mb-2" />
              <CardTitle className="text-lg">Join Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-paper">
                Connect with other parents and get insider tips from industry
                experts.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" asChild className="mr-4">
            <Link href="/auth/register?role=parent">Create Free Account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

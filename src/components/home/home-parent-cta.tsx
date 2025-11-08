import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, HeartIcon, StarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function HomeParentCta() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-orange/10 via-bauhaus-blue/10 to-secondary-denim/10">
      <Container>
        <div className="text-center mb-12">
          <h2 className="bauhaus-heading text-4xl md:text-5xl font-bold text-paper mb-6">
            Create Your Free Parent Account
          </h2>
          <p className="bauhaus-body text-xl text-paper/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of parents who use Child Actor 101 to discover, save, and review
            trusted professionals for their young performers. Your free account unlocks powerful
            features to help you make the best decisions for your child's career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center bauhaus-card bg-surface hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <HeartIcon className="h-12 w-12 text-tomato-red mx-auto mb-3" />
              <CardTitle className="text-xl font-bold text-ink">Save Your Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-surface leading-relaxed">
                Bookmark acting coaches, photographers, agents, and managers you love.
                Build your personalized network of trusted professionals all in one place,
                accessible anytime from your dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bauhaus-card bg-surface hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <StarIcon className="h-12 w-12 text-bauhaus-blue mx-auto mb-3 fill-bauhaus-blue" />
              <CardTitle className="text-xl font-bold text-ink">Write & Read Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-surface leading-relaxed">
                Share your honest experiences and help other families make informed decisions.
                Read reviews from parents like you to discover which professionals deliver
                the best results for young actors.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bauhaus-card bg-surface hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CheckCircleIcon className="h-12 w-12 text-mustard-gold mx-auto mb-3" />
              <CardTitle className="text-xl font-bold text-ink">Track Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-surface leading-relaxed">
                Keep a record of the professionals you've worked with and organize your
                child actor journey. See your review history and manage all your favorites
                from one convenient dashboard.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            asChild
            className="mr-4 bauhaus-btn-primary text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
          >
            <Link href="/auth/register?role=parent">Create Free Account</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="bauhaus-btn-secondary text-lg px-8 py-6 hover:scale-105 transition-transform duration-200"
          >
            <Link href="/auth/login">Already Have an Account? Sign In</Link>
          </Button>
        </div>

        <p className="text-center text-paper/70 mt-6 text-sm">
          100% free • No credit card required • Cancel anytime
        </p>
      </Container>
    </section>
  );
}

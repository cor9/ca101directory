"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Facebook } from "lucide-react";

/**
 * Temporary Facebook Auth Placeholder Component
 * Shows "Coming Soon" message while Facebook business verification is pending
 */
export function FacebookAuthPlaceholder() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
          <Facebook className="h-6 w-6 text-brand-blue" />
        </div>
        <CardTitle className="text-xl">Facebook Login</CardTitle>
        <CardDescription>
          Coming Soon - Verification in Progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Facebook business verification pending (2-3 days)</span>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">In the meantime, you can:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use Google login (if approved)</li>
            <li>Use email/password authentication</li>
            <li>Continue with guest browsing</li>
          </ul>
        </div>

        <Button variant="outline" className="w-full" disabled>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook Login (Coming Soon)
        </Button>
      </CardContent>
    </Card>
  );
}

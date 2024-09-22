"use client";

import { BottomButton } from "@/components/auth/bottom-button";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  headerLabel: string;
  bottomButtonLabel: string;
  bottomButtonHref: string;
  showSocialLoginButton?: boolean;
  className?: string;
};

export const AuthCard = ({
  children,
  headerLabel,
  bottomButtonLabel,
  bottomButtonHref,
  showSocialLoginButton,
  className
}: AuthCardProps) => {
  return (
    // w-[90%] sm:w-[400px] max-w-[400px]
    <Card className={cn("w-full sm:w-[400px] max-w-[400px]", className)}>
      <CardHeader className="items-center">
        <CardTitle>{siteConfig.name}</CardTitle>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocialLoginButton && (
        <CardFooter>
          <SocialLoginButton />
        </CardFooter>
      )}
      <CardFooter>
        <BottomButton
          label={bottomButtonLabel}
          href={bottomButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
"use client";

import { BackButton } from "@/components/auth/back-button";
import { SocialButton } from "@/components/auth/social-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    // shadow-md => shadow-sm
    // border-none shadow-none
    <Card className="w-[400px] shadow-sm">
      <CardHeader className="items-center">
        <CardTitle>{siteConfig.name}</CardTitle>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <SocialButton />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
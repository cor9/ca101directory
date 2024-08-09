"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Header } from "@/components/auth/header-wrapper";
import { Social } from "@/components/auth/social-button";
import { BackButton } from "@/components/auth/back-button";
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
    //  shadow-md => shadow-sm
    // border-none shadow-none
    <Card className="w-[400px] shadow-sm">
      <CardHeader className="items-center">
        {/* <Header label={headerLabel} /> */}
        <CardTitle>{siteConfig.name}</CardTitle>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
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
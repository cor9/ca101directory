"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaBrandsGithub } from "../icons/github";
import { FaBrandsGoogle } from "../icons/google";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

/**
 * TODO: show loading when logging in
 */
export const SocialButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FaBrandsGoogle className="size-5 mr-2" />
        Login with Google
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaBrandsGithub className="size-5 mr-2" />
        Login with Github
      </Button>
    </div>
  );
};
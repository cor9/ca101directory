"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaBrandsFacebook } from "../icons/facebook";
import { FaBrandsGoogle } from "../icons/google";

/**
 * Social login buttons for Child Actor 101 Directory
 * Supports Google and Facebook OAuth
 */
export const SocialLoginButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState<"google" | "facebook" | null>(
    null,
  );

  const onClick = async (provider: "google" | "facebook") => {
    setIsLoading(provider);
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    // no need to reset the loading state, keep loading before webpage redirects
    // setIsLoading(null);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
        disabled={isLoading === "google"}
      >
        {isLoading === "google" ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <FaBrandsGoogle className="size-5 mr-2" />
        )}
        <span>Login with Google</span>
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("facebook")}
        disabled={isLoading === "facebook"}
      >
        {isLoading === "facebook" ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <FaBrandsFacebook className="size-5 mr-2" />
        )}
        <span>Login with Facebook</span>
      </Button>
    </div>
  );
};

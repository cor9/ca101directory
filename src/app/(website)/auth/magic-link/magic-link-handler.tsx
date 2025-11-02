"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MagicLinkHandlerProps = {
  email: string;
  remember: boolean;
  redirectTo: string;
  intent: string;
};

function StatusMessage({
  status,
  headline,
  description,
  action,
}: {
  status: "loading" | "error" | "success";
  headline: string;
  description: string;
  action?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-secondary-denim bg-paper p-8 text-center shadow-lg">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-orange/10 text-primary-orange">
        {status === "loading" ? (
          <Icons.spinner className="h-6 w-6 animate-spin" />
        ) : status === "success" ? (
          <Icons.check className="h-6 w-6" />
        ) : (
          <Icons.alert className="h-6 w-6" />
        )}
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-gray-900">{headline}</h1>
      <p className="mt-3 text-gray-700">{description}</p>
      {action ? (
        <Button onClick={action} className="mt-6">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

function useHashParams() {
  const searchParams = useSearchParams();
  const [hashParams, setHashParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      setHashParams(new URLSearchParams(hash));
    } else {
      setHashParams(null);
    }
  }, [searchParams]);

  return hashParams;
}

export function MagicLinkHandler({
  email,
  remember,
  redirectTo,
  intent,
}: MagicLinkHandlerProps) {
  const router = useRouter();
  const hashParams = useHashParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Preparing your secure login...");

  const accessToken = useMemo(
    () => hashParams?.get("access_token") || hashParams?.get("token"),
    [hashParams],
  );
  const refreshToken = useMemo(
    () => hashParams?.get("refresh_token"),
    [hashParams],
  );
  const expiresIn = useMemo(
    () => hashParams?.get("expires_in") || undefined,
    [hashParams],
  );

  useEffect(() => {
    async function completeLogin() {
      if (!accessToken || !refreshToken) {
        setStatus("error");
        setMessage(
          "We couldn't find the secure token in the link. Please request a new login email.",
        );
        return;
      }

      try {
        setStatus("loading");
        setMessage("Verifying your secure link...");

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("Magic link session error", sessionError);
          throw new Error(sessionError.message);
        }

        setMessage("Finishing sign-in...");
        const result = await signIn("credentials", {
          email,
          token: accessToken,
          refreshToken,
          remember: remember ? "true" : "false",
          expiresIn: expiresIn ?? "",
          redirect: false,
        });

        if (result?.error) {
          console.error("Magic link signIn error", result.error);
          throw new Error(result.error);
        }

        setStatus("success");
        setMessage("You're all set! Redirecting...");

        const target = redirectTo || "/dashboard";
        router.replace(target);
      } catch (error) {
        console.error("Magic link completion error", error);
        setStatus("error");
        setMessage(
          "We couldn't log you in with that link. Request a new magic link to try again.",
        );
      }
    }

    completeLogin();
  }, [
    accessToken,
    refreshToken,
    expiresIn,
    email,
    remember,
    redirectTo,
    intent,
    router,
  ]);

  if (!email) {
    return (
      <StatusMessage
        status="error"
        headline="Missing email"
        description="We need a valid email address to finish logging you in. Please request a new link from the login page."
      />
    );
  }

  if (status === "error") {
    return (
      <StatusMessage
        status="error"
        headline="Magic link expired"
        description={message}
        action={() => router.push(`/auth/login?email=${encodeURIComponent(email)}`)}
      />
    );
  }

  if (status === "success") {
    return (
      <StatusMessage
        status="success"
        headline="Welcome back!"
        description="You're being redirected to your dashboard."
      />
    );
  }

  return (
    <StatusMessage
      status="loading"
      headline={intent === "register" ? "Setting up your account" : "Signing you in"}
      description={message}
    />
  );
}

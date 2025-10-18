"use client";

import { login } from "@/actions/login";
import { resendConfirmationEmail } from "@/actions/resend-confirmation";
import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons/icons";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const LoginForm = ({
  className,
  defaultRole,
}: { className?: string; defaultRole?: "parent" | "vendor" }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          // console.log('login, data:', data);
          if (data?.status === "error") {
            console.log("login, error:", data.message);
            form.reset();
            setError(data.message);
          }

          if (data?.status === "success") {
            console.log("login, success:", data.message);
            form.reset();
            setSuccess(data.message);

            // NextAuth will handle the redirect automatically
            // No need to manually redirect here
          }
        })
        .catch((error) => {
          console.log("login, error:", error);
          setError("Something went wrong");
        });
    });
  };

  const handleResendConfirmation = async () => {
    if (!resendEmail) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const result = await resendConfirmationEmail(resendEmail);
      if (result.success) {
        setSuccess(result.message || "Confirmation email sent!");
        setShowResendForm(false);
        setResendEmail("");
      } else {
        setError(result.error || "Failed to resend confirmation email.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard
      headerLabel="Welcome back"
      bottomButtonLabel="Don't have an account? Sign up"
      bottomButtonHref="/auth/register"
      className={cn("border-none", className)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                      className="bg-paper border-secondary-denim text-gray-900 placeholder:text-gray-900/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-gray-900">Password</FormLabel>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal text-secondary-denim hover:text-primary-orange"
                    >
                      <Link href="/auth/reset" className="text-xs underline">
                        Forgot password?
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                      className="bg-paper border-secondary-denim text-gray-900 placeholder:text-gray-900/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            size="lg"
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              ""
            )}
            <span>Login</span>
          </Button>

          {/* Resend Confirmation Email Section */}
          <div className="border-t pt-4 mt-4">
            {!showResendForm ? (
              <div className="text-center">
                <p className="text-sm text-gray-900 mb-2">
                  Didn't receive confirmation email?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResendForm(true)}
                  className="text-secondary-denim hover:text-primary-orange"
                >
                  📧 Resend Confirmation Email
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">
                  Resend Confirmation Email
                </p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="bg-paper border-secondary-denim text-gray-900"
                  disabled={isResending}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    className="flex-1 btn-primary"
                    size="sm"
                  >
                    {isResending ? (
                      <Icons.spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowResendForm(false);
                      setResendEmail("");
                      setError("");
                    }}
                    disabled={isResending}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};

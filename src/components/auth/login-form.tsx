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
import { MagicLinkRequestSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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

  const form = useForm<z.infer<typeof MagicLinkRequestSchema>>({
    resolver: zodResolver(MagicLinkRequestSchema),
    defaultValues: {
      email: "",
      remember: true,
    },
  });

  useEffect(() => {
    try {
      const cachedEmail = window.localStorage.getItem("ca101:last-email");
      if (cachedEmail) {
        form.setValue("email", cachedEmail);
      }
    } catch (storageError) {
      console.warn("Unable to read cached magic link email", storageError);
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof MagicLinkRequestSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          // console.log('login, data:', data);
          if (data?.status === "error") {
            console.log("login, error:", data.message);
            form.reset({
              email: values.email,
              remember: values.remember,
            });
            setError(data.message);
          }

          if (data?.status === "success") {
            console.log("login, success:", data.message);
            form.reset({
              email: values.email,
              remember: values.remember,
            });
            setSuccess(data.message);

            try {
              window.localStorage.setItem("ca101:last-email", values.email);
            } catch (storageError) {
              console.warn(
                "Unable to cache email for magic link login",
                storageError,
              );
            }
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
    className={cn("border-none text-gray-900", className)}
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
                    className="bg-paper border-secondary-denim text-gray-900 placeholder:text-gray-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-secondary-denim bg-paper text-primary-orange"
                    checked={field.value ?? false}
                    onChange={(event) => field.onChange(event.target.checked)}
                    disabled={isPending}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-900">
                    Keep me logged in on this device
                  </FormLabel>
                  <p className="text-xs text-gray-700">
                    Stay signed in for faster access. We'll automatically adjust
                    the session length based on your role.
                  </p>
                </div>
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
          {isPending && <Icons.spinner className="w-4 h-4 animate-spin" />}
          <span>Send me a login link</span>
        </Button>

        {/* Resend Confirmation Email Section */}
        <div className="border-t pt-4 mt-4">
          {!showResendForm ? (
            <div className="text-center">
              <p className="text-sm text-gray-900">
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
                className="bg-paper border-secondary-denim text-gray-900 placeholder:text-gray-700"
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

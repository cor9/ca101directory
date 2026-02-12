"use client";

import { login } from "@/actions/login";
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

  return (
    <AuthCard
      headerLabel="Welcome back"
      bottomButtonLabel="Don't have an account? Sign up"
      bottomButtonHref="/auth/register"
      className={cn("border-none text-text-primary", className)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-primary">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                      className="bg-bg-2 border-border-subtle text-text-primary placeholder:text-text-muted"
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
                      className="h-4 w-4 rounded border-border-subtle bg-bg-2 text-primary-orange"
                      checked={field.value ?? false}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-text-primary">
                      Keep me logged in on this device
                    </FormLabel>
                    <p className="text-xs text-text-secondary">
                      Stay signed in for faster access. We'll automatically
                      adjust the session length based on your role.
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
        </form>
      </Form>
    </AuthCard>
  );
};

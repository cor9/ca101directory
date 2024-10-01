"use client";

import { login } from "@/actions/login";
import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Icons } from "@/components/shared/icons";
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
import * as z from "zod";

export const LoginForm = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

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
          console.log('login, data:', data);

          // TODO: this is important, it will reload the page
          // window.location.reload();

          if (data?.error) {
            form.reset();
            setError(data.error);
            console.log('login, error:', data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            console.log('login, success:', data.success);
            
            // router.push(data.redirectUrl);
            window.location.href = data.redirectUrl;
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <AuthCard
      headerLabel="Welcome back"
      bottomButtonLabel="Don't have an account? Sign up"
      bottomButtonHref="/auth/register"
      showSocialLoginButton
      className={cn("", className)}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="space-y-4">
            <section>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="name@example.com"
                        type="email"
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
                      <FormLabel>Password</FormLabel>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            size="lg"
            type="submit"
            className="w-full flex items-center justify-center gap-2"
          >
            {isPending ? <Icons.spinner className="w-4 h-4 animate-spin" /> : ""}
            <span>Login</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
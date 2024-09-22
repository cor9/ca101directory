"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoginSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { Icons } from "@/components/shared/icons";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn, useSession } from "next-auth/react";

export const LoginForm = () => {
  const router = useRouter();
  const { update } = useSession();
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

          // 加了还是没用
          // console.log('update session');
          // update();

          // 客户端跳转，也是OK的，
          // console.log('push to callbackUrl:', callbackUrl);
          // router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
          
          // 使用redirect也没用
          // console.log('push to dashboard');
          // router.push(DEFAULT_LOGIN_REDIRECT);
          // redirect(DEFAULT_LOGIN_REDIRECT);

          if (data?.error) {
            form.reset();
            setError(data.error);
            console.log('login, error:', data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            console.log('login, success:', data.success);

            // 加了这个也没有用
            // router.refresh();

            // 手动刷新 session，加了这个也没有用
            // console.log('update session');
            // update();

            // console.log('push to callbackUrl:', callbackUrl);
            // router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  // const onSubmit = (values: z.infer<typeof LoginSchema>) => {
  //   setError("");
  //   setSuccess("");

  //   startTransition(() => {
  //     signIn("credentials", {
  //       email: values.email,
  //       password: values.password,
  //       // redirect: false,
  //       redirect: true,
  //       redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  //     })
  //       .then((response) => {
  //         if (response?.error) {
  //           setError(response.error);
  //           console.log('login, error:', response.error);
  //         } else if (response?.ok) {
  //           setSuccess("Logged in successfully");
  //           console.log('login, success: Logged in successfully');
  //           // You might want to redirect here
  //           // router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
  //         }
  //       })
  //       .catch(() => {
  //         setError("Something went wrong");
  //       });
  //   });
  // };

  return (
    <AuthCard
      headerLabel="Welcome back"
      bottomButtonLabel="Don't have an account? Sign up"
      bottomButtonHref="/auth/register"
      showSocialLoginButton
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="space-y-4">
            <>
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
            </>
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
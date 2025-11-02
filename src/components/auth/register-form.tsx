"use client";

import { register } from "@/actions/register";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getEnabledRoles } from "@/config/feature-flags";
import { RegisterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  // Get enabled roles for registration
  const enabledRoles = getEnabledRoles();
  const roleFromUrl = searchParams.get("role");
  const defaultRole =
    roleFromUrl && enabledRoles.includes(roleFromUrl)
      ? roleFromUrl
      : enabledRoles.includes("parent")
        ? "parent"
        : enabledRoles[0] || "vendor";

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      role: defaultRole as "parent" | "vendor",
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

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    const nextUrl = searchParams.get("next");

    startTransition(() => {
      register(values, nextUrl || undefined)
        .then((data) => {
          if (data.status === "error") {
            console.log("register, error:", data.message);
            setError(data.message);
          }
          if (data.status === "success") {
            console.log("register, success:", data.message);
            setSuccess(data.message);

            try {
              window.localStorage.setItem("ca101:last-email", values.email);
            } catch (storageError) {
              console.warn(
                "Unable to cache email for magic link registration",
                storageError,
              );
            }

            // Redirect to login page if redirectUrl is provided
            // But give user time to read the important email confirmation message
            if (data.redirectUrl) {
              setTimeout(() => {
                window.location.href = data.redirectUrl as string;
              }, 8000); // 8 seconds to read the email confirmation message
            }
          }
        })
        .catch((error) => {
          console.log("register, error:", error);
          setError("Something went wrong");
        });
    });
  };

  return (
    <AuthCard
      headerLabel="Create an account"
      bottomButtonLabel="Already have an account? Sign in"
      bottomButtonHref="/auth/login"
      className="border-none"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-paper">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name"
                      className="bg-paper border-secondary-denim text-paper placeholder:text-paper/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-paper">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                      className="bg-paper border-secondary-denim text-paper placeholder:text-paper/60"
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
                    <FormLabel className="text-paper">
                      Keep me logged in on this device
                    </FormLabel>
                    <p className="text-xs text-paper/80">
                      Stay signed in for up to 30 days so you can return without
                      requesting another email.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-paper">I am a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {enabledRoles.includes("parent") && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="parent" id="parent" />
                          <label
                            htmlFor="parent"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-paper"
                          >
                            Parent/Legal Guardian
                          </label>
                        </div>
                      )}
                      {enabledRoles.includes("vendor") && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vendor" id="vendor" />
                          <label
                            htmlFor="vendor"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-paper"
                          >
                            Professional/Vendor
                          </label>
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
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
            <span>Create an account</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

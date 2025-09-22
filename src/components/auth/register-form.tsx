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
import { RegisterSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.status === "error") {
            console.log("register, error:", data.message);
            setError(data.message);
          }
          if (data.status === "success") {
            console.log("register, success:", data.message);
            setSuccess(data.message);
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
      showSocialLoginButton
      className="border-none"
    >
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Quick & Easy Sign Up</h3>
          <p className="text-muted-foreground">
            Use your existing Google or Facebook account to get started instantly. 
            No need to create a new password!
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>✅ Secure authentication</p>
            <p>✅ No password to remember</p>
            <p>✅ Instant access to submit listings</p>
          </div>
        </div>
        
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </AuthCard>
  );
};

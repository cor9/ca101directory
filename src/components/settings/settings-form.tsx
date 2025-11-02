"use client";

import { settings } from "@/actions/settings";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

export default function SettingsForm() {
  const router = useRouter();
  const user = useCurrentUser();
  // console.log('SettingsForm, user:', user);
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || undefined,
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.status === "error") {
            console.log("SettingsForm, error:", data.message);
            toast.error(data.message);
          }
          if (data.status === "success") {
            console.log("SettingsForm, success:", data.message);
            update();
            router.refresh();
            toast.success(data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="name" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter
            className={cn(
              "flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
              "sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4",
            )}
          >
            <Button
              size="lg"
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner className="mr-2 h-6 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="mt-4 space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Link field */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>

        </CardContent>
        <CardFooter
          className={cn(
            "flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
            "sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4",
          )}
        >
          <Skeleton className="h-12 w-full sm:w-32" />
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

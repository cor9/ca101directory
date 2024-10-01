"use client";

import { settings } from "@/actions/settings";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRingIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function SettingsPage() {
  const router = useRouter();
  const user = useCurrentUser();
  // console.log('SettingsPage, user:', user);
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      link: user?.link || undefined,
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || undefined,
        link: user?.link || undefined,
      });
    }
  }, [user, form]);

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            console.log('SettingsPage, onSubmit, error:', data.error);
            toast.error(data.error);
          }
          if (data.success) {
            console.log('SettingsPage, onSubmit, success:', data.success);
            update();
            router.refresh();
            toast.success(data.success);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  }

  return (
    <div>
      <DashboardHeader
        title="Settings"
        subtitle="Manage account settings."
      />

      <div className="mt-6 space-y-6">
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
                        <Input
                          {...field}
                          placeholder="name"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Link (e.g. https://x.com/username)"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user?.isOAuth === false && (
                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="******"
                              type="password"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className={cn("flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4",
                "sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4")}>
                <Button
                  size="lg"
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>

                {user?.isOAuth === false && (
                  <div className="text-muted-foreground flex items-center justify-center sm:justify-start gap-4">
                    <BellRingIcon className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="text-sm">
                      Password is optional when changing name or link.
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
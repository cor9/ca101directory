"use client";

import { subscribeToNewsletter } from "@/actions/subscribe-to-newsletter";
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
import { NewsletterFormData, NewsletterFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { HeaderSection } from "../shared/header-section";
import { Icons } from "@/components/icons/icons";

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: NewsletterFormData) {
    startTransition(async () => {
      subscribeToNewsletter({ email: data.email })
        .then(data => {
          switch (data.status) {
            case "success":
              toast.success("Thank you for subscribing to our newsletter");
              form.reset();
              break
            default:
              toast.error("Something went wrong, please try again");
          }
        }).catch(error => {
          toast.error("Something went wrong");
        });
    });
  }

  return (
    <div>
      <div className="w-full px-4 py-8 md:p-12 bg-muted rounded-lg">
        <div className="flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h2"
            label="Newsletter"
            title="Join the Community"
            titleAs="h3"
            subtitle="Subscribe to our newsletter for the latest news and updates"
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center justify-center"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative space-y-0">
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl className="rounded-r-none">
                      <Input type="email"
                        className="w-[280px] sm:w-[320px] md:w-[400px] h-12 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="pt-2 text-sm" />
                  </FormItem>
                )}
              />
              <Button type="submit"
                className="rounded-l-none size-12"
                disabled={isPending}
              >
                {isPending ? (
                  <Icons.spinner className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <PaperPlaneIcon className="size-5" aria-hidden="true" />
                )}
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

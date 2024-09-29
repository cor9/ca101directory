"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/actions/newsletter-subscribe";

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
      try {
        const message = await subscribeToNewsletter({ email: data.email });
        switch (message) {
          case "success":
            toast.success("Thank you! You have successfully subscribed to our newsletter");
            form.reset();
            break
          default:
            toast.error("Something went wrong, please try again");
        }
      } catch (error) {
        toast.error("Something went wrong, please try again");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2 sm:max-w-sm"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscribe to our newsletter</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="rounded-full px-4"
                  placeholder="username@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="rounded-full px-4">
          Subscribe
        </Button>
      </form>
    </Form>
  );
}

<section>
  {/* Container */}
  <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
    {/* Component */}
    <div className="bg-gray-100 p-8 text-center sm:p-10 md:p-16">

      {/* Title */}
      <h2 className="mb-4 text-3xl font-bold md:text-5xl">
        Join the Flowspark Community
      </h2>
      <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-500 sm:text-base md:mb-10 lg:mb-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
        purus sit amet luctus venenatis, lectus magna fringilla urna
      </p>
      <div className="mx-auto mb-4 flex max-w-lg justify-center">
        <form
          name="email-form"
          method="get"
          className="flex w-full flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            className="h-9 w-full rounded-md border border-solid border-black px-3 py-6 text-sm text-gray-500"
            placeholder="Enter your email"
          />
          <input
            type="submit"
            value="Notify me"
            className="cursor-pointer rounded-md bg-black px-6 py-2 font-semibold text-white"
          />
        </form>
      </div>
    </div>
  </div>
</section>
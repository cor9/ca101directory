"use client";

import { type SubmitFormData, submit } from "@/actions/submit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FreeSubmitFormProps {
  categories: Array<{ id: string; name: string }>;
}

export default function FreeSubmitForm({ categories }: FreeSubmitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubmitFormData>({
    resolver: zodResolver(SubmitSchema),
    defaultValues: {
      name: "",
      description: "",
      introduction: "",
      unique: "",
      format: "Hybrid",
      notes: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: "",
      bondNumber: "",
      plan: "Free",
      performerPermit: false,
      bonded: false,
      categories: [],
      tags: [],
      link: "",
    },
  });

  const onSubmit = async (data: SubmitFormData) => {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await submit(data);

        if (result?.status === "success") {
          toast.success("Listing submitted successfully!");
          router.push(`/submit/success?id=${result.id}`);
        } else {
          toast.error(result?.message || "Failed to submit listing");
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Failed to submit listing");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Submit Your Free Listing
          </CardTitle>
          <p className="text-center text-paper">
            Get started with a basic listing. Upgrade later for more features.
          </p>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-6">
              {/* Listing Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your business or service name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* What You Offer */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What You Offer? *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brief description of your services"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category - Single Select Only */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange([value]);
                      }}
                      value={field.value?.[0] || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Los Angeles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input placeholder="CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region */}
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region *</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Los Angeles">
                            Los Angeles
                          </SelectItem>
                          <SelectItem value="San Francisco Bay Area">
                            San Francisco Bay Area
                          </SelectItem>
                          <SelectItem value="San Diego">San Diego</SelectItem>
                          <SelectItem value="Sacramento">Sacramento</SelectItem>
                          <SelectItem value="Central Valley">
                            Central Valley
                          </SelectItem>
                          <SelectItem value="Orange County">
                            Orange County
                          </SelectItem>
                          <SelectItem value="Ventura County">
                            Ventura County
                          </SelectItem>
                          <SelectItem value="Riverside County">
                            Riverside County
                          </SelectItem>
                          <SelectItem value="San Bernardino County">
                            San Bernardino County
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden fields for form validation */}
              <input type="hidden" name="introduction" value="" />
              <input type="hidden" name="unique" value="" />
              <input type="hidden" name="format" value="Hybrid" />
              <input type="hidden" name="notes" value="" />
              <input type="hidden" name="phone" value="" />
              <input type="hidden" name="zip" value="" />
              <input type="hidden" name="bondNumber" value="" />
              <input type="hidden" name="plan" value="Free" />
              <input type="hidden" name="performerPermit" value="false" />
              <input type="hidden" name="bonded" value="false" />
              <input type="hidden" name="tags" value="[]" />
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Free Listing Includes:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Basic business listing</li>
                  <li>• Contact information</li>
                  <li>• Category placement</li>
                  <li>• Manual review process</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Upgrade Later For:
                </h3>
                <ul className="text-sm text-orange-800 space-y-1 mb-3">
                  <li>• Logo and photos</li>
                  <li>• Detailed descriptions</li>
                  <li>• Multiple categories</li>
                  <li>• Featured placement</li>
                  <li>• 101 Badge</li>
                </ul>
                <div className="text-center">
                  <a
                    href="/pricing"
                    target="_blank"
                    className="text-orange-700 hover:text-orange-800 underline text-sm font-medium"
                    rel="noreferrer"
                  >
                    View pricing plans →
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-dark"
                disabled={isPending || isSubmitting}
              >
                {isPending || isSubmitting
                  ? "Submitting..."
                  : "Submit Free Listing"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

"use client";

import { type SubmitFormData, submit } from "@/actions/submit";
import { Icons } from "@/components/icons/icons";
import ImageUpload from "@/components/shared/image-upload";
import { MultiSelect } from "@/components/shared/multi-select";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUPPORT_ITEM_ICON } from "@/lib/constants";
import { SubmitSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
// Removed Sanity types - now using custom interfaces
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TagItem {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug: { _type: string; current: string };
  description: string | null;
  priority: string | null;
}

interface CategoryItem {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug: { _type: string; current: string };
  description: string | null;
  group: string | null;
  priority: string | null;
}

interface AirtableSubmitFormProps {
  tagList: TagItem[];
  categoryList: CategoryItem[];
}

/**
 * Airtable-style submission form matching the exact structure and helper text
 */
export function AirtableSubmitForm({
  tagList,
  categoryList,
}: AirtableSubmitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  // set default values for form fields and validation schema
  const form = useForm<SubmitFormData>({
    resolver: zodResolver(SubmitSchema),
    defaultValues: {
      name: "",
      link: "",
      description: "",
      introduction: "",
      unique: "",
      format: "In-person",
      notes: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      zip: "",
      bondNumber: "",
      plan: "Standard",
      performerPermit: false,
      bonded: false,
      imageId: "",
      tags: [],
      categories: [],
      gallery: [],
      ...(SUPPORT_ITEM_ICON ? { iconId: "" } : {}),
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit(
    (data: SubmitFormData) => {
      console.log("Form submitted with data:", data);
      startTransition(async () => {
        submit(data)
          .then((data) => {
            if (data.status === "success") {
              console.log("AirtableSubmitForm, success:", data.message);
              form.reset();
              router.push(`/payment/${data.id}`);
              toast.success(data.message);
            }
            if (data.status === "error") {
              console.error("AirtableSubmitForm, error:", data.message);
              toast.error(data.message);
            }
          })
          .catch((error) => {
            console.error("AirtableSubmitForm, error:", error);
            toast.error("Something went wrong");
          });
      });
    },
    (errors) => {
      console.error("Form validation errors:", errors);
      toast.error("Please fix the form errors before submitting");
    },
  );

  const handleUploadChange = (status: {
    isUploading: boolean;
    imageId?: string;
  }) => {
    setIsUploading(status.isUploading);
    if (status.imageId) {
      form.setValue("imageId", status.imageId);
    }
  };

  const handleUploadIconChange = (status: {
    isUploading: boolean;
    imageId?: string;
  }) => {
    setIsUploading(status.isUploading);
    if (status.imageId) {
      form.setValue("iconId", status.imageId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          The 101 Directory Vendor Intake Submission Form
        </h1>
        <p className="text-gray-900">
          To be included as a listing in the Child Actor 101 Resource Directory
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card className="overflow-hidden">
            <CardContent className="mt-6 space-y-8">
              {/* Listing Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Listing Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What is the name of your business?"
                        {...field}
                      />
                    </FormControl>
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
                    <FormLabel className="text-lg font-semibold">
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your business website URL"
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
                    <FormLabel className="text-lg font-semibold">
                      What You Offer?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the main service, class, or product you're listing. Stick to the core of what's being offered."
                        {...field}
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <div className="text-sm text-gray-900 mt-2">
                      <p className="font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>"Weekly improv acting class for kids 8–12."</li>
                        <li>"Headshot photography with 3 looks included."</li>
                        <li>"Audition taping and coaching combo session."</li>
                      </ul>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Who Is It For */}
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Who Is It For?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe who this service is designed for. Be specific about your target audience."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-sm text-gray-900 mt-2">
                      <p className="font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          "Designed for child actors new to the industry."
                        </li>
                        <li>
                          "Best for teens looking to up their dramatic range."
                        </li>
                        <li>"Parents of actors wanting clear, guided help."</li>
                      </ul>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Why Is It Unique? */}
              <FormField
                control={form.control}
                name="unique"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Why Is It Unique?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What sets this apart from similar listings?"
                        {...field}
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <div className="text-sm text-gray-900 mt-2">
                      <p className="font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          "Taught by a Nickelodeon casting assistant with 10+
                          years of experience."
                        </li>
                        <li>
                          "Includes a detailed post-session report and clip
                          editing."
                        </li>
                        <li>
                          "Focuses on authentic emotion over memorization."
                        </li>
                      </ul>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Format */}
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Format
                    </FormLabel>
                    <FormControl>
                      <select
                        className="form-select w-full"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="In-person">In-person</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Extras / Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Extras / Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Include any pricing bundles, language support, materials, etc."
                        {...field}
                        className="resize-none min-h-[80px]"
                      />
                    </FormControl>
                    <div className="text-sm text-gray-900 mt-2">
                      <p className="font-medium mb-2">Examples:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>"Discounted bundles available for 3+ sessions."</li>
                        <li>"Spanish-speaking families welcome."</li>
                        <li>"You'll receive a prep guide before we meet."</li>
                      </ul>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bond Number */}
              <FormField
                control={form.control}
                name="bondNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Bond #
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Surety Bond # (filed with Labor Commissioner)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div className="border-t pt-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Los Angeles" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
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
                              <SelectItem value="San Diego">
                                San Diego
                              </SelectItem>
                              <SelectItem value="Sacramento">
                                Sacramento
                              </SelectItem>
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

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip</FormLabel>
                        <FormControl>
                          <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Age Range */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Age Range
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={tagList.map((tag) => ({
                          value: tag._id,
                          label: tag.name || "",
                        }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        value={field.value}
                        placeholder="Select age ranges you work with"
                        variant="default"
                        maxCount={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => {
                  const currentPlan = form.watch("plan");
                  const isMultiSelect =
                    currentPlan === "Standard" || currentPlan === "Pro";

                  return (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Categories{" "}
                        {isMultiSelect ? "(Select Multiple)" : "(Select One)"}
                      </FormLabel>
                      <FormControl>
                        {isMultiSelect ? (
                          <MultiSelect
                            className="shadow-none"
                            options={categoryList.map((category) => ({
                              value: category._id,
                              label: category.name || "",
                            }))}
                            onValueChange={(selected) =>
                              field.onChange(selected)
                            }
                            value={field.value}
                            placeholder="Select categories"
                            variant="default"
                          />
                        ) : (
                          <Select
                            onValueChange={(value) => field.onChange([value])}
                            value={field.value?.[0] || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryList.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Logo Upload */}
              {SUPPORT_ITEM_ICON && (
                <FormField
                  control={form.control}
                  name={"iconId" as keyof SubmitFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Logo
                      </FormLabel>
                      <FormControl>
                        <div className="mt-4 w-full h-[370px]">
                          <ImageUpload
                            currentImageUrl={iconUrl}
                            onUploadChange={handleUploadIconChange}
                            type="icon"
                          />
                        </div>
                      </FormControl>
                      <div className="text-sm text-gray-900 mt-2">
                        <p>Upload your business logo (PNG/JPEG, max 200KB)</p>
                        <p className="italic">
                          Recommended: 400x200px for optimal display
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Gallery Upload - Premium Only */}
              <FormField
                control={form.control}
                name="gallery"
                render={({ field }) => {
                  const currentPlan = form.watch("plan");
                  const isPro = currentPlan === "Pro";

                  if (!isPro) {
                    return null; // Don't show gallery upload for non-Pro plans
                  }

                  return (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Gallery Images (Pro Feature)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array.from(
                              { length: 5 },
                              (_, index) => index + 1,
                            ).map((index) => (
                              <div key={index} className="w-full h-[200px]">
                                <ImageUpload
                                  currentImageUrl={
                                    field.value?.[index - 1] || ""
                                  }
                                  onUploadChange={(status) => {
                                    if (status.imageId) {
                                      const newGallery = [
                                        ...(field.value || []),
                                      ];
                                      newGallery[index - 1] = status.imageId;
                                      field.onChange(newGallery);
                                    }
                                  }}
                                  type="image"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <div className="text-sm text-gray-900 mt-2">
                        <p>
                          Upload up to 3 additional images to showcase your
                          business (PNG/JPEG, max 200KB each)
                        </p>
                        <p className="italic">
                          Recommended: 800x600px for optimal display
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Legal Requirements Section */}
              <div className="border-t pt-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Legal Requirements
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-blue/5 rounded-lg">
                    <h4 className="font-medium mb-2">
                      California Child Performer Services Permit
                    </h4>
                    <p className="text-sm text-gray-900 mb-2">
                      Required by California law for anyone providing services
                      to minors in entertainment.
                    </p>
                    <a
                      href="https://www.dir.ca.gov/dlse/Child_performer_services_permit.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline text-sm"
                    >
                      More Info:
                      https://www.dir.ca.gov/dlse/Child_performer_services_permit.htm
                    </a>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Bonded For Advanced Fees
                    </h4>
                    <p className="text-sm text-gray-900 mb-2">
                      If you charge fees upfront for future services, California
                      law requires a $50,000 bond on file.
                    </p>
                    <a
                      href="https://www.childactor101.com/ab1319"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      More Info: https://www.childactor101.com/ab1319
                    </a>
                  </div>
                </div>

                {/* Legal Checkboxes */}
                <div className="mt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="performerPermit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            I confirm I hold a California Child Performer
                            Services Permit
                          </FormLabel>
                          <p className="text-xs text-gray-900">
                            Required by California law for anyone providing
                            services to minors in entertainment.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bonded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            I am bonded for advanced fees (if applicable)
                          </FormLabel>
                          <p className="text-xs text-gray-900">
                            Only check if you charge fees upfront for future
                            services.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter
              className={cn(
                "flex flex-col items-center space-y-2 p-6 bg-muted/50",
                isPending && "pointer-events-none",
              )}
            >
              {/* Plan Selection - Moved to end for better UX */}
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Choose Your Plan
                    </FormLabel>
                    <div className="text-center mb-4">
                      <a
                        href="/pricing"
                        target="_blank"
                        className="text-brand-blue hover:text-brand-blue-dark underline text-sm"
                        rel="noreferrer"
                      >
                        View detailed pricing and features →
                      </a>
                    </div>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Standard", "Pro"].map((plan) => (
                          <label
                            key={plan}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              field.value === plan
                                ? "border-brand-orange bg-brand-orange/10"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              value={plan}
                              checked={field.value === plan}
                              onChange={() => field.onChange(plan)}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className="font-semibold">{plan}</div>
                              <div className="text-sm text-gray-900">
                                {plan === "Standard" && "$25/month"}
                                {plan === "Pro" && "$50/month"}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending || isUploading}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SmileIcon className="mr-2 h-4 w-4" />
                    Submit Listing
                  </>
                )}
              </Button>
              {isUploading && (
                <div className="flex items-center space-x-2 text-sm text-gray-900">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  <span>Uploading image...</span>
                </div>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

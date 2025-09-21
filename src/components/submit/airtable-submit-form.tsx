"use client";

import { fetchWebsite } from "@/actions/fetch-website";
import { type SubmitFormData, submit } from "@/actions/submit";
import { Icons } from "@/components/icons/icons";
import CustomMde from "@/components/shared/custom-mde";
import ImageUpload from "@/components/shared/image-upload";
import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { SUPPORT_AI_SUBMIT, SUPPORT_ITEM_ICON } from "@/lib/constants";
import { SubmitSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type {
  CategoryListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmileIcon, Wand2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AirtableSubmitFormProps {
  tagList: any[];
  categoryList: any[];
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
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      imageId: "",
      tags: [],
      categories: [],
      ...(SUPPORT_ITEM_ICON ? { iconId: "" } : {}),
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit((data: SubmitFormData) => {
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
  });

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

  const handleAIFetch = async () => {
    const link = form.getValues("link");
    if (!link) {
      toast.error("Please enter a website URL first");
      return;
    }

    setIsAIProcessing(true);
    try {
      const result = await fetchWebsite({ url: link });
      if (result.status === "success" && result.data) {
        const { name, description, introduction } = result.data;

        if (name) form.setValue("name", name);
        if (description) form.setValue("description", description);
        if (introduction) form.setValue("introduction", introduction);

        toast.success("AI fetch website info completed!");
      } else {
        toast.error("Failed to fetch website info");
      }
    } catch (error) {
      console.error("AirtableSubmitForm, handleAIFetch, error:", error);
      toast.error("Failed to fetch website info");
    } finally {
      setIsAIProcessing(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          The 101 Directory Vendor Intake Submission Form
        </h1>
        <p className="text-muted-foreground">
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

              {/* Website with AI Autofill */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Website
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter your business website URL"
                          className={cn(SUPPORT_AI_SUBMIT && "pr-[100px]")}
                          {...field}
                        />
                      </FormControl>
                      {SUPPORT_AI_SUBMIT && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 h-7 px-2"
                              disabled={isAIProcessing}
                            >
                              {isAIProcessing ? (
                                <Icons.spinner className="h-4 w-4 animate-spin" />
                              ) : (
                                <Wand2Icon className="h-4 w-4" />
                              )}
                              <span className="text-xs">AI Autofill</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>AI Autofill</DialogTitle>
                              <DialogDescription>
                                Would you like AI to automatically fill in the
                                form by the URL? It may take some time, so
                                please wait patiently.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleAIFetch}
                                disabled={isAIProcessing}
                              >
                                {isAIProcessing ? (
                                  <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  "Analyze"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
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
                    <div className="text-sm text-muted-foreground mt-2">
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
                      <CustomMde {...field} />
                    </FormControl>
                    <div className="text-sm text-muted-foreground mt-2">
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Categories
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={categoryList.map((category) => ({
                          value: category._id,
                          label: category.name || "",
                        }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        value={field.value}
                        placeholder="Select categories"
                        variant="default"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Image */}
              {SUPPORT_ITEM_ICON && (
                <FormField
                  control={form.control}
                  name={"iconId" as keyof SubmitFormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Profile Image
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
                      <div className="text-sm text-muted-foreground mt-2">
                        <p>Link to your logo or desired image</p>
                        <p className="italic">
                          Example:
                          https://coaching.childactor101.com/coachlogo.png
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Legal Requirements Section */}
              <div className="border-t pt-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Legal Requirements
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      California Child Performer Services Permit
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Required by California law for anyone providing services
                      to minors in entertainment.
                    </p>
                    <a
                      href="https://www.dir.ca.gov/dlse/Child_performer_services_permit.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      More Info:
                      https://www.dir.ca.gov/dlse/Child_performer_services_permit.htm
                    </a>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Bonded For Advanced Fees
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
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
              </div>
            </CardContent>
            <CardFooter
              className={cn(
                "flex flex-col items-center space-y-2 p-6 bg-muted/50",
                isPending && "pointer-events-none",
              )}
            >
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
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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

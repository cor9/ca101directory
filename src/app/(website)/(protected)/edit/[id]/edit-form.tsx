"use client";

import { Edit, EditFormData } from "@/actions/edit";
import CustomMde from "@/components/custom-mde";
import ImageUpload from "@/components/image-upload";
import { Icons } from "@/components/shared/icons";
import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { urlForImage } from "@/lib/image";
import { EditSchema } from "@/lib/schemas";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { ItemFullInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { BellRingIcon, HourglassIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditFormProps {
  item: ItemFullInfo;
  tagList: TagListQueryResult;
  categoryList: CategoryListQueryResult;
}

/**
 * 1. form component form shadcn/ui
 * https://ui.shadcn.com/docs/components/form
 * 
 * 2. React Hook Form
 * https://react-hook-form.com/get-started
 */
export function EditForm({ item, tagList, categoryList }: EditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // set default values for form fields and validation schema
  const form = useForm<EditFormData>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      id: item._id,
      name: item.name,
      link: item.link,
      description: item.description,
      introduction: item.introduction,
      imageId: item.image?.asset?._ref,
      tags: item.tags.map(tag => tag._id),
      categories: item.categories.map(category => category._id),
      pricePlan: item.pricePlan,
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit((data: EditFormData) => {
    console.log('EditFormonSubmit, data:', data);
    startTransition(async () => {
      const { status } = await Edit(data);
      console.log('EditForm, status:', status);
      if (status === "success") {
        form.reset();
        toast.success("Update success");

        // TODO: not working, still showing the old item
        // router.refresh();
        // router.push(`/update/${item._id}`);

        router.push(`/dashboard/`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    });
  });

  const handleUploadChange = (status: { isUploading: boolean; imageId?: string }) => {
    setIsUploading(status.isUploading);
    if (status.imageId) {
      form.setValue("imageId", status.imageId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="overflow-hidden">
          {/* <CardHeader>
            <CardTitle>Update</CardTitle>
            <CardDescription>
              Update your product info.
            </CardDescription>
          </CardHeader> */}
          <CardContent className="mt-4 space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the link to your product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name of your product" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={categoryList.map(category => ({ value: category._id, label: category.name || '' }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        defaultValue={field.value}
                        placeholder="Select categories"
                        variant="default"
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        className="shadow-none"
                        options={tagList.map(tag => ({ value: tag._id, label: tag.name || '' }))}
                        onValueChange={(selected) => field.onChange(selected)}
                        defaultValue={field.value}
                        placeholder="Select tags"
                        variant="default"
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief description of your product"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <span>Introduction</span>
                        <span className="text-sm text-muted-foreground">
                          (Markdown supported, image link supported)
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <CustomMde {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <span>Image</span>
                        <span className="text-sm text-muted-foreground">
                          (PNG or JPEG, maximum file size 1MB)
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="mt-4 w-full h-[370px]">
                        <ImageUpload onUploadChange={handleUploadChange}
                          currentImageUrl={urlForImage(item.image).src} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4 sm:flex-row sm:justify-between sm:space-y-0">
            <Button size="lg"
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending || isUploading}
            >
              {(isPending || isUploading) && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>
                {isPending ? "Updating..." : (isUploading ? "Uploading image..." : "Update")}
              </span>
            </Button>

            {/* NOTICE: if this item is in free plan, any update will cause this item to be reviewed again */}
            {
              item.pricePlan === 'free' && (
                <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                  <BellRingIcon className="h-4 w-4" />
                  <span>Your submission will be unpublished & reviewed again.</span>
                </div>
              )
            }
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

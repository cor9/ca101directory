"use client";

import { SubmitItem, SubmitItemFormData } from "@/actions/submit-item";
import ImageUpload from "@/components/image-upload";
import { Icons } from "@/components/shared/icons";
import { MultiSelect } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import { SubmitItemSchema } from "@/lib/schemas";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from 'canvas-confetti';
import { HourglassIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// https://github.com/RIP21/react-simplemde-editor
// if directly import, frontend error: document is not defined
// import { SimpleMdeReact } from "react-simplemde-editor";
// but if dynamic import, no error reported
import dynamic from 'next/dynamic';
const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), { ssr: false });

// if import SimpleMDE from react-simplemde-editor, SimpleMDE.Options can't be found
// import SimpleMDE from "react-simplemde-editor";
// but import type SimpleMDE from "easymde" is ok
import type SimpleMDE from "easymde";

// import this css to style the editor
import "@/styles/easymde-dark.css";
import "easymde/dist/easymde.min.css";

interface SubmitItemFormProps {
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
export function SubmitItemForm({ tagList, categoryList }: SubmitItemFormProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // https://github.com/RIP21/react-simplemde-editor?tab=readme-ov-file#options
  // useMemo to memoize options so they do not change on each rerender
  // https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file#options-example
  // don't show image or upload-image button, images are uploaded in the image field of form
  // don't show side-by-side, it will trigger fullscreen
  // show preview? tailwindcss reset all styles, so by default the preview is not working,
  // but if add class `prose` to the previewClass, it will work, but not perfect
  const mdeOptions = useMemo(() => {
    return {
      status: false,
      autofocus: false,
      spellChecker: false,
      placeholder: 'Enter the introduction of your product',
      toolbar: ["heading", "bold", "italic", "strikethrough",
        "code", "quote", "unordered-list", "ordered-list",
        "link", "preview", "guide"],
      previewClass: ['prose', 'prose-slate', 'dark:prose-invert', 
        'bg-background', 'text-foreground'],
    } as SimpleMDE.Options;
  }, []);

  // set default values for form fields and validation schema
  const form = useForm<SubmitItemFormData>({
    resolver: zodResolver(SubmitItemSchema),
    defaultValues: {
      name: "",
      link: "",
      description: "",
      introduction: "",
      imageId: "",
      tags: [],
      categories: [],
    },
  });

  // submit form if data is valid
  const onSubmit = form.handleSubmit((data: SubmitItemFormData) => {
    console.log('SubmitItemForm, onSubmit, data:', data);
    startTransition(async () => {
      const { status } = await SubmitItem(data);
      console.log('SubmitItemForm, status:', status);
      if (status === "success") {
        confetti();
        form.reset();
        toast.success("Submission successful");
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
          <CardHeader>
            {/* <CardTitle>Submit Your Product</CardTitle>
            <CardDescription>Fill in the details of your product for submission.</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the name of your product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a brief description of your product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className="shadow-none"
                      options={categoryList.map(category => ({ value: category._id, label: category.name || '' }))}
                      onValueChange={(selected) => field.onChange(selected)}
                      defaultValue={field.value}
                      placeholder="Select categories"
                      variant="default"
                      maxCount={5}
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
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      className="shadow-none"
                      options={tagList.map(tag => ({ value: tag._id, label: tag.name || '' }))}
                      onValueChange={(selected) => field.onChange(selected)}
                      defaultValue={field.value}
                      placeholder="Select tags"
                      variant="default"
                      maxCount={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="introduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <span>Introduction</span>
                      <span className="text-sm text-muted-foreground">
                        (Markdown supported)
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    {/* value and onChange */}
                    <div data-theme={theme}>
                      <SimpleMdeReact
                        options={mdeOptions}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex items-center gap-2">
                      <span>Image</span>
                      <span className="text-sm text-muted-foreground">
                        (maximum size 1MB)
                      </span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <div className="mt-4 w-full h-[300px]">
                      <ImageUpload onUploadChange={handleUploadChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch space-y-4 bg-muted px-6 py-4 sm:flex-row sm:justify-between sm:space-y-0">
            <Button size="lg"
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending || isUploading}
            >
              {(isPending || isUploading) && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>
                {isPending ? "Submitting..." : (isUploading ? "Uploading image..." : "Submit")}
              </span>
            </Button>
            <FormDescription className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
              <HourglassIcon className="h-4 w-4" />
              <span>Your submission will be reviewed before being published.</span>
            </FormDescription>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

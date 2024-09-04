"use client";

import { SubmitItem, SubmitItemFormData } from "@/actions/submit-item";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SubmitItemSchema } from "@/lib/schemas";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityClient } from "@/sanity/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from 'canvas-confetti';
import { HourglassIcon } from "lucide-react";
import Image from "next/image";
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
import "easymde/dist/easymde.min.css";

import { Option } from '@/components/shared/multiple-selector';
const OPTIONS: Option[] = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember' },
  { label: 'Gatsby', value: 'gatsby' },
  { label: 'Astro', value: 'astro' },
];

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
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // https://github.com/RIP21/react-simplemde-editor?tab=readme-ov-file#options
  // useMemo to memoize options so they do not change on each rerender
  // https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file#options-example
  // dont't show image or upload-image button, images are uploaded in the image field of form
  const mdeOptions = useMemo(() => {
    return {
      status: false,
      autofocus: false,
      spellChecker: false,
      placeholder: 'Enter the introduction of your product (Markdown supported)',
      toolbar: ["heading", "bold", "italic", "strikethrough",
        "|", "code", "quote", "unordered-list", "ordered-list",
        "|", "link", "horizontal-rule",
        "|", "preview", "side-by-side", "guide"],
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
        toast.success("Something went wrong. Please try again.");
      }
    });
  });

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SubmitItemForm, handleUploadImage, file:', e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log('SubmitItemForm, handleUploadImage, file is null');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      e.target.value = '';
      toast.error('Image size should be less than 1MB.');
      return;
    }

    setIsUploading(true);
    const imageAsset = await uploadImage(file);
    if (!imageAsset) {
      e.target.value = '';
      toast.error('Upload Image failed, please try again.');
      return;
    }
    console.log('SubmitItemForm, handleUploadImage, imageId:', imageAsset._id);
    form.resetField("imageId");
    form.setValue("imageId", imageAsset._id);
    setImageUrl(imageAsset.url);
    setIsUploading(false);
  };

  const uploadImage = async (file: File) => {
    const asset = await sanityClient.assets.upload('image', file);
    console.log('SubmitItemForm, uploadImage, asset url:', asset.url);
    return asset;
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  size="sm"
                  className="flex flex-wrap items-start justify-start"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {categoryList.map((item) => (
                    <ToggleGroupItem key={item._id} value={item._id}>
                      {item.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
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
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  size="sm"
                  className="flex flex-wrap items-start justify-start"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {tagList.map((item) => (
                    <ToggleGroupItem key={item._id} value={item._id}>
                      {item.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
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
              <FormLabel>Introduction</FormLabel>
              <FormControl>
                <SimpleMdeReact
                  options={mdeOptions}
                  {...field}
                />
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={(e) => handleUploadImage(e)}
                    accept="image/*"
                  />
                  {imageUrl && (
                    <Image
                      alt="image"
                      className="border sm:w-max-[600px]"
                      height={64}
                      width={128}
                      src={imageUrl}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={"default"}
          className=""
          disabled={isPending || isUploading}
        >
          {(isPending || isUploading) && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          <span>{isPending ? "Submitting..." :
            (isUploading ? "Uploading image..." : "Submit")}
          </span>
        </Button>

        <FormDescription className="text-sm text-primary dark:text-foreground flex items-center gap-2">
          <HourglassIcon className="size-4 inline-block" />
          <span>Your submission will be reviewed before being published.</span>
        </FormDescription>
      </form>
    </Form >
  )
}

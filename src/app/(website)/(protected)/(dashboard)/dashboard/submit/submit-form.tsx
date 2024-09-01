"use client";

import { SubmitItem, SubmitItemFormData } from "@/actions/submit-item";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// https://github.com/RIP21/react-simplemde-editor
import type SimpleMDE from "easymde";
import { SimpleMdeReact } from "react-simplemde-editor";
// import this css to style the editor
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
 * https://nextjs.org/learn/dashboard-app/mutating-data
 * 
 * 3. TODO: fix issue: Error: document is not defined
 */
export function SubmitItemForm({ tagList, categoryList }: SubmitItemFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState('');

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
        "|", "link",
        "|", "preview", "side-by-side"],
    } as SimpleMDE.Options;
  }, []);

  const handleEditorChange = useCallback((value: string) => {
    resetField("introduction");
    setIntroduction(value);
    setValue("introduction", value);
  }, []);

  const handleTagChange = (tags) => {
    console.log("SubmitItemForm, handleTagChange, tags", tags);
    resetField("tags");
    setSelectedTags(tags);
    setValue("tags", tags); // Update the form value for tags
  };

  const handleCategoryChange = (categories) => {
    console.log("SubmitItemForm, handleCategoryChange, categories", categories);
    resetField("categories");
    setSelectedCategories(categories);
    setValue("categories", categories); // Update the form value for categories
  };

  const {
    register,
    setValue,
    reset,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitItemFormData>({
    // when click submit button, or change the form data, validate the form data
    resolver: async (data, context, options) => {
      console.log("SubmitItemForm, validate formData", data);
      return zodResolver(SubmitItemSchema)(data, context, options);
    },
    // default values for SubmitItemFormData
    defaultValues: {
      name: "",
      link: "",
      description: "",
      introduction: "",
      imageId: "",
      tags: selectedTags,
      categories: selectedCategories,
    },
  })

  // if form is valid, call submitItem action
  const onSubmit = handleSubmit((data: SubmitItemFormData) => {
    console.log('SubmitItemForm, onSubmit, data:', data);
    startTransition(async () => {
      const { status } = await SubmitItem({
        ...data
      });
      console.log('SubmitItemForm, status:', status);
      if (status === "success") {
        confetti();
        reset();
        toast.success("Submission successful");
        router.push(`/dashboard/`);
      } else {
        toast.success("Something went wrong. Please try again.");
      }
    });
  });

  const handleUploadImage = async (e) => {
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
    resetField("imageId");
    setValue("imageId", imageAsset._id);
    setImageUrl(imageAsset.url);
    setIsUploading(false);
  };

  const uploadImage = async (file) => {
    const asset = await sanityClient.assets.upload('image', file);
    console.log('SubmitItemForm, uploadImage, asset url:', asset.url);
    return asset;
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Submit</CardTitle> */}
          <CardDescription>
            {/* Please enter the information of your product. */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                Name
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="name"
                  className="w-full"
                  autoComplete="off"
                  placeholder="Enter the name of your product"
                  {...register("name")}
                />
              </div>
            </div>
            {errors?.name && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_name">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="link">
                Link
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="link"
                  className="w-full"
                  autoComplete="off"
                  placeholder="Enter the link to your product"
                  {...register("link")}
                />
              </div>
            </div>
            {errors?.link && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_link">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.link.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="description">
                Description
              </Label>
              <div className="w-full flex flex-col">
                <Textarea
                  id="description"
                  className="w-full"
                  autoComplete="off"
                  placeholder="Enter a brief description of your product"
                  {...register("description")}
                />
              </div>
            </div>
            {errors?.description && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_description">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.description.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                Categories
              </Label>
              <div className="w-full flex flex-wrap items-center gap-4">
                <ToggleGroup type="multiple" variant="outline" size={"sm"}
                  className="flex flex-wrap items-start justify-start"
                  value={selectedCategories}
                  onValueChange={handleCategoryChange}>
                  {categoryList && categoryList.length > 0 && categoryList.map((item) => (
                    <ToggleGroupItem key={item._id} value={item._id}
                      aria-label={item.name ?? ''}
                      className={`${selectedCategories.includes(item._id) ? '' : ''}`}>
                      {item.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
            {/* Hidden input to register categories */}
            <input type="hidden" id="categories" {...register("categories")} />
            {errors?.categories && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_categories">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.categories.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                Tags
              </Label>
              <div className="w-full flex flex-wrap items-center gap-4">
                <ToggleGroup type="multiple" variant="outline" size={"sm"}
                  className="flex flex-wrap items-start justify-start"
                  value={selectedTags}
                  onValueChange={handleTagChange}>
                  {tagList && tagList.length > 0 && tagList.map((item) => (
                    <ToggleGroupItem key={item._id} value={item._id}
                      aria-label={item.name ?? ''}
                      className={`${selectedTags.includes(item._id) ? '' : ''}`}>
                      {item.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
            {/* Hidden input to register tags */}
            <input type="hidden" id="tags" {...register("tags")} />
            {errors?.tags && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_tags">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.tags.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="introduction">
                Introduction
              </Label>
              <div className="w-full flex flex-col">
                <SimpleMdeReact
                  options={mdeOptions}
                  value={introduction}
                  onChange={handleEditorChange}
                />
              </div>
            </div>
            {/* Hidden input to register introduction */}
            <input type="hidden" id="introduction" {...register("introduction")} />
            {errors?.introduction && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_introduction">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.introduction.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="imageFile">
                Image
              </Label>
              <Input id="imageFile" type="file"
                className="w-full"
                onChange={handleUploadImage}
                accept="image/*" />

              {/* 960x540 => 480x270 => 128x64 */}
              {imageUrl &&
                <Image alt="image"
                  className="border sm:w-max-[600px]"
                  height={64} width={128}
                  src={imageUrl}
                />
              }
            </div>
            {/* Hidden input to register imageId */}
            <input type="hidden" id="imageId" {...register("imageId")} />
            {errors?.imageId && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_imageId">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.imageId.message}</p>
              </div>
            )}

          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/25 pt-6">
          <div className="w-full flex items-center justify-between gap-8">
            <Button
              type="submit"
              variant={"default"}
              className=""
              disabled={isPending}
            >
              {(isPending || isUploading) && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              <span>{isPending ? "Submitting..." :
                (isUploading ? "Uploading image..." : "Submit")}
              </span>
            </Button>

            <div className="text-sm text-primary dark:text-foreground flex items-center gap-2">
              <HourglassIcon className="size-4 inline-block" />
              <span>
                Your submission will be reviewed before being published.
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

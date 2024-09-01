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
import { submitConfig } from "@/config/submit";
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

// Markdown Editor
import "easymde/dist/easymde.min.css";
import type SimpleMDE from "easymde";
import { SimpleMdeReact } from "react-simplemde-editor";

interface SubmitItemFormProps {
  tagList: TagListQueryResult;
  categoryList: CategoryListQueryResult;
}

// https://ui.shadcn.com/docs/components/form
// https://nextjs.org/learn/dashboard-app/mutating-data
export function SubmitItemForm({ tagList, categoryList }: SubmitItemFormProps) {
  const router = useRouter();

  const [mdContent, setMdContent] = useState("Please enter the information of your product (Markdown is supported).");
  const onMdContentChange = useCallback((value: string) => {
    resetField("mdContent");
    setMdContent(value);
    setValue("mdContent", value);
  }, []);
  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
    } as SimpleMDE.Options;
  }, []);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  console.log("SubmitItemForm, selectedTags", selectedTags);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  console.log("SubmitItemForm, selectedCategories", selectedCategories);

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
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
    resetField
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
      mdContent: "",
      coverImageId: "",
      tags: selectedTags,
      categories: selectedCategories,
    },
  })

  // if form is valid, call submitItem action
  const onSubmit = handleSubmit(data => {
    console.log('SubmitItemForm, onSubmit, data:', data);
    startTransition(async () => {
      const { status } = await SubmitItem({
        ...data
      });
      console.log('SubmitItemForm, status:', status);
      if (status === "success") {
        confetti();
        reset();
        toast.success(submitConfig.form.success);
        router.push(`/dashboard/`);
      } else {
        toast.success(submitConfig.form.error);
      }
    });
  });

  const handleUploadCoverImage = async (e) => {
    console.log('SubmitItemForm, handleUploadCoverImage, file:', e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log('SubmitItemForm, handleUploadCoverImage, file is null');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      e.target.value = '';
      toast.error('Image size should be less than 1MB.');
      return;
    }

    setIsUploading(true);
    const coverImageAsset = await uploadImage(file);
    if (!coverImageAsset) {
      e.target.value = '';
      toast.error('Upload Image failed, please try again.');
      return;
    }
    console.log('SubmitItemForm, handleUploadCoverImage, coverImageId:', coverImageAsset._id);
    resetField("coverImageId");
    setValue("coverImageId", coverImageAsset._id);
    setCoverImageUrl(coverImageAsset.url);
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

            <SimpleMdeReact
              options={autofocusNoSpellcheckerOptions}
              value={mdContent}
              onChange={onMdContentChange}
            />
            {/* Hidden input to register mdContent */}
            <input type="hidden" id="mdContent" {...register("mdContent")} />
            {errors?.mdContent && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_mdContent">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.mdContent.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                {submitConfig.form.name}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="name"
                  className="w-full"
                  autoComplete="off"
                  placeholder={submitConfig.form.namePlaceHolder}
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
              <Label className="min-w-[100px]" htmlFor="name">
                {submitConfig.form.categories}
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
                {submitConfig.form.tags}
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
              <Label className="min-w-[100px]" htmlFor="link">
                {submitConfig.form.link}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="link"
                  className="w-full"
                  autoComplete="off"
                  placeholder={submitConfig.form.linkPlaceHolder}
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
                {submitConfig.form.desc}
              </Label>
              <div className="w-full flex flex-col">
                <Textarea
                  id="description"
                  className="w-full"
                  autoComplete="off"
                  placeholder={submitConfig.form.descPlaceHolder}
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
              <Label className="min-w-[100px]" htmlFor="coverImageFile">
                {submitConfig.form.image}
              </Label>
              <Input id="coverImageFile" type="file"
                className="w-full"
                onChange={handleUploadCoverImage}
                accept="image/*" />

              {/* 960x540 => 480x270 => 128x64 */}
              {coverImageUrl &&
                <Image alt="product cover image"
                  className="border sm:w-max-[600px]"
                  height={64} width={128}
                  src={coverImageUrl}
                />
              }
            </div>
            {/* Hidden input to register coverImageId */}
            <input type="hidden" id="coverImageId" {...register("coverImageId")} />
            {errors?.coverImageId && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_coverImageId">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.coverImageId.message}</p>
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
              <span>{isPending ? submitConfig.form.submiting :
                (isUploading ? submitConfig.form.imageUploading : submitConfig.form.submit)}
              </span>
            </Button>

            <div className="text-sm text-primary dark:text-foreground flex items-center gap-2">
              <HourglassIcon className="size-4 inline-block" />
              <span>{submitConfig.form.notice}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

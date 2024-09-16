import { ProjectsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { SanityImageAssetDocument } from "next-sanity";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "item",
  title: "Item",
  type: "document",
  // icon: ProjectsIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        }
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
        }
      ],
    }),
    defineField({
      name: "submitter",
      title: "Submitter",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "markdown",
      // https://github.com/sanity-io/sanity-plugin-markdown?tab=readme-ov-file#custom-image-urls
      // The function will be invoked whenever an image is pasted 
      // or dragged into the markdown editor, after upload completes.
      options: {
        imageUrl: (imageAsset: SanityImageAssetDocument) => {
          return `${imageAsset.url}?w=400&h=400`;
        }
      }
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessiblity.",
          initialValue: () => "Product Image",
          // TODO: add initial value from name or optimize accessibility in frontend
        },
      ],
    }),
    // publish related fields
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
		defineField({
			name: 'publishDate',
      title: 'Publish Date',
			type: 'datetime',
      hidden: ({ parent }) => !parent.published,
		}),
    // payment related fields
    defineField({
      name: "paied",
      title: "Paied",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "reference",
      to: [{ type: "order" }],
      hidden: ({ parent }) => !parent.paied,
    }),
    // price plan related fields
    defineField({
      name: "pricePlan",
      title: "Price Plan",
      type: 'string',
      initialValue: 'free',
      options: {
        list: ['free', 'pro'],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: "freePlanStatus",
      title: "Free Plan Status",
      type: 'string',
      initialValue: 'submitted',
      options: {
        list: ['submitted', 'reviewing', 'approved', 'rejected'],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({ parent }) => parent.pricePlan !== 'free',
    }),
    defineField({
      name: "proPlanStatus",
      title: "Pro Plan Status",
      type: 'string',
      initialValue: 'waiting',
      options: {
        list: ['waiting', 'success', 'fail'],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({ parent }) => parent.pricePlan !== 'pro',
    }),
  ],
  // https://www.sanity.io/docs/previews-list-views
  // Configure and customize how documents are displayed 
  // within Sanity Studio's document lists.
  preview: {
    select: {
      title: "name",
      media: "image",
      date: "publishDate",
    },
    prepare({ title, media, date }) {
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        media,
        subtitle
      };
    },
  },
	orderings: [
		{
      title: 'Date (new to old)',
      name: 'dateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Date (old to new)',
      name: 'dateAsc',
      by: [{ field: 'publishDate', direction: 'asc' }],
    },
		{
			title: 'Name',
			name: 'name',
			by: [{ field: 'name', direction: 'asc' }],
		},
	],
});

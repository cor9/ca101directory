import { format, parseISO } from "date-fns";
import { SanityImageAssetDocument } from "next-sanity";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "item",
  title: "Item",
  type: "document",
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
      description: "The categories of the item, may have multiple categories",
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
      description: "The tags of the item, may have multiple tags",
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
      description: "The introduction of the item, in markdown format",
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
    // defineField({
    //   name: "published",
    //   title: "Published",
    //   description: "If the item is published, it will be visible to the public",
    //   type: "boolean",
    //   initialValue: false,
    // }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      description: "The lastest publish date when the item is published",
      type: 'datetime',
      // hidden: ({ parent }) => !parent.published,
    }),
    // price plan related fields
    defineField({
      name: "pricePlan",
      title: "Price Plan",
      description: "The price plan of the item, chosen by the submitter",
      type: 'string',
      initialValue: 'free',
      options: {
        list: ['free', 'pro'],
        layout: 'radio',
        direction: 'horizontal',
      },
      // TODO(javayhu) read only
      // readOnly: true,
    }),
    defineField({
      name: "freePlanStatus",
      title: "Free Plan Status",
      description: "The status of the item when the submitter choose free plan",
      type: 'string',
      initialValue: 'submitted',
      options: {
        list: [
          { title: 'Submitted', value: 'submitted' },
          { title: 'Pending (Waiting for review)', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({ parent }) => parent.pricePlan !== 'free',
      // TODO(javayhu) read only
      // readOnly: true,
    }),
    defineField({
      name: "proPlanStatus",
      title: "Pro Plan Status",
      description: "The status of the item when the submitter choose pro plan",
      type: 'string',
      initialValue: 'submitted',
      options: {
        list: [
          { title: 'Submitted', value: 'submitted' },
          { title: 'Pending (Waiting for payment)', value: 'pending' },
          { title: 'Success', value: 'success' },
          { title: 'Failed', value: 'failed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({ parent }) => parent.pricePlan !== 'pro',
      // TODO(javayhu) read only
      // readOnly: true,
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      description: "The reason for rejecting the item",
      type: 'string',
      hidden: ({ parent }) => parent.freePlanStatus !== 'rejected',
      initialValue: 'Other reasons',
      options: {
        list: [
          'The item is not a good fit for our directory',
          'The image of the item is not good quality',
          'The information of the item is not clear',
          'Other reasons',
        ],
        layout: 'dropdown',
      },
    }),
    // payment related fields
    defineField({
      name: "paid",
      title: "Paid",
      description: "If the item is paid, it means the payment is successful",
      type: "boolean",
      initialValue: false,
      // TODO(javayhu) read only
      // readOnly: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "The successful payment order of the submission",
      type: "reference",
      to: [{ type: "order" }],
      hidden: ({ parent }) => !parent.paid,
      // TODO(javayhu) read only
      // readOnly: true,
    }),
  ],
  // https://www.sanity.io/docs/previews-list-views
  // Configure and customize how documents are displayed 
  // within Sanity Studio's document lists.
  preview: {
    select: {
      name: "name",
      media: "image",
      date: "publishDate",
    },
    prepare({ name, media, date }) {
      const title = date ? `✅ ${name}` : `⏳ ${name}`;
      const subtitle = date ? format(parseISO(date), "yyyy/MM/dd") : "not published";
      return {
        title,
        media,
        subtitle
      };
    },
  },
  orderings: [
    {
      title: 'Publish Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Publish Date (Oldest)',
      name: 'dateAsc',
      by: [{ field: 'publishDate', direction: 'asc' }],
    },
    {
      title: 'Name (A-Z)',
      name: 'name',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
});

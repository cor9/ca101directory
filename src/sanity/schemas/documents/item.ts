import { ProjectsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "item",
  title: "Item",
  type: "document",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (document, context) => {
          // @ts-ignore
          const enName = document.name.find(item => item._key === "en");
          return enName ? enName.value : "";
        },
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "desc",
      title: "Description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: -1,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block"
        },
        {
          type: 'image'
        },
        {
          type: 'code'
        }
      ],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    })
  ],
  // https://www.sanity.io/docs/previews-list-views
  // Configure and customize how documents are displayed 
  // within Sanity Studio's document lists.
  preview: {
    select: {
      name: "name",
      media: "logo",
      order: "order",
      date: "_createdAt",
    },
    prepare({ name, media, order, date }) {
      const subtitles = [
        order && `Order:${order}`,
        date && `${format(parseISO(date), "yyyy/MM/dd")}`,
      ].filter(Boolean);

      // @ts-ignore
      const enName = name.find(item => item._key === "en");
      const title = enName ? enName.value : "Unknown";
      return {
        title,
        media,
        subtitle: subtitles.join(" ")
      };
    },
  },
});

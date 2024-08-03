import { ProjectsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";
import localizedString from "@/sanity/schemas/objects/localizedString";

export default defineType({
  name: "Item",
  title: "item",
  icon: ProjectsIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      // type: "string",
      // type: localizedString.name,
      type: "localizedString",
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
      name: "desc",
      title: "Description",
      // type: "string",
      // type: localizedString.name,
      type: "localizedString",
    }),
    defineField({
      name: "website",
      title: "Website",
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
  preview: {
    select: {
      title: "name",
      media: "logo",
      order: "order",
      date: "_createdAt",
    },
    prepare({ title, media, order, date }) {
      const subtitles = [
        order && `order:${order}`,
        date && `${format(parseISO(date), "yyyy/MM/dd")}`,
      ].filter(Boolean);
      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});

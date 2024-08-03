import { TiersIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";
import localizedString from "@/sanity/schemas/objects/localizedString";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TiersIcon,
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
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    })
  ],
  preview: {
    select: {
      title: "name",
      order: "order",
      date: "_createdAt",
    },
    prepare({ title, order, date }) {
      const subtitles = [
        order && `order:${order}`,
        date && `${format(parseISO(date), "yyyy/MM/dd")}`,
      ].filter(Boolean);
      return { title, subtitle: subtitles.join(" ") };
    }
  },
});

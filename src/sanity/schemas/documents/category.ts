import { TiersIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TiersIcon,
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
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    })
  ],
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

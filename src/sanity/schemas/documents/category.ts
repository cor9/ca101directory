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
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
    }),
  ],
  preview: {
    select: {
      name: "name",
      media: "logo",
      date: "_createdAt",
    },
    prepare({ name, media, date }) {
      // @ts-ignore
      const enName = name.find(item => item._key === "en");
      const title = enName ? enName.value : "No Name";
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        media,
        subtitle
      };
    },
  },
});

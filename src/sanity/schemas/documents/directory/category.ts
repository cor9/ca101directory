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
      group: 'intl',
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      group: 'intl',
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
      group: 'intl',
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      name: "name",
      priority: "priority",
      media: "logo",
      date: "_createdAt",
    },
    prepare({ name, priority, media, date }) {
      // @ts-ignore
      const enName = name.find(item => item._key === "en");
      const title = enName ? enName.value : "No Name";
      const subtitle = `Priority: ${priority} ` + format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        media,
        subtitle
      };
    },
  },
	orderings: [
		{
			title: 'Priority',
			name: 'priority',
			by: [{ field: 'priority', direction: 'desc' }],
		},
		{
			title: 'Slug',
			name: 'slug',
			by: [{ field: 'slug.current', direction: 'asc' }],
		},
	],
});

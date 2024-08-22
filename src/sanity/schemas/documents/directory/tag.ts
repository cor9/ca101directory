import { TagsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagsIcon,
  groups: [
    {
      name: 'intl',
      title: 'Internationalization',
    },
  ],
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
      type: "slug",
      group: 'intl',
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
  ],
  preview: {
    select: {
      name: "name",
      date: "_createdAt",
    },
    prepare({ name, date }) {
      // @ts-ignore
      const enName = name.find(item => item._key === "en");
      const title = enName ? enName.value : "No Name";
      const subtitle = format(parseISO(date), "yyyy/MM/dd");
      return {
        title,
        subtitle
      };
    },
  },
	orderings: [
		{
			title: 'Slug',
			name: 'slug',
			by: [{ field: 'slug.current', direction: 'asc' }],
		},
	],
});

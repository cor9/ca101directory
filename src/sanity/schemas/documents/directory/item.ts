import { ProjectsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "item",
  title: "Item",
  type: "document",
  icon: ProjectsIcon,
  groups: [
    {
      name: 'media',
      title: 'Media',
    },
  ],
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
      type: "string",
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
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block"
        },
        // {
        //   type: 'image'
        // },
        // {
        //   type: 'code'
        // }
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent"
    }),
    defineField({
      name: "logo",
      title: "Logo",
      group: 'media',
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      group: 'media',
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
		defineField({
			name: 'publishDate',
      title: 'Publish Date',
			type: 'datetime',
      initialValue: () => new Date().toISOString(),
		}),
  ],
  // https://www.sanity.io/docs/previews-list-views
  // Configure and customize how documents are displayed 
  // within Sanity Studio's document lists.
  preview: {
    select: {
      title: "name",
      media: "logo",
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
			title: 'Date',
			name: 'date',
			by: [{ field: 'publishDate', direction: 'desc' }],
		},
		{
			title: 'Name',
			name: 'name',
			by: [{ field: 'name', direction: 'asc' }],
		},
	],
});

import { DocumentsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "blogPost",
    title: "Blog Post",
    type: "document",
    icon: DocumentsIcon,
    fields: [
        defineField({
            name: "title",
            title: "Title",
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
            name: "excerpt",
            title: "Excerpt",
            description: "The excerpt is used in blog feeds, and also for search results",
            type: "text",
            rows: 3,
            validation: rule => rule.max(200)
        }),
        defineField({
            name: "featured",
            title: "Mark as Featured",
            type: "boolean",
            initialValue: false,
            description: "Featured posts will be displayed on the home page."
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: { type: "blogCategory" } }]
          }),
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "user" }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "blockContent"
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
                    description: "Important for SEO and accessiblity."
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
    preview: {
        select: {
            title: "title",
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
            title: 'Date',
            name: 'date',
            by: [{ field: 'publishDate', direction: 'desc' }],
        },
        {
            title: 'Title',
            name: 'title',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
});
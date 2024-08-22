import { DocumentsIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "blogPost",
    title: "Blog Post",
    type: "document",
    icon: DocumentsIcon,
    groups: [
        {
            name: 'intl',
            title: 'Internationalization',
        },
        {
            name: 'media',
            title: 'Media',
        },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Title",
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
                    const enTitle = document.title.find(item => item._key === "en");
                    return enTitle ? enTitle.value : "";
                },
                maxLength: 96,
                isUnique: (value, context) => context.defaultIsUnique(value, context),
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "blogCategory",
            title: "Blog Category",
            type: "reference",
            to: [{ type: "blogCategory" }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "submitter",
            title: "Submitter",
            type: "reference",
            to: [{ type: "user" }],
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "blockContent"
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
    preview: {
        select: {
            title: "title",
            media: "image",
            date: "publishDate",
        },
        prepare({ title, media, date }) {
            // @ts-ignore
            const enTitle = title.find((item: any) => item._key === "en");
            const formattedTitle = enTitle ? enTitle.value : "No Title";
            const subtitle = format(parseISO(date), "yyyy/MM/dd");
            return {
                title: formattedTitle,
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
            title: 'Slug',
            name: 'slug',
            by: [{ field: 'slug.current', direction: 'asc' }],
        },
    ],
});
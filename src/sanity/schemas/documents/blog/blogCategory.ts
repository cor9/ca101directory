import { TiersIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "blogCategory",
    title: "Blog Category",
    type: "document",
    icon: TiersIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: rule => rule.required()
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
            name: "priority",
            title: "Priority",
            type: "number",
            description: "Priority of the category, used to sort the categories",
            initialValue: 0,
        }),
        defineField({
            name: "color",
            title: "Color",
            type: "string",
            description: "Color of the category, used to style the category",
            options: {
                list: [
                    { title: "Slate", value: "slate" },
                    { title: "Gray", value: "gray" },
                    { title: "Zinc", value: "zinc" },
                    { title: "Neutral", value: "neutral" },
                    { title: "Stone", value: "stone" },
                    { title: "Red", value: "red" },
                    { title: "Orange", value: "orange" },
                    { title: "Amber", value: "amber" },
                    { title: "Yellow", value: "yellow" },
                    { title: "Lime", value: "lime" },
                    { title: "Green", value: "green" },
                    { title: "Emerald", value: "emerald" },
                    { title: "Teal", value: "teal" },
                    { title: "Cyan", value: "cyan" },
                    { title: "Sky", value: "sky" },
                    { title: "Blue", value: "blue" },
                    { title: "Indigo", value: "indigo" },
                    { title: "Violet", value: "violet" },
                    { title: "Purple", value: "purple" },
                    { title: "Fuchsia", value: "fuchsia" },
                    { title: "Pink", value: "pink" },
                    { title: "Rose", value: "rose" },
                ]
            }
        }),
    ],
    preview: {
        select: {
            name: "name",
            priority: "priority",
            date: "_createdAt",
        },
        prepare({ name, priority, date }) {
            const title = `${priority} - ${name}`
            const subtitle = format(parseISO(date), "yyyy/MM/dd");
            return {
                title,
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
            title: 'Name',
            name: 'name',
            by: [{ field: 'name', direction: 'asc' }],
        }
    ],
});
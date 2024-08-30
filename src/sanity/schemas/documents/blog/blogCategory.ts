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
                    { title: "Green", value: "green" },
                    { title: "Blue", value: "blue" },
                    { title: "Purple", value: "purple" },
                    { title: "Orange", value: "orange" }
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
        },
    ],
});
// import {
//     orderRankField,
//     orderRankOrdering
//   } from "@sanity/orderable-document-list";
import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "blogPost",
    title: "Blog Post",
    type: "document",
    icon: DocumentsIcon,
    // orderings: [orderRankOrdering],
    fields: [
        // orderRankField({ type: "docs" }),
        defineField({
            name: "title",
            title: "Title",
            type: "string"
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            validation: Rule => Rule.required(),
            options: {
                source: "title",
                maxLength: 96
            }
            }),
        defineField({
            name: "blogCategory",
            title: "Blog Category",
            type: "reference",
            validation: Rule => Rule.required(),
            to: [{ type: "blogCategory" }]
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "blockContent"
        })
    ]
});
// import {
//     orderRankField,
//     orderRankOrdering
//   } from "@sanity/orderable-document-list";

import { TiersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "blogCategory",
    title: "Blog Category",
    type: "document",
    icon: TiersIcon,
    // orderings: [orderRankOrdering],
    fields: [
        //   orderRankField({ type: "category" }),
        defineField({
            name: "title",
            title: "Title",
            type: "string"
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96
            },
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text"
        })
    ]
});
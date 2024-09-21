import { urlForImage } from "./image";
import toMarkdown from "@sanity/block-content-to-markdown";

/**
 * 1. block-content-to-markdown
 * https://github.com/sanity-io/block-content-to-markdown
 * 
 * 2. code example
 * https://github.com/skillrecordings/products/blob/dcfd9e9b339b178b297f1f0932ecc0e73e25fbaf/apps/epic-web/migrations/pt-to-md.ts#L84
 */
export function portableTextToMarkdown(body: any) {
    const markdownContent = toMarkdown(body, { serializers });
    // console.log("markdownContent", markdownContent);
    return markdownContent;
}

const serializers = {
    types: {
        image: ({ node }: any) => {
            // don't use toMarkdown.getImageUrl, because it doesn't work
            // const imageUrl = toMarkdown.getImageUrl({options: {}, node});
            const imageUrl = urlForImage(node);
            // console.log("node", node);
            console.log("mdx imageUrl", imageUrl);
            return `![${node.alt || 'image'}](${imageUrl.src})`;
        },
        code: ({ node }: any) => {
            // From @sanity/code-input
            return `\`\`\`${node.language || ''}\n${node.code}\n\`\`\``;
        },
    },
}

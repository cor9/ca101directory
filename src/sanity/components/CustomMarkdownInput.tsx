import { MarkdownInput, MarkdownInputProps } from 'sanity-plugin-markdown'
import { useMemo } from 'react';

/**
 * https://www.sanity.io/plugins/sanity-plugin-markdown
 */
export function CustomMarkdownInput(props: MarkdownInputProps) {
    // @ts-ignore
    const reactMdeProps: MarkdownInputProps['reactMdeProps'] =
        useMemo(() => {
            return {
                options: {
                    // more options available, see:
                    // https://github.com/Ionaru/easy-markdown-editor#options-list
                    // remove the fullscreen button, looks bad in the studio;
                    // remove the image button, it just inserts a empty image tag;
                    toolbar: ["heading", "bold", "italic", "strikethrough",
                        "|", "code", "quote", "unordered-list", "ordered-list",
                        "|", "link", "upload-image",
                        "|", "preview", "side-by-side"],
                },
                // more props available, see:
                // https://github.com/RIP21/react-simplemde-editor#react-simplemde-easymde-markdown-editor
            }
        }, []);

    return <MarkdownInput {...props} reactMdeProps={reactMdeProps} />
}
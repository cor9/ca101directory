// import { MdxCard } from '@/components/content/mdx-card';
import { Callout } from '@/components/shared/callout';
import { CopyButton } from '@/components/shared/copy-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import BlurImage from './shared/blur-image';

import { evaluate, MDXRemote, MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';

// https://github.com/hashicorp/next-mdx-remote?tab=readme-ov-file#custom-components
// const components = {
//   h1: (props) => (
//     <h1 {...props} className="large-text">
//       {props.children}
//     </h1>
//   ),
// }

const customComponents = {
    h1: ({ className, ...props }) => (
        <h1
            className={cn(
                "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h2: ({ className, ...props }) => (
        <h2
            className={cn(
                "mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0",
                className,
            )}
            {...props}
        />
    ),
    h3: ({ className, ...props }) => (
        <h3
            className={cn(
                "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h4: ({ className, ...props }) => (
        <h4
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h5: ({ className, ...props }) => (
        <h5
            className={cn(
                "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    h6: ({ className, ...props }) => (
        <h6
            className={cn(
                "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    a: ({ className, ...props }) => (
        <a
            className={cn("font-medium underline underline-offset-4", className)}
            {...props}
        />
    ),
    p: ({ className, ...props }) => (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
        />
    ),
    ul: ({ className, ...props }) => (
        <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
        <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }) => (
        <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
        <blockquote
            className={cn(
                "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
                className,
            )}
            {...props}
        />
    ),
    img: ({
        className,
        alt,
        ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={cn("rounded-md border", className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full", className)} {...props} />
        </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr
            className={cn("m-0 border-t p-0 even:bg-muted", className)}
            {...props}
        />
    ),
    th: ({ className, ...props }) => (
        <th
            className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
            )}
            {...props}
        />
    ),
    td: ({ className, ...props }) => (
        <td
            className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
            )}
            {...props}
        />
    ),
    pre: ({
        className,
        __rawString__,
        ...props
    }: React.HTMLAttributes<HTMLPreElement> & { __rawString__?: string }) => (
        <div className="group relative w-full overflow-hidden">
            <pre
                className={cn(
                    "max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-900 py-4 dark:bg-zinc-900",
                    className,
                )}
                {...props}
            />
            {__rawString__ && (
                <CopyButton
                    value={__rawString__}
                    className={cn(
                        "absolute right-4 top-4 z-20",
                        "duration-250 opacity-0 transition-all group-hover:opacity-100",
                    )}
                />
            )}
        </div>
    ),
    code: ({ className, ...props }) => (
        <code
            className={cn(
                "relative rounded-md border bg-muted px-[0.4rem] py-1 font-mono text-sm text-foreground",
                className,
            )}
            {...props}
        />
    ),
    Callout,
    // Card: MdxCard,
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
        <h3
            className={cn(
                "mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight",
                className,
            )}
            {...props}
        />
    ),
    Steps: ({ ...props }) => (
        <div
            className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
            {...props}
        />
    ),
    Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
        <Link
            className={cn("font-medium underline underline-offset-4", className)}
            {...props}
        />
    ),
    LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
        <Link
            className={cn(
                "flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10",
                className,
            )}
            {...props}
        />
    ),
};

export function MdxRemoteClient(props) {
    const MDXImage = (props: any) => {
        return null;
        // if (!images) return null;
        // const blurDataURL = images.find(
        //   (image) => image.src === props.src,
        // )?.blurDataURL;
    
        // return (
        //   <div className="mt-5 w-full overflow-hidden rounded-lg border">
        //     <BlurImage
        //       {...props}
        //       blurDataURL={blurDataURL}
        //       className="size-full object-cover object-center"
        //     />
        //   </div>
        // );
      };

    // remarkGfm的作用是显示table，以及链接形式的文字自动变成带下划线的链接样式
    // rehypePrettyCode的作用是代码高亮，以及复制代码的功能
    // rehypeAutolinkHeadings的作用是自动生成锚点，目的是给toc组件用的
    // 有了这几个插件，就不用tailwindcss的typography插件了
    // 同时，实际要生效的话，还需要搭配mdx.css文件
      const options: MDXRemoteOptions = {
        mdxOptions: {
          remarkPlugins: [
            // ...
            // remarkFlexibleToc, // <---------
            remarkGfm,
          ], 
          rehypePlugins: [
            rehypeSlug,
            () => (tree) => {
              visit(tree, (node) => {
                if (node?.type === "element" && node?.tagName === "pre") {
                  const [codeEl] = node.children;
      
                  if (codeEl.tagName !== "code") return;
      
                  node.__rawString__ = codeEl.children?.[0].value;
                }
              });
            },
            [
              rehypePrettyCode,
              {
                theme: "github-dark",
                keepBackground: false,
                onVisitLine(node) {
                  // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
                  if (node.children.length === 0) {
                    node.children = [{ type: "text", value: " " }];
                  }
                },
              },
            ],
            () => (tree) => {
              visit(tree, (node) => {
                if (node?.type === "element" && node?.tagName === "figure") {
                  if (!("data-rehype-pretty-code-figure" in node.properties)) {
                    return;
                  }
      
                  const preElement = node.children.at(-1);
                  if (preElement.tagName !== "pre") {
                    return;
                  }
      
                  preElement.properties["__rawString__"] = node.__rawString__;
                }
              });
            },
            [
              rehypeAutolinkHeadings,
              {
                properties: {
                  className: ["subheading-anchor"],
                  ariaLabel: "Link to section",
                },
              },
            ],
          ],
        },
        // parseFrontmatter: true,
        // scope: {
        //   readingTime: calculateSomeHow(source),
        // },
        // vfileDataIntoScope: "toc", // <---------
      };

    return (
        <MDXRemote
            {...props}
            options={options}
            components={{ 
                ...customComponents, 
                ...(props.components || {}),
                Image: MDXImage
            }}
        />
    )
}
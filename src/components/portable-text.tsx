import { sanityClient } from "@/sanity/lib/client";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import createImageUrlBuilder from "@sanity/image-url";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import Link from "next/link";
import speakingurl from "speakingurl";
import Anchor from "./anchor";
import { urlForImageWithSize } from "@/lib/utils";

export const urlFor = source =>
    createImageUrlBuilder(sanityClient).image(source);

export const imageBuilder = source =>
    createImageUrlBuilder(sanityClient).image(source);

// export function GetImage(image, CustomImageBuilder = null) {
//     const imageProps = useNextSanityImage(sanityClient, image, {
//         imageBuilder: CustomImageBuilder
//     });
//     if (!image || !image.asset) {
//         return null;
//     }
//     return imageProps;
// }

// Barebones lazy-loaded image component
const ImageComponent = ({ value }) => {
    // const {width, height} = getImageDimensions(value);
    return (
        <Image
        src={urlForImageWithSize(value, 960, 540)}
            width={480}
            height={270}
            // src={urlForImageWithSize(value, value.dimensions.width, value.dimensions.height)}
            // width={value.dimensions.width}
            // height={value.dimensions.height}
            // {...urlForImage(value).url()}
            // blurDataURL={urlForImage(value).blurDataURL}
            objectFit="cover"
            sizes="(max-width: 800px) 100vw, 800px"
            alt={value.alt || "Image"}
            // placeholder="blur"
            loading="lazy"
        />
    );
};

const getChildrenText = props => {
    return props
        .map(node => (typeof node === "string" ? node : node.text || ""))
        .join("");
};

// Set up Portable Text serialization
export const PortableText = props => (
    <PortableTextComponent
        components={{
            types: {
                image: ImageComponent,
                //   code: Code,
                //   box: BoxType,
                //   alert: Alertbox,
                //   table: PortableTextTable
            },
            block: {
                h1: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h1 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h1>
                    );
                },
                h2: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h2 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h2>
                    );
                },
                h3: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h3 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h3>
                    );
                },
                h4: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h4 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h4>
                    );
                },
                h5: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h5 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h5>
                    );
                },
                h6: ({ children }) => {
                    const text = getChildrenText(children);
                    const slug = speakingurl(text);
                    return (
                        <h6 id={slug} className="group">
                            {children} <Anchor slug={slug} />
                        </h6>
                    );
                }
            },
            marks: {
                link: ({ children, value }) => {
                    const rel = !value.href.startsWith("/")
                        ? "noopener"
                        : undefined;
                    const target = !value.href.startsWith("/")
                        ? "_blank"
                        : undefined;
                    return (
                        <a href={value.href} rel={rel} target={target}>
                            {children}
                        </a>
                    );
                },
                internalLink: ({ children, value }) => {
                    return (
                        <Link href={`/item/${value.slug.current}`}>
                            <a> {children}</a>
                        </Link>
                    );
                }
            }
        }}
        {...props}
    />
);
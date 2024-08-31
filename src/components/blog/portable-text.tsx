import "@/styles/prism.css";

import Image from "next/image";
import Link from "next/link";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import { urlForImage } from "@/lib/image";
import Iframe from "react-iframe";

// https://github.com/wooorm/refractor
import js from "refractor/lang/javascript";
import jsx from "refractor/lang/jsx";
import html from "refractor/lang/markup";
import css from "refractor/lang/css";
import bash from "refractor/lang/bash";
import typescript from "refractor/lang/typescript";

// https://github.com/rexxars/react-refractor
import { Refractor, registerLanguage } from 'react-refractor';
registerLanguage(js);
registerLanguage(jsx);
registerLanguage(html);
registerLanguage(css);
registerLanguage(bash);
registerLanguage(typescript);

// Barebones lazy-loaded image component
const ImageComponent = ({ value }) => {
  // const {width, height} = getImageDimensions(value);
  return (
    <Image
      src={urlForImage(value)}
      alt={value.alt || "Image"}
      loading="lazy"
      className="rounded-md border object-cover"
      sizes="(max-width: 800px) 100vw, 800px"
    />
  );
};

const TableComponent = ({ value }) => {
  const [head, ...rows] = value.table.rows;

  return (
    <table>
      {head.cells.filter(Boolean).length > 0 && (
        <thead>
          <tr>
            {head.cells.map(cell => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.cells.map((cell, index) => {
              return <td key={cell}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CodeComponent = ({ value }) => {
  return (
    <Refractor
      // In this example, `props` is the value of a `code` field
      language={value.language || "bash"}
      value={value.code}
      markers={value.highlightedLines}
    />
  );
};

// const IframePreview = ({ value }) => {
//   const { url, height } = value;
//   if (!url) {
//     return <p>Missing Embed URL</p>;
//   }
//   const { id, service } = getVideoId(url);

//   const isYoutubeVideo = id && service === "youtube";

//   const finalURL = isYoutubeVideo
//     ? `https://www.youtube-nocookie.com/embed/${id}`
//     : url;

//   return (
//     <Iframe
//       url={finalURL}
//       width="100%"
//       height={height || "350"}
//       className={cx(!height && "aspect-video", "rounded-md")}
//       display="block"
//       position="relative"
//       frameBorder="0"
//       allowfullscreen
//       loading="lazy"
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
//     />
//   );
// };

/**
 * https://github.com/portabletext/react-portabletext
 */
const components = {
  types: {
    code: CodeComponent,
    image: ImageComponent,
    tables: TableComponent,
    // embed: IframePreview,
  },
  marks: {
    em: ({ children }) => {
      return (
        <em className="font-semibold">{children}</em>
      );
    },
    strong: ({ children }) => { // fix strong not working in dark mode
      return (
        <strong className="">
          {children}
        </strong>
      );
    },
    center: props => (
      <div className="text-center">{props.children}</div>
    ),
    highlight: props => (
      <span className="font-bold text-blue-500">
        {props.children}
      </span>
    ),
    link: ({ children, value }) => { // <a>
      const rel = !value.href.startsWith("/")
        ? "noopener"
        : undefined;
      const target = !value.href.startsWith("/")
        ? "_blank"
        : undefined;
      return (
        <a href={value.href} rel={rel} target={target}
          className="font-medium underline underline-offset-4">
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => { // <Link>
      return (
        <Link href={`/blog/${value?.slug?.current}`}
          className="font-medium underline underline-offset-4">
          {children}
        </Link>
      );
    }
  },
  block: { // change headings level, h3 at most
    h1: ({ children }) => (
      <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-8 scroll-m-20 text-base font-semibold tracking-tight">
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
};

// Set up Portable Text serialization
export const PortableText = props => (
  <PortableTextComponent components={components} {...props} />
);

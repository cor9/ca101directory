import localFont from "next/font/local";

// https://nextjs.org/docs/app/api-reference/components/font
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts
// CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. 
// No requests are sent to Google by the browser.

// https://fonts.google.com/specimen/Source+Serif+4
// https://gwfh.mranftl.com/fonts/source-serif-4?subsets=latin
export const fontSourceSerif = localFont({
  src: "./source-serif-4-v8-latin-regular.woff2",
  variable: "--font-source-serif",
})

// https://fonts.google.com/specimen/Source+Serif+4
// variable used in app/layout.tsx, then applyed in tailwind.config.ts
// export const fontSourceSerif4 = Source_Serif_4({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: "--font-source-serif",
// })

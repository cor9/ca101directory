import localFont from "next/font/local";
import { Inter as FontSans, Source_Code_Pro, Urbanist } from "next/font/google";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

// TODO: all fonts are not used, remove unused fonts

// https://nextjs.org/docs/app/api-reference/components/font
// https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts
// CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. 
// No requests are sent to Google by the browser.

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontUrban = Urbanist({
  subsets: ["latin"],
  variable: "--font-urban",
})

export const fontHeading = localFont({
  src: "./CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export const fontGeist = localFont({
  src: "./GeistVF.woff2",
  variable: "--font-geist",
})

// https://fonts.google.com/specimen/Source+Serif+4
// variable used in app/layout.tsx, then applyed in tailwind.config.ts
export const fontSourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-source-serif",
  // variable: "--font-heading",
})

// https://fonts.google.com/specimen/Source+Sans+3
export const fontSourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400'],
  
  variable: "--font-source-sans",
})

// https://fonts.google.com/specimen/Source+Code+Pro
export const fontSourceCode = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-source-code",
})

// https://fonts.google.com/specimen/Lato
// export const fontLato = Lato({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: "--font-lato",
// })

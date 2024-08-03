import "server-only";

import { experimental_taintUniqueValue } from "react";

// token is used to fetch data in Server Components, 
// can not be used in client components for security reasons
export const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_TOKEN");
}

experimental_taintUniqueValue(
  "Do not pass the sanity API read token to the client.",
  process,
  token,
);

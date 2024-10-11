import { createClient } from "next-sanity";
import type { SanityClient } from "sanity";
import { apiVersion, dataset, projectId } from "./api";
import { token } from "./token";

export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: "published",
  useCdn: process.env.NODE_ENV === "production",

  // TODO:when write data to sanity, token with write permission is required!
  token,
});

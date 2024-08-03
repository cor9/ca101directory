/**
 * This file is used to allow Presentation to set the app in Draft Mode, which will load Visual Editing
 * and query draft content and preview the content as it will appear once everything is published
 */
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { sanityClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

const clientWithToken = sanityClient.withConfig({ token });

// This api route is used to allow PresentationTool in sanity studio to setup Draft Mode
export async function GET(request: Request) {
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    clientWithToken,
    request.url,
  );
  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  draftMode().enable();

  redirect(redirectTo);
}

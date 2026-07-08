"use server";

import { requireAdmin } from "@/lib/auth/guards";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

/**
 * demostrate how to use requireAdmin to check user's role,
 * and return different responses according to different roles.
 */
export async function admin(): Promise<ServerActionResponse> {
  const guard = await requireAdmin();

  if (guard.authorized) {
    return { status: "success", message: "Allowed Server Action!" };
  }

  return { status: "error", message: "Forbidden Server Action!" };
}

"use server";

import { unstable_update } from "@/auth";
import { getUserById, updateUser } from "@/data/supabase-user";
import { currentUser } from "@/lib/auth";
import type { SettingsSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function settings(
  values: z.infer<typeof SettingsSchema>,
): Promise<ServerActionResponse> {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { status: "error", message: "User not found" };
    }

    // Update other profile fields using Supabase
    const updateData: Partial<{ full_name: string | null }> = {};
    if (values.name) updateData.full_name = values.name;

    const updatedUser = await updateUser(user.id, updateData);
    console.log("settings, updatedUser:", updatedUser);

    if (!updatedUser) {
      return { status: "error", message: "Failed to update profile!" };
    }

    // unstable update in Beta version
    unstable_update({
      user: {
        name: updatedUser.full_name || updatedUser.email,
      },
    });

    revalidatePath("/settings");
    return { status: "success", message: "Account information updated!" };
  } catch (error) {
    console.log("settings, error", error);
    return {
      status: "error",
      message: "Failed to update account information!",
    };
  }
}

"use server";

import { unstable_update } from "@/auth";
import { getUserById, updateUser } from "@/data/supabase-user";
import { currentUser } from "@/lib/auth";
import type { SettingsSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
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

    // console.log('settings, values:', values);
    if (user.isOAuth) {
      values.password = undefined;
      values.newPassword = undefined;
    }

    // password change needs verification
    if (values.password && values.newPassword) {
      // For Supabase Auth, we don't need to verify old password
      // Supabase handles this internally
      const { error: passwordError } = await supabase.auth.updateUser({
        password: values.newPassword
      });
      
      if (passwordError) {
        return { status: "error", message: "Failed to update password!" };
      }
    }

    // Update other profile fields using Supabase
    const updateData: Partial<{ full_name: string }> = {};
    if (values.name) updateData.full_name = values.name;
    
    const updatedUser = await updateUser(user.id, updateData);
    console.log("settings, updatedUser:", updatedUser);

    if (!updatedUser) {
      return { status: "error", message: "Failed to update profile!" };
    }

    // unstable update in Beta version
    unstable_update({
      user: {
        name: updatedUser.full_name,
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

"use server";

import { getUserById } from "@/data/supabase-user";
import { currentUser } from "@/lib/auth";
import type { UserPasswordData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function updateUserPassword(
  values: UserPasswordData,
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

    // password change needs verification
    if (values.password && values.newPassword) {
      // Use Supabase Auth to update password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) {
        console.error("Password update error:", error);
        return { status: "error", message: "Failed to update password!" };
      }

      console.log("updateUserPassword: Password updated successfully");

      revalidatePath("/settings");
      return { status: "success", message: "User password updated!" };
    }
    return { status: "error", message: "No password provided" };
  } catch (error) {
    console.log("updateUserPassword, error", error);
    return {
      status: "error",
      message: "Failed to update user password!",
    };
  }
}

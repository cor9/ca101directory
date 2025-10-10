"use server";

import { unstable_update } from "@/auth";
import { getUserById, updateUser } from "@/data/supabase-user";
import { currentUser } from "@/lib/auth";
import { type UserNameData, UserNameSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function updateUserName(
  values: UserNameData,
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

    // console.log('updateUserName, values:', values);
    const { name } = UserNameSchema.parse(values);

    const updatedUser = await updateUser(user.id, {
      full_name: name,
    });

    if (!updatedUser) {
      return { status: "error", message: "Failed to update user name!" };
    }

    // unstable update in Beta version
    unstable_update({
      user: {
        name: updatedUser.full_name || updatedUser.email,
      },
    });

    revalidatePath("/settings");
    return { status: "success", message: "User name updated!" };
  } catch (error) {
    console.log("updateUserName, error", error);
    return {
      status: "error",
      message: "Failed to update user name!",
    };
  }
}

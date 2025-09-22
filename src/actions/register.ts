"use server";

import { createUser, getUserByEmail } from "@/data/supabase-user";
import { RegisterSchema } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";
import type * as z from "zod";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function register(
  values: z.infer<typeof RegisterSchema>,
): Promise<ServerActionResponse> {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: "error", message: "Invalid Fields!" };
  }

  const { email, password, name } = validatedFields.data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { status: "error", message: "Email already being used" };
  }

  try {
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return { status: "error", message: authError.message };
    }

    if (!authData.user) {
      return { status: "error", message: "Failed to create user" };
    }

    // Create user record in our users table
    const user = await createUser({
      id: authData.user.id,
      email: authData.user.email || '',
      name,
      role: 'USER'
    });

    if (!user) {
      return { status: "error", message: "Failed to create user profile" };
    }

    return {
      status: "success",
      message: "Please check your email for verification",
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { status: "error", message: "Something went wrong" };
  }
}

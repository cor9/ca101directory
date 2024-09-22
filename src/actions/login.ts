"use server";

import * as z from "zod";
import { LoginSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, } from "@/lib/mail";
import { generateVerificationToken, } from "@/lib/tokens";

export const login = async (
    values: z.infer<typeof LoginSchema>, 
    callbackUrl?: string | null
) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "User does not exist!" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(
            verificationToken.identifier,
            verificationToken.token
        );
        return { success: "Confirmation email sent!" };
    }

    try {
        console.log('login, start signIn');
        // https://youtu.be/1MTyCvS05V4?t=9828
        const result = await signIn("credentials", {
            email,
            password,
            redirect: true,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
        console.log('login, result:', result);
        return { success: "Login successful!" };


        // if (result?.error) {
        //     return { error: `Login failed: ${result.error}` };
        // }

        // 手动刷新 session，加了这个也没有用
        // await fetch("/api/auth/session");
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
}
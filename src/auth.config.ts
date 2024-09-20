import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas";
import { SHOW_AUTH_LOGS } from "@/lib/constants";
import { sanityClient } from "@/sanity/lib/client";

// https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.config.ts
// authConfig is used in middleware.ts and support edge runtime
export default {
  providers: [
    // https://authjs.dev/getting-started/authentication/oauth
    GitHub,
    Google,
    // https://authjs.dev/getting-started/authentication/credentials
    // https://youtu.be/1MTyCvS05V4?t=11279
    // Credentials won't affect the edge compatibility because it won't run on the edge
    Credentials({
      authorize: async (credentials) => {
        // called when user attempts to sign in with credentials
        console.log('authorize, credentials:', credentials);
        
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        // @sanity-typegen-ignore
        const user_qry = `*[_type == "user" && email== "${credentials?.email}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        if (!user || !user.password) {
          console.error('authorize error: user not found or password invalid');
          return null;
        }

        if (SHOW_AUTH_LOGS) {
          console.log('authorize, user:', user);
        }
        const passwordsMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (passwordsMatch) {
          return {
            id: user._id,
            role: user.role,
            ...user
          };
        }

        // Return `null` to indicate that the credentials are invalid
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;
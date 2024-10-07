import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { LoginSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "@/data/user";

/**
 * https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.config.ts
 * authConfig is used in middleware.ts and support edge runtime
 */
export default {
  // https://authjs.dev/getting-started/migrating-to-v5#environment-variables
  // The AUTH_TRUST_HOST environment variable serves the same purpose as setting trustHost: true in your Auth.js configuration. 
  // This is necessary when running Auth.js behind a proxy. 
  // When set to true we will trust the X-Forwarded-Host and X-Forwarded-Proto headers 
  // passed to the app by the proxy to auto-detect the host URL (AUTH_URL)
  trustHost: true,
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
        if (SHOW_QUERY_LOGS) {
          console.log('authorize, credentials:', credentials);
        }

        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          console.error('authorize error: credentials invalid');
          return null;
        }

        // @sanity-typegen-ignore
        // const userQry = `*[_type == "user" && email== "${credentials?.email}"][0]`;
        // const user = await sanityClient.fetch(userQry);

        if (!credentials?.email) {
          console.error('authorize error: email invalid');
          return null;
        }
        const user = await getUserByEmail(credentials.email as string);
        if (!user || !user.password) {
          console.error('authorize error: user not found or password invalid');
          return null;
        }

        const passwordsMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (passwordsMatch) {
          const userWithRole = {
            ...user,
            id: user._id,
            role: user.role,
          };
          if (SHOW_QUERY_LOGS) {
            console.log('authorize, user:', userWithRole);
          }
          return userWithRole;
        }

        // Return `null` to indicate that the credentials are invalid
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;
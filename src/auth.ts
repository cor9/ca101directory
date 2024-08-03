import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SanityAdapter } from "@/adapters/sanity-adapter";
import sanityClient from "@/lib/sanityClient";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/form-schemas";
import bcrypt from "bcryptjs";

import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";

// https://authjs.dev/getting-started/installation#configure
// providers for authorization, adapters for user data persistence
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  //unstable update in Beta version
  unstable_update
} = NextAuth({
  // debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  providers: [
    // https://authjs.dev/getting-started/authentication/oauth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    // https://authjs.dev/getting-started/authentication/credentials
    Credentials({
      authorize: async (credentials) => {
        // called when user attempts to sign in with credentials
        console.log('authorize, credentials:', credentials);
        
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const user_qry = `*[_type == "user" && email== "${credentials?.email}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        if (!user || !user.password) {
          console.error('authorize error: user not found or password invalid');
          return null;
        }

        console.log('authorize, user:', user);
        const passwordsMatch = await bcrypt.compare(credentials?.password as string, user.password);
        if (passwordsMatch) {
          return {
            id: user._id,
            role: user.role,
            ...user
          };
        }

        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  adapter: SanityAdapter(sanityClient),
  callbacks: {
    signIn: async({ user, account }) => {
      console.log('auth callbacks signIn, user:', user);
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // prevent signIn without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    
    session: async ({ session, token }) => {
      console.log('auth callbacks session, token:', token);
      // auth callbacks session, token: {
      //   name: 'hujiawei',
      //   email: 'hujiawei090807@gmail.com',
      //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIGFsJY1EBOKVtKYg4dFSJrNR7jlINTy3o_LDTSNwQn_Fc4nXpH=s96-c',
      //   sub: 'user.1d2c06f6-2bcc-4f5e-95ba-014aadfb4580',
      //   isOAuth: true,
      //   role: 'USER',
      //   iat: 1722662922,
      //   exp: 1725254922,
      //   jti: 'b748e17a-584e-4093-a628-52978275de62'
      // }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // TODO: fix type or add @ts-ignore
      // 'USER' to UserRole.USER
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.name = token.name;
        // TODO: fix type or add @ts-ignore, add ?? '' for now
        session.user.email = token.email ?? '';
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    
    jwt: async ({ token }) => {
      console.log('auth callbacks jwt, token:', token);
      // auth callbacks jwt, token: {
      //   name: 'hujiawei',
      //   email: 'hujiawei090807@gmail.com',
      //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocIGFsJY1EBOKVtKYg4dFSJrNR7jlINTy3o_LDTSNwQn_Fc4nXpH=s96-c',
      //   sub: 'user.1d2c06f6-2bcc-4f5e-95ba-014aadfb4580',
      //   isOAuth: true,
      //   role: 'USER',
      //   iat: 1722662922,
      //   exp: 1725254922,
      //   jti: 'b748e17a-584e-4093-a628-52978275de62'
      // }
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
  },
})
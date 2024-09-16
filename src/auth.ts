import { sanityClient } from "@/sanity/lib/client";
import { SanityAdapter } from "@/sanity/sanity-adapter";
import NextAuth from "next-auth";
import { getAccountByUserId } from "@/data/account";
import { getUserById } from "@/data/user";
import authConfig from "@/auth.config";
import { UserRole } from "@/types/user-role";

// https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts
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
  ...authConfig,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // https://authjs.dev/reference/core/errors#untrustedhost
  trustHost: true,
  session: { strategy: "jwt" },
  adapter: SanityAdapter(sanityClient),
  callbacks: {
    // https://authjs.dev/concepts/callbacks#signin
    signIn: async({ user, account }) => {
      // console.log('auth callbacks signIn, user:', user);
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // prevent signIn without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    
    // https://authjs.dev/concepts/session-strategies#jwt-session
    // https://authjs.dev/reference/nextjs#jwt
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in) 
    // or updated (i.e whenever a session is accessed in the client). 
    // Anything you return here will be saved in the JWT and forwarded to the session callback.
    jwt: async ({ token }) => {
      // console.log('auth callbacks jwt, token:', token);
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser._id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      // TODO(javayhu): add userPricePlan to token

      return token;
    },
    
    // https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts#L68
    // role and isOAuth are added to the token, so we can pass them to the session
    session: async ({ session, token }) => {
      // console.log('auth callbacks session, token:', token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/auth.ts#L59
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? '';
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
})

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
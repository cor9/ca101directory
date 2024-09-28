import { UserRole } from "@/types/user-role";
import NextAuth, { type DefaultSession } from "next-auth";

// https://authjs.dev/getting-started/typescript#module-augmentation
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isOAuth: boolean;
  link: string;
};

// extend session.user to include role and isOAuth
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export type User = {
  _id: string;
  name: string;
  link: string;
  email: string;
  emailVerified: string;
  image: string;
  password: string;
  role: string;
  accounts: Account[];
}

export type Account = {
  _id: string;
  _ref?: string;
  _type?: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  tokenType: string;
  scope: string;
  idToken: string;
  sessionState: string;
  user: User;
}

export type VerificationToken = {
  _id: string;
  identifier: string;
  token: string;
  expires: string;
}

export type PasswordResetToken = {
  _id: string;
  email: string;
  token: string;
  expires: string;
}

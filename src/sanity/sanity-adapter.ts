import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import type { Adapter, AdapterSession, AdapterUser, } from "@auth/core/adapters";
import { UserRole } from "@/types/auth-types";
import { User } from "@/types/next-auth";

// https://authjs.dev/reference/core/adapters
// https://authjs.dev/guides/creating-a-database-adapter
export function SanityAdapter(
  sanityClient: SanityClient,
  options = {
    schemas: {
      user: 'user',
      account: 'account',
      session: 'session',
      verificationToken: 'verificationToken',
    }
  }
): Adapter {

  return {
    // https://authjs.dev/guides/creating-a-database-adapter#methods-and-models
    async createUser(user) {
      try {
        // @sanity-typegen-ignore
        const existingUser_qry = `*[_type == "user" && email == "${user.email}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if (existingUser) return existingUser;

        const createdUser = await sanityClient.create({
          _type: options.schemas.user,
          _id: `user.${uuid()}`,
          role: UserRole.USER,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified
        });
        console.log('createUser, user:', user);

        return {
          id: createdUser._id,
          ...createdUser
        };
      } catch (error) {
        throw new Error('createUser, Failed to Create user');
      }
    },

    async getUser(id) {
      try {
        // @sanity-typegen-ignore
        const user_qry = `*[_type == "user" && _id== "${id}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error('getUser, Couldnt get the user');
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        // @sanity-typegen-ignore
        const account_qry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        // @sanity-typegen-ignore
        const user_qry = `*[_type == "user" && _id== "${account.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        console.log('getUserByAccount, user:', user);

        return {
          id: user._id,
          role: user.role,
          ...user
        };

      } catch (error) {
        throw new Error('getUserByAccount, Couldnt get the user');
      }
    },

    async updateUser(updatedUser) {
      try {
        // @sanity-typegen-ignore
        const existingUser_qry = `*[_type == "user" && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if (!existingUser) {
          throw new Error(`Could not update user: ${updatedUser.id}; unable to find user`)
        }

        const patchedUser = await sanityClient.patch(existingUser._id)
          .set({
            emailVerified: updatedUser.emailVerified === null ? undefined : updatedUser.emailVerified,
            ...existingUser
          })
          .commit();
        console.log('updateUser, user:', patchedUser);

        return patchedUser as any;
      } catch (error) {
        throw new Error('updateUser, Couldnt update the user');
      }
    },

    async deleteUser(userId) {
      try {
        return await sanityClient.delete(userId);
      } catch (error: any) {
        throw new Error('deleteUser, Could not delete user', error);
      }
    },

    // sometimes failed when a google account attempts to sign in 
    // because of userId is undefined
    async linkAccount(account) {
      try {
        console.log('linkAccount, accountId:', account.userId);
        console.log('linkAccount, account:', account);
        // Github account
        // linkAccount, account: {
        //   access_token: 'xxx',
        //   scope: 'read:user,user:email',
        //   token_type: 'bearer',
        //   providerAccountId: '1982582',
        //   provider: 'github',
        //   type: 'oauth',
        //   userId: 'user.7f3a261a-d6ea-42d8-80b9-b1e8310258c4'
        // }

        // Google account
        // linkAccount, account: {
        //   access_token: 'xxx',
        //   id_token: 'xxx',
        //   expires_at: 1722666512,
        //   scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        //   token_type: 'bearer',
        //   providerAccountId: '106050797306543125930',
        //   provider: 'google',
        //   type: 'oidc',
        //   userId: 'user.1d2c06f6-2bcc-4f5e-95ba-014aadfb4580'
        // }
        const createdAccount = await sanityClient.create({
          _type: options.schemas.account,
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          user: {
            _type: 'reference',
            _ref: account.userId
          }
        });

        const userToUpdate = await sanityClient.getDocument(account.userId);
        console.log('unlinkAccount, user:', userToUpdate);
        
        await sanityClient.createOrReplace<User>({
          ...userToUpdate,
          emailVerified: new Date().toISOString(),
          accounts: {
            //@ts-ignore
            _type: 'reference',
            _key: uuid(),
            _ref: createdAccount._id
          }
        })

        return account;
      } catch (error) {
        throw new Error('linkAccount, Error linking account');
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        // @sanity-typegen-ignore
        const account_qry = `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        const accountUser = await sanityClient.getDocument<User>(account.userId);
        console.log('unlinkAccount, user:', accountUser);

        // Filter out the user account to be deleted
        const updatedUserAccounts = (accountUser?.accounts || []).filter(
          ac => ac._ref !== account._id
        );

        // @ts-ignore
        await sanityClient.createOrReplace({
          ...accountUser,
          accounts: updatedUserAccounts,
        });

        await sanityClient.delete(account._id);
      } catch (error) {
        throw new Error('unlinkAccount, Could not Unlink account');
      }
    },

    // https://authjs.dev/guides/creating-a-database-adapter#database-session-management
    async createSession(session) {
      try {
        await sanityClient.create({
          _type: 'session',
          user: {
            _type: 'reference',
            _ref: session.userId
          },
          ...session
        })

        return session;
      } catch (error) {
        throw new Error('createSession, Error Creating Session');
      }
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
      try {
        // @sanity-typegen-ignore
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        // @sanity-typegen-ignore
        const user_qry = `*[_type == "user" && _id== "${session.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        console.log('getSessionAndUser, user:', user);

        return {
          session: session,
          user: user,
        };
      } catch (error) {
        throw new Error('getSessionAndUser, Operation Failed');
      }
    },

    async updateSession({ sessionToken }) {
      try {
        // @sanity-typegen-ignore
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        await sanityClient.patch(session._id).set({
          ...session
        }).commit();
      } catch (error) {
        throw new Error('updateSession, Operation Failed');
      }
    },

    async deleteSession(sessionToken) {
      try {
        // @sanity-typegen-ignore
        const session_qry = `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        await sanityClient.delete(session._id);
      } catch (error) {
        throw new Error('deleteSession, Operation Failed');
      }
    },

    // https://authjs.dev/guides/creating-a-database-adapter#verification-tokens
    async getUserByEmail(email) {
      try {
        // @sanity-typegen-ignore
        const user_qry = `*[_type == "user" && email== "${email}"][0]`;
        const user = await sanityClient.fetch(user_qry);
        console.log('getUserByEmail, user:', user);

        return user;
      } catch (error) {
        throw new Error('getUserByEmail, Couldnt get the user');
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      try {
        const verificationToken = await sanityClient.create({
          _type: options.schemas.verificationToken,
          identifier,
          token,
          expires
        });

        return verificationToken;
      } catch (error) {
        throw new Error('createVerificationToken, Couldnt create verification token');
      }
    },

    async useVerificationToken({ identifier, token }) {
      try {
        // @sanity-typegen-ignore
        const verToken_qry = `*[_type == "verificationToken" && identifier == "${identifier}" && token == "${token}"][0]`;
        const verToken = await sanityClient.fetch(verToken_qry);

        if (!verToken) return null;

        await sanityClient.delete(verToken._id);

        return {
          id: verToken._id,
          ...verToken
        };
      } catch (error) {
        throw new Error('useVerificationToken, Couldnt delete verification token');
      }
    },
  }
}

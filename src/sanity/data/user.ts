import { sanityClient } from "@/sanity/lib/client";

export const getUserByEmail = async (email: string) => {
    try {
        // Fetch user by email
        const userQry = `*[_type == "user" && email == "${email}"][0]`;
        const user = await sanityClient.fetch(userQry);
        console.log('getUserByEmail, user:', user);

        return user;
    } catch {
        return null;
    }
}

export const getUserById = async (_id: string) => {
    try {
        // Fetch user by ID
        const userQry = `*[_type == "user" && _id == "${_id}"][0]`;
        const user = await sanityClient.fetch(userQry);
        console.log('getUserById, user:', user);
        // getUserById, user: {
        //     name: 'hujiawei',
        //     _id: 'user.1d2c06f6-2bcc-4f5e-95ba-014aadfb4580',
        //     _updatedAt: '2024-08-03T05:28:40Z',
        //     image: 'https://lh3.googleusercontent.com/a/ACg8ocIGFsJY1EBOKVtKYg4dFSJrNR7jlINTy3o_LDTSNwQn_Fc4nXpH=s96-c',
        //     _createdAt: '2024-08-03T05:28:36Z',
        //     _type: 'user',
        //     accounts: {
        //       _ref: 'CZnPCJFeW1IiYXKDMiRDja',
        //       _type: 'reference',
        //       _key: 'e8126c0b-2e98-4e6c-a968-0efe950a4dea'
        //     },
        //     email: 'hujiawei090807@gmail.com',
        //     emailVerified: '2024-08-03T05:28:39.936Z',
        //     role: 'USER',
        //     _rev: 'uSG6j0nzFMARMpT3a2WEU8'
        //   }
        return user;
    } catch {
        return null;
    }
}
import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { User, UserWithAccountsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { userWithAccountsQuery } from "@/sanity/lib/queries";

export const getUserByEmail = async (email: string) => {
    try {
        // @sanity-typegen-ignore
        const userQry = `*[_type == "user" && email == "${email}"][0]`;
        const user = await sanityFetch<User>({ query: userQry, disableCache: true });
        if (SHOW_QUERY_LOGS) {
            console.log('getUserByEmail, user:', user);
        }
        return user;
    } catch (error) {
        console.error('getUserByEmail, error:', error);
        return null;
    }
}

export const getUserById = async (_id: string) => {
    try {
        // @sanity-typegen-ignore
        const userQry = `*[_type == "user" && _id == "${_id}"][0]`;
        const user = await sanityFetch<User>({ query: userQry, disableCache: true });
        if (SHOW_QUERY_LOGS) {
            console.log('getUserById, user:', user);
        }
        return user;
    } catch (error) {
        console.error('getUserById, error:', error);
        return null;
    }
}

export const getUserByIdWithAccounts = async (_id: string) => {
    try {
        // @sanity-typegen-ignore
        // const userQry = `*[_type == "user" && _id == "${_id}"][0] {
        //     accounts[]->,
        // }`;
        // const user = await sanityFetch<User>({ query: userQry, disableCache: true });

        const user = await sanityFetch<UserWithAccountsQueryResult>({
            query: userWithAccountsQuery,
            params: { id: _id },
            disableCache: true
        });
        if (SHOW_QUERY_LOGS) {
            console.log('getUserByIdWithAccounts, user:', user);
        }
        return user;
    } catch (error) {
        console.error('getUserByIdWithAccounts, error:', error);
        return null;
    }
}
import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Account } from "next-auth";

export const getAccountByUserId = async (userId: string) => {
    try {
        // @sanity-typegen-ignore
        const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
        const account = await sanityFetch<Account>({ query: accountQry, disableCache: true });
        if (SHOW_QUERY_LOGS) {
            console.log('getAccountByUserId, account:', account);
        }
        return account;
    } catch (error) {
        console.error('getAccountByUserId, error:', error);
        return null;
    }
}
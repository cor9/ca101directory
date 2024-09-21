import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { sanityClient } from "@/sanity/lib/client";

export const getAccountByUserId = async (userId: string) => {
    try {
        // @sanity-typegen-ignore
        const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
        const account = await sanityClient.fetch(accountQry);
        if (SHOW_QUERY_LOGS) {
            console.log('getAccountByUserId, account:', account);
        }

        return account;
    } catch (error) {
        console.error('getAccountByUserId, error:', error);
        return null;
    }
}
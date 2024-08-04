import { sanityClient } from "@/sanity/lib/client";

export const getAccountByUserId = async (userId: string) => {
    try {
        // @sanity-typegen-ignore
        const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
        const account = await sanityClient.fetch(accountQry);
        console.log('getAccountByUserId, account:', account);

        return account;
    } catch {
        return null;
    }
}
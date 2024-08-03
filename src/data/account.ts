import sanityClient from "@/lib/sanityClient";

export const getAccountByUserId = async (userId: string) => {
    try {
        // Fetch user by ID
        const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
        const account = await sanityClient.fetch(accountQry);
        console.log('getAccountByUserId, account:', account);

        return account;
    } catch {
        return null;
    }
}
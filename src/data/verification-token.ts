import { SHOW_QUERY_LOGS } from "@/lib/constants";
import { VerificationToken } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";

export const getVerificationTokenByEmail = async ( email: string ) => {
    try {
        // @sanity-typegen-ignore
        const verTokenQry = `*[_type == "verificationToken" && identifier == "${email}"][0]`;
        const verToken = await sanityFetch<VerificationToken>({ query: verTokenQry, disableCache: true });
        if (SHOW_QUERY_LOGS) {
            console.log('getVerificationTokenByEmail, verToken:', verToken);
        }
        return verToken;
    } catch (error) {
        console.error('getVerificationTokenByEmail, error:', error);
        return null;
    }
}

export const getVerificationTokenByToken = async ( token: string ) => {
    try {
        // @sanity-typegen-ignore
        const verTokenQry = `*[_type == "verificationToken" && token == "${token}"][0]`;
        const verToken = await sanityFetch<VerificationToken>({ query: verTokenQry, disableCache: true });
        if (SHOW_QUERY_LOGS) {
            console.log('getVerificationTokenByToken, verToken:', verToken);
        }
        return verToken;
    } catch (error) {
        console.error('getVerificationTokenByToken, error:', error);
        return null;
    }
}
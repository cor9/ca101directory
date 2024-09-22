import { sanityClient } from "@/sanity/lib/client";

export const getVerificationTokenByEmail = async ( email: string ) => {
    try {
        // @sanity-typegen-ignore
        const verTokenQry = `*[_type == "verificationToken" && identifier == "${email}"][0]`;
        const verToken = await sanityClient.fetch(verTokenQry, {}, {
            useCdn: false,
            next: { revalidate: 0 },
        });
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
        const verToken = await sanityClient.fetch(verTokenQry, {}, {
            useCdn: false,
            next: { revalidate: 0 },
        });
        return verToken;
    } catch (error) {
        console.error('getVerificationTokenByToken, error:', error);
        return null;
    }
}
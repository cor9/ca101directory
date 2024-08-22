import { sanityClient } from "@/sanity/lib/client";

export const getPasswordResetTokenByEmail = async ( email: string ) => {
    try {
        // @sanity-typegen-ignore
        const passResetTokenQry = `*[_type == "passwordResetToken" && identifier == "${email}"][0]`;
        const passResetToken = await sanityClient.fetch(passResetTokenQry);

        return passResetToken;
    } catch (error) {
        console.error('getPasswordResetTokenByEmail, error:', error);
        return null;
    }
}

export const getPasswordResetTokenByToken = async ( token: string ) => {
    try {
        // @sanity-typegen-ignore
        const passResetTokenQry = `*[_type == "passwordResetToken" && token == "${token}"][0]`;
        const passResetToken = await sanityClient.fetch(passResetTokenQry);

        return passResetToken;
    } catch (error) {
        console.error('getPasswordResetTokenByToken, error:', error);
        return null;
    }
}
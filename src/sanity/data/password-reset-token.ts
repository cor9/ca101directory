import { sanityClient } from "@/sanity/lib/client";

export const getPasswordResetTokenByEmail = async ( email: string ) => {
    try {
        const passResetTokenQry = `*[_type == "passwordResetToken" && identifier == "${email}"][0]`;
        const passResetToken = await sanityClient.fetch(passResetTokenQry);

        return passResetToken;
    } catch (error) {
        return null
    }
}

export const getPasswordResetTokenByToken = async ( token: string ) => {
    try {
        const passResetTokenQry = `*[_type == "passwordResetToken" && token == "${token}"][0]`;
        const passResetToken = await sanityClient.fetch(passResetTokenQry);

        return passResetToken;
    } catch (error) {
        return null
    }
}
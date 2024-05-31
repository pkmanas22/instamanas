"use server"
import db from "./db";

export const chechExistingUser = async (email: string | null | undefined) => {
    if (!email) {
        return null;
    }

    const user = await db.user.findUnique({
        where: {
            email,
        }
    })

    return user;
}
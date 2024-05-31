import { NextRequest, NextResponse } from "next/server";
import { chechExistingUser } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
    try {
        const { email } = await req.json();

        const existingUser = await chechExistingUser(email);
        if (!existingUser) {
            return NextResponse.json({
                msg: 'User not exist'
            });
        }
        console.log(existingUser)

        return NextResponse.json({
            user: existingUser
        });
    } catch (error) {
        console.error('Error checking user:', error);
        return NextResponse.json(
            { error: 'An error occurred while checking the user.' },
            { status: 500 }
        );
    }
};

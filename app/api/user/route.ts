import { NextRequest, NextResponse } from "next/server";
import { chechExistingUser } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.redirect(new URL('/api/auth/signin', req.url));
        }
        const existingUser = await chechExistingUser(email);
        
        if (!existingUser) {
            return NextResponse.json({
                msg: 'User does not exist'
            }, { status: 404 });
        }

        return NextResponse.json({
            user: existingUser
        }, { status: 200 });
    } catch (error) {
        console.error('Error checking user:', error);
        return NextResponse.json(
            { error: 'An error occurred while checking the user.' },
            { status: 500 }
        );
    }
};

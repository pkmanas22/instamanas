import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { chechExistingUser } from "@/lib/utils";

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, password, authType, avatar, username } = await req.json();

        const existingUser = await chechExistingUser(email);

        if (existingUser?.id) {
            return NextResponse.json({
                msg: `${existingUser.email} is already registered with us. Kindly login with ${existingUser.authType}`
            });
        }

        const existingUsername = await db.user.findUnique({
            where: { username },
        })

        if (existingUsername?.username) {
            return NextResponse.json({
                msg: `${existingUsername?.username} is already taken. Please choose a different username.`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                username,
                name,
                email,
                hashedPassword,
                avatar,
                authType: authType === 'facebook' ? 'Facebook' : 'Github',
                createdAt: new Date(),
            },
        });

        return NextResponse.json({ id: user.id });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating the user.' },
            { status: 500 }
        );
    }
};

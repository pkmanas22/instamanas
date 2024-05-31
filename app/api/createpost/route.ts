import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { postType, contentUrl, caption, userId } = await req.json();

        const post = await db.post.create({
            data: {
                postType: postType === 'image' ? 'Photo' : 'Video',
                contentUrl,
                caption,
                userId,
                createdAt: new Date()
            }
        });
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating the new post.' },
            { status: 500 }
        );
    }
};

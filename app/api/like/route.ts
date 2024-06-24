import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { postId, userId, action } = await req.json();

        // Check if the like already exists
        const existingLike = await db.like.findFirst({
            where: {
                postId,
                userId,
            },
        });

        if (action === 'like') {
            if (existingLike) {
                return NextResponse.json(
                    { msg: 'Post already liked' },
                    { status: 200 }
                );
            }

            // Create a new like
            const like = await db.like.create({
                data: {
                    postId,
                    userId,
                    createdAt: new Date(),
                },
            });

            return NextResponse.json(
                { msg: 'Post liked', like },
                { status: 201 }
            );
        } else if (action === 'dislike') {
            // Remove the like if it exists
            if (existingLike) {
                await db.like.delete({
                    where: {
                        id: existingLike.id,
                    },
                });
                return NextResponse.json(
                    { msg: 'Post disliked' },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { msg: 'Post not liked yet' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An error occurred while processing the request.' },
            { status: 500 }
        );
    }
};

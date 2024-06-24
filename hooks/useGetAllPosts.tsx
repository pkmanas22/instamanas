"use server"
import db from "@/lib/db";

export default async function UseAllPostsHook() {
    const allPosts = await db.post.findMany({
        select: {
            postType: true,
            caption: true,
            contentUrl: true,
            id: true,
            createdAt: true,
            likes: {
                select: {
                    userId: true,
                },
            },
            User: {
                select: {
                    name: true,
                    username: true,
                    avatar: true,
                }
            }   
        },
        orderBy: [
            { createdAt: 'desc' }
        ]
    });
    return allPosts || [];
}
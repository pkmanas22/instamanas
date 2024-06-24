"use client";
import UseAllPostsHook from '@/hooks/useGetAllPosts';
import React, { useEffect, useState } from 'react';
import { chechExistingUser } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import PostFormatCard from './postFormatCard';

export type postsType = {
    id: string;
    postType: string;
    contentUrl: string;
    caption: string | null;
    createdAt: Date;
    likes: {
        userId: string | null;
    }[];
    User: {
        username: string;
        name: string;
        avatar: string | null;
    };
};

export default function AllPosts() {
    const [allPosts, setAllPosts] = useState<postsType[]>([]);
    const { data: sessionData, status: sessionStatus } = useSession();
    const [userId, setUserId] = useState<string>('');
    const [likedPost, setLikedPost] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchPosts() {
            const res = await UseAllPostsHook();
            const posts = await res;
            setAllPosts(posts);

            // Initialize liked posts set based on fetched data
            if (userId) {
                const likedPostsSet = new Set(
                    posts.filter(post => post.likes.some(like => like.userId === userId)).map(post => post.id)
                );
                setLikedPost(likedPostsSet);
            }
        }

        fetchPosts();
    }, [userId]);

    useEffect(() => {
        if (sessionData?.user?.email) {
            chechExistingUser(sessionData.user.email).then(user => {
                if (user?.id) {
                    setUserId(user.id);
                }
            });
        }
    }, [sessionData]);

    const handleLikeUpdate = (postId: string, action: 'like' | 'dislike') => {
        setAllPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? {
                    ...post,
                    likes: action === 'like' ?
                        [...post.likes, { userId }] :
                        post.likes.filter(like => like.userId !== userId)
                } : post
            )
        );
    };

    return (
        <div>
            {allPosts.map((post) => (
                <PostFormatCard
                    key={post.id}
                    post={post}
                    userId={userId}
                    likedPost={likedPost}
                    setLikedPost={setLikedPost}
                    likesCount={post.likes.length}
                    handleLikeUpdate={handleLikeUpdate}
                />
            ))}
        </div>
    );
}

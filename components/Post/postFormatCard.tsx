import React from 'react';
import { postsType } from './allPosts';
import { Card } from '../card';
import Image from 'next/image';
import { GeneratePostCaption } from '../generatePostCaption';
import { CommentSvg, LikeSvg, SaveSvg, ShareSvg, DislikeSvg } from '../svgIcons';

type PostFormatCardProps = {
    post: postsType;
    userId: string;
    likedPost: Set<string>;
    setLikedPost: React.Dispatch<React.SetStateAction<Set<string>>>;
    likesCount: number;
    handleLikeUpdate: (postId: string, action: 'like' | 'dislike') => void;
};

export default function PostFormatCard({ post, userId, likedPost, setLikedPost, likesCount, handleLikeUpdate }: PostFormatCardProps) {

    const handleLikeClick = async (postId: string) => {
        try {
            const action = likedPost.has(postId) ? 'dislike' : 'like';
            const res = await fetch('/api/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, action }),
            });

            const result = await res.json();

            if (res.ok) {
                setLikedPost((prev) => {
                    const newSet = new Set(prev);
                    if (action === "like") {
                        newSet.add(postId);
                    } else {
                        newSet.delete(postId);
                    }
                    return newSet;
                });

                // Call the handleLikeUpdate function to update likes count in the parent component
                handleLikeUpdate(postId, action);
            } else {
                alert(result.error || result.msg);
            }
        } catch (error) {
            console.error('An error occurred during the like/dislike action: ', error);
        }
    };

    return (
        <div>
            <div className='mt-5'>
                <Card>
                    <div className='flex items-center gap-2'>
                        <Image src={post.User.avatar || "https://instamanas.s3.ap-south-1.amazonaws.com/default-avatar.jpg"} alt="" width={30} height={30} className='rounded-full' />
                        <div>
                            <span className='italic font-semibold mr-1'>{post.User.username}</span>
                            <span className='text-gray-300'> | {postedAgo(post.createdAt)}</span>
                        </div>
                    </div>
                    <div className='my-3'>
                        {post.postType === 'Photo' ? (
                            <Image src={post.contentUrl} alt="profile" width={330} height={0} className='rounded-md m-auto w-[95%] max-h-[80vh]' />
                        ) : (
                            post.contentUrl
                        )}
                    </div>
                    <div>
                        <span className='italic font-semibold mr-2'>{post.User.name}</span>
                        <GeneratePostCaption caption={post.caption} />
                    </div>
                    <div className='flex justify-between p-1'>
                        <div className='flex gap-2'>
                            <div className='cursor-pointer' onClick={() => handleLikeClick(post.id)}>
                                {likedPost.has(post.id) ? <DislikeSvg /> : <LikeSvg />}
                            </div>
                            <div className='cursor-pointer' onClick={() => alert("Under development")}>
                                <CommentSvg />
                            </div>
                            <div className='cursor-pointer' onClick={() => alert("Under development")}>
                                <ShareSvg />
                            </div>
                        </div>
                        <div className='cursor-pointer' onClick={() => alert("Under development")}>
                            <SaveSvg />
                        </div>
                    </div>
                    <div className='text-gray-300'>
                        {likesCount} likes
                    </div>
                </Card>
            </div>
        </div>
    );
}

function postedAgo(createdAt: Date) {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    if (days) {
        return `${days}d`;
    } else if (hours) {
        return `${hours}h`;
    } else if (minutes) {
        return `${minutes}m`;
    } else if (seconds) {
        return `${seconds}s`;
    }
}

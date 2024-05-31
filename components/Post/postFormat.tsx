"use client"
import UseAllPostsHook from '@/hooks/useGetAllPosts';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Card } from '../card';
import { GeneratePostCaption } from '../generatePostCaption';

type postsType = {
  id: string;
  postType: string;
  contentUrl: string;
  caption: string | null;
  createdAt: Date;
  User: {
    username: string;
    name: string;
    avatar: string | null;
  };
}[];

export default function PostFormat() {
  const [allPosts, setAllPosts] = useState<postsType>([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = UseAllPostsHook();
      res.then((posts) => {
        setAllPosts(posts);
      })
    }
    fetchPosts();
  }, [])

  return (
    <div>
      {allPosts.map((post) => (
        <div key={post.id} className='mt-5'>
          <Card>
            <div className='flex items-center gap-2'>
              <Image src={post.User.avatar || "https://instamanas.s3.ap-south-1.amazonaws.com/default-avatar.jpg"} alt="" width={30} height={30} className='rounded-full' />
              <div className=''>
                <span className='italic font-semibold mr-1'>{post.User.username}</span>
                <span className='text-gray-300'> | {postedAgo(post.createdAt)}</span>
              </div>
            </div>
            <div className='my-3'>
              {post.postType === 'Photo' ?
                <Image src={post.contentUrl} alt="profile" width={330} height={0} className='rounded-md m-auto w-[95%] max-h-[80vh]' />
                : post.contentUrl}
            </div>
            <div className=''>
              <span className='italic font-semibold mr-2'>{post.User.name}</span>
              <GeneratePostCaption caption={post.caption} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
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
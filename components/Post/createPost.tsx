"use client"
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '../card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../button';
import { chechExistingUser } from '@/lib/utils';
import { ImageSvg, VideoSvg } from '../svgIcons';

export default function CreatePost() {
    const { data: sessionData, status: sessionStatus } = useSession();
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [userId, setUserId] = useState<string>('');
    const [caption, setCaption] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        if (textareaRef.current) {
            autoResize(textareaRef.current);
        }
    }, []);

    useEffect(() => {
        if (sessionData?.user?.email) {
            chechExistingUser(sessionData.user.email).then(user => {
                if (user?.id) {
                    setUserId(user.id);
                }
            });
        }
    }, [sessionData, router]);

    if (sessionStatus === 'loading') {
        return <div>Loading</div>;
    }

    const autoResize = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        autoResize(event.currentTarget);
    };

    const handleNewPost = async () => {
        if (!file) {
            alert("Image is required");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", userId);
            const fileRes = await fetch('/api/s3-upload', {
                method: 'POST',
                body: formData,
            });

            const fileData = await fileRes.json();

            if (fileData.redirect) {
                router.push('/api/auth/signin');
            }

            if (!fileData.success) {
                alert(fileData.error);
                setUploading(false);
                return;
            }

            const bodydata = {
                postType: 'image',
                contentUrl: fileData.fileName,
                caption,
                userId
            };

            const res = await fetch('/api/createpost', {
                method: 'POST',
                body: JSON.stringify(bodydata),
            });
            const resData = await res.json();

            if (resData.id) {
                setUploading(false);
                await location.reload();
            }
        } catch (error) {
            console.error("Creating post error ", error);
            alert("Something went wrong");
            setUploading(false);
        }
    };

    return (
        <Card>
            <div className='flex gap-2'>
                <div>
                    {sessionData?.user && (
                        <Image src={sessionData.user.image || 'https://instamanas.s3.ap-south-1.amazonaws.com/default-avatar.jpg'} alt="" width={40} height={40} className='rounded-full' />
                    )}
                </div>
                <div className='w-full'>
                    <textarea
                        ref={textareaRef}
                        name=""
                        id=""
                        autoComplete='true'
                        maxLength={300}
                        placeholder="What's happening?!"
                        className='w-full bg-black outline-none p-1 text-lg resize-none'
                        onInput={handleInput}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                    <div className='text-red-700 text-sm border-t-2 border-slate-600 pt-1 mt-2'>(Maximum 300 characters. Image is mandatory)</div>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-4'>
                            <div className='flex items-center '>
                                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} name="" accept='image/png, image/jpeg, image/gif' id="imageFile" className='hidden' />
                                <label htmlFor="imageFile" className='cursor-pointer'>
                                    <ImageSvg />
                                </label>
                            </div>
                            <div onClick={() => {
                                alert("This feature will coming soon")
                            }} className='flex items-center cursor-pointer'>
                                <VideoSvg />
                            </div>
                        </div>
                        <div>
                            <Button isDisabled={!file || uploading} onclick={handleNewPost}>Post</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

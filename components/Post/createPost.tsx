"use client"
import React, { useRef, useEffect, useState } from 'react'
import { Card } from '../card'
import { session } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../button';
import { chechExistingUser } from '@/lib/utils';

export default function CreatePost() {
    const { data, status }: { data: session, status: string } = useSession();
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [userId, setUserId] = useState('');
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (textareaRef.current) {
            autoResize(textareaRef.current);
        }
    }, []);

    useEffect(() => {
        if (data?.user?.email) {
            chechExistingUser(data.user.email).then(user => {
                setUserId(user?.id);
                if (!user?.email) {
                    router.push('/api/auth/signin');
                }
            });
        }
    }, [data, router]);

    if (status === 'loading') {
        return <div>Loading</div>;
    }

    const autoResize = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        autoResize(event.currentTarget);
    };

    const handleNewPost = async () => {
        if (!file) {
            alert("Image is required")
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", userId)
            const fileRes = await fetch('/api/s3-upload', {
                method: 'POST',
                body: formData,
            });

            const fileData = await fileRes.json();

            if (!fileData.success) {
                alert(fileData.error)
                return;
            }

            const bodydata = {
                postType: 'image',
                contentUrl: fileData.fileName,
                caption,
                userId
            }
            // Handle successful form submission
            const res = await fetch('/api/createpost', {
                method: 'POST',
                body: JSON.stringify(bodydata)
            })
            const resData = await res.json();

            if (resData.id) {
                setUploading(false);
                await location.reload();
            }
        } catch (error) {
            console.error("Creating post error ", error)
            alert("Something happening right now")
            setUploading(false);
        }
    }

    return (
        <Card>
            <div className='flex gap-2'>
                <div>
                    <Image src={data.user.image || ""} alt="profile image" width={40} height={40} className='rounded-full' />
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
                            <div onClick={() => {
                                // alert("This feature coming soon")
                            }} className='flex items-center '>
                                <input type="file" onChange={(e) => setFile(e.target.files[0]) || null} name="" accept='image/png, image/jpeg, image/gif' id="imageFile" className='hidden' />
                                <label htmlFor="imageFile" className='cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path className='fill-slate-400' d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" /></svg>
                                </label>
                            </div>
                            <div onClick={() => {
                                alert("This feature coming soon")
                            }} className='flex items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='w-6 h-6'><path className='fill-slate-400' d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" /></svg>
                            </div>
                        </div>
                        <div>
                            <Button isDisabled={(!file || uploading)} onclick={handleNewPost}>Post</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

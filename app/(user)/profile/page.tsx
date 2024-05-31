"use client"
import { Card } from '@/components/card'
import { InputField } from '@/components/inputField'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { chechExistingUser } from '@/lib/utils'

type Profile = {
    username: string;
    email: string;
    name: string;
    authType: string;
    avatar: string;
}

export default function Page() {
    const { data: data, status: sessionStatus } = useSession();
    const [profile, setProfile] = useState<Profile>({
        username: '',
        email: '',
        name: '',
        authType: '',
        avatar: ''
    });

    useEffect(() => {
        if (data?.user?.email) {
            chechExistingUser(data.user.email).then(value => {
                if (value) {
                    setProfile({
                        username: value.username,
                        email: value.email,
                        name: value.name,
                        authType: value.authType,
                        avatar: value.avatar || 'https://instamanas.s3.ap-south-1.amazonaws.com/default-avatar.jpg'
                    });
                }
            });
        }
    }, [data]);

    if (sessionStatus === 'loading') {
        return <div>Loading...</div>;
    }

    const profileFields: (keyof Profile)[] = ['email', 'username', 'name', 'authType'];

    return (
        <Card>
            <div className='grid grid-cols-1 md:grid-cols-3'>
                <Card classes='md:col-span-2 md:order-first'>
                    {profileFields.map(field => (
                        <InputField
                            key={field}
                            id={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            type={field === 'email' ? 'email' : 'text'}
                            value={profile[field]}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            isDisable={true}
                            onChange={() => { }}
                        />
                    ))}
                </Card>
                <div className='flex justify-center items-center p-3 order-first'>
                    <Image src={profile.avatar} alt="" width={200} height={200} className='rounded-full' />
                </div>
            </div>
        </Card>
    );
}

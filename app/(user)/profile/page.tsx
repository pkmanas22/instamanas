"use client"
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { InputField } from '@/components/inputField'
import { session } from '@/lib/auth'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { chechExistingUser } from '@/lib/utils'

export default function Page() {
    const { data }: { data: session } = useSession();
    const [profile, setProfile] = useState({
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
                        avatar: value.avatar || ''
                    });
                }
            });
        }
    }, [data]);

    if (!data?.user) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <div className='grid grid-cols-1 md:grid-cols-3'>
                <Card classes='md:col-span-2 md:order-first'>
                    {['email', 'username', 'name', 'authType'].map(field => (
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
                    <Image src={profile.avatar} alt="profile image" width={200} height={200} className='rounded-full' />
                </div>
            </div>
        </Card>
    );
}

"use client"
import { authOptions } from '@/lib/auth'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function Appbar() {
    const { data } = useSession(authOptions);

    return (
        <div className='h-[50px] flex justify-between items-center px-7 py-2 bg-slate-800 '>
            <div className='text-2xl font-bold italic'>
                InstaManas
            </div>
            <div>
                {data?.user ? <div className='flex gap-3 items-center'>
                    <div className='text-white'>Welcome, {data.user.name?.split(" ")[0]}</div>
                    <button className='bg-blue-500 text-white px-3 py-1 rounded-md' onClick={async () => {
                        await signOut();
                    }}>Logout</button>
                </div> : <button className='bg-blue-500 text-white px-3 py-1 rounded-md' onClick={async () => {
                    await signIn();
                }}>Signin</button>}

            </div>
        </div>
    )
}

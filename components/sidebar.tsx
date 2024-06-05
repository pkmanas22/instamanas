"use client"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type listType = {
    label: string,
    href: string,
    svgIcon: React.ReactNode
}[]

export default function Sidebar({ listItems }: {
    listItems: listType
}) {
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    function toggle() {
        setSidebarOpen((isSidebarOpen) => !isSidebarOpen)
    }

    if (!isSidebarOpen) {
        return (
            <div onClick={toggle} className='m-3 fixed cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' viewBox="0 0 448 512"><path className='fill-white' d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>
        )
    }

    return (
        <div className={`w-[250px] h-screen fixed bg-slate-800 ${isSidebarOpen ? 'block' : 'hidden'}`}>
            <div
                className="absolute top-2 right-2 text-2xl font-semibold cursor-pointer bg-slate-50 text-slate-800 px-2 rounded-full"
                onClick={toggle}
            >X</div>
            <div className='font-bold text-3xl italic text-center mt-5'>
                InstaManas
            </div>
            <ul className='flex flex-col justify-center h-screen'>
                {listItems.map((list, index) => (
                    <li key={index} className='p-2 bg-gray-600 mx-3 my-1 rounded-md flex items-center border-r-8 cursor-pointer' onClick={() => {
                        router.push(list.href)
                    }}>
                        <div className='mr-2'>
                            {list.svgIcon}
                        </div>
                        <div>
                            {list.label}
                        </div>
                    </li>
                ))}
            </ul>
            <div className='absolute bottom-2 right-2 px-2 py-1 bg-gray-600 mx-3 my-1 rounded-md items-center cursor-pointer flex' onClick={async () => {
                await signOut()
            }}>
                <div className='mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512"><path  d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg>
                </div>
                <div>
                    Logout
                </div>
            </div>
        </div>
    )
}

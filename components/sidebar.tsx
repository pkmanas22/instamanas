"use client"
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LogoutSvg, MenuBarSvg } from './svgIcons'

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
                <MenuBarSvg />
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
                    <LogoutSvg />
                </div>
                <div>
                    Logout
                </div>
            </div>
        </div>
    )
}

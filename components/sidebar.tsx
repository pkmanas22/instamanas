"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type listType = {
    icon?: string,
    label: string,
    href: string,
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
            <div onClick={toggle} className='fixed cursor-pointer'>
                Menu
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
                        <div>
                            {/* icon */}
                        </div>
                        <div>
                            {list.label}
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    )
}

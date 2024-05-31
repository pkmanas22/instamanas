"use client"
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

        </div>
    )
}

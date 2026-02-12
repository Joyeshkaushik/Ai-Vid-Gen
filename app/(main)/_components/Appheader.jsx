"use client"
import { useAuthContext } from '@/app/provider'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import Image from 'next/image'

function Appheader() {
    const{user}=useAuthContext();
     const avatar =
    typeof user?.photoURL === "string" && user.photoURL.trim() !== ""
      ? user.photoURL
      : null
  return (
    <div className='p-3 flex justify-between items-center'>
        <SidebarTrigger/>
          {avatar && (
        <Image src={user?.photoURL||null} alt='user' width={40} height={40}
        className='rounded-full'/>
         )}

    </div>
  )
}

export default Appheader
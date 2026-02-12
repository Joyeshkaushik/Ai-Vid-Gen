"use client"
import React, { useEffect } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import Appheader from './_components/Appheader'
import { useAuthContext } from '../provider'
import { useRouter } from 'next/navigation'
function DashboardProvider({children}) {
    const{user}=useAuthContext();
    const router=useRouter();
    useEffect(()=>{
         user&&CheckedUserAuthenticated();
    },[user]);
    const CheckedUserAuthenticated=()=>{
        if(!user){
           router.replace('/');
        }
    }

    
  return (
     <SidebarProvider>
        <AppSidebar/>
    <div className='w-full'>
        <Appheader/>
        <div className='p-10'>
        {children}</div>
        </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
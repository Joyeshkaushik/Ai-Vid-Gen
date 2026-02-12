import React from 'react'
import Image from 'next/image'
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { Gem, HomeIcon, LucideFileVideo, Search, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/app/provider'

const MenuItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: 'Create New Video',
    url: '/create-new-video',
    icon: LucideFileVideo,
  },
  {
    title: 'Explore',
    url: '/Explore',
    icon: Search,
  },
  {
    title: 'Billing',
    url: '/Billing',
    icon: WalletCards,
  },
]

function AppSidebar() {
    const path=usePathname();
    const {user}=useAuthContext();
    console.log(path)
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center mt-5">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
            <h2 className="font-bold text-2xl">Video Gen</h2>
          </div>
          <h2 className="text-lg text-gray-400 text-center mt-3">
            AI Short Video Generator
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="mx-3 mt-10">
              <Link href={'/create-new-video'}>
              <Button className="w-full" variant="white">
                + Create New Video
              </Button>
              </Link>
            </div>

            <SidebarMenu>
              {MenuItems.map((menu) => (
                <SidebarMenuItem key={menu.url} className="mt-3 mx-3">
                  <SidebarMenuButton isActive={path===menu.url} asChild className="p-5">
                    <Link href={menu.url} className="flex items-center gap-2 p-3">
                      <menu.icon className="h-4 w-4" />
                      <span>{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className='p-5 border rounded-lg justify-between mb-6 bg-gray-800'>
            <div className='flex items-center justify-between'>
                <Gem className='text-gray-400'/>
                <h2 className='text-gray-400'>
                    {user?.credits} Credits Left
                </h2>
            </div>
            <Link href="/Billing">
            <Button className="w-full mt-3" variant="white">Buy More Credits</Button>
            </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar

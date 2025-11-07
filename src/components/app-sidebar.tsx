"use client"

import * as React from "react"
import { IconUsers } from "@tabler/icons-react"

import { NavMain } from "@/src/components/nav-main"
import { NavUser } from "@/src/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu, SidebarMenuItem
} from "@/src/components/ui/sidebar"
import { Logo } from "./ui/logo"

const data = {
  user: {
    name: "Desafio Varos",
    email: "desafio@varos.com.br",
    avatar: "https://github.com/wedz0ff.png",
  },
  navMain: [
    {
      title: "Usuários",
      url: "#",
      icon: IconUsers,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center w-full py-2">
              <Logo />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

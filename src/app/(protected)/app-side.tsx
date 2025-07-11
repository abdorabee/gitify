"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboardIcon, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const items =[
    {
        title:"Dashboard",
        url:"/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title:"Q&A",
        url:"/qa",
        icon: Bot
    },
    {
        title:"Meetings",
        url:"/meetings",
        icon: Presentation
    },
    {
        title:"Billing",
        url:"/billing",
        icon: CreditCard
    }
]
export function AppSidebar(){
    const pathname = usePathname();
    return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        Logo
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-md', 
                        {'bg-primary text-white': pathname === item.url}
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
   );
}
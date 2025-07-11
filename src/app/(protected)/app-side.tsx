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
const projects = [
    {
        title:"Project 1",
    },
    {
        title:"Project 2",
    },
    {
        title: 'Project 3'
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
        <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                      {
                        projects.map(project =>{
                            return(
                                <SidebarMenuButton key={project.title}>
                                    <SidebarMenuButton asChild>
                                     <div>
                                        <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                            {'bg-primary text-white': true}
                                        )}>
                                          {project.title[0]}  
                                        </div>
                                        <span>{project.title}</span>
                                     </div>
                                    </SidebarMenuButton>
                                </SidebarMenuButton>
                            )
                        })
                      }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
   );
}
"use client";

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboardIcon, Plus, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useProject from "@/hooks/use-project";

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
    const {open}= useSidebar();
    const {projects,project,projectId,setProjectId} = useProject();
    return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
         <Image src='/logo.png' alt='logo' width={40} height={40}/>
         {open &&(<h1 className="text-xl font-bold text-primary">Gitify</h1>)}
        </div>
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
                        projects?.map(project =>{
                            return(
                                <SidebarMenuButton key={project.name}>
                                    <SidebarMenuButton asChild>
                                     <div>
                                        <div className={cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                            {'bg-primary text-white': project.id === projectId}
                                        )}>
                                          {project.name[0]}  
                                        </div>
                                        <span>{project.name}</span>
                                     </div>
                                    </SidebarMenuButton>
                                </SidebarMenuButton>
                            )
                        })
                      }
                      <div className="h-2"></div>
                      <SidebarContent>
                        <Link href='/create'>
                        <Button size='sm' variant="outline">
                            <Plus/>
                            Create Project
                        </Button>
                        </Link>
                      </SidebarContent>
                        
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
   );
}
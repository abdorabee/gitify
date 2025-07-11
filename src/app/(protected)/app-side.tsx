import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { Bot, LayoutDashboardIcon } from "lucide-react";


const items =[
    {
        title:"Dashboard",
        href:"/dashboard",
        icon: LayoutDashboardIcon
    },
    {
        title:"Q&A",
        href:"/qa",
        icon: Bot
    },
]
export function AppSidebar(){
    return(
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
                    
                </SidebarGroupContent>
            </SidebarGroup>
           </SidebarContent>
        </Sidebar>
    )
}
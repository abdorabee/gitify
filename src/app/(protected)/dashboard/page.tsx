'use client';
import React from "react";
import Link from "next/link";
import useProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";

const Dashboard = () => {
    const {project} = useProject();
    
    if (!project) {
        return (
            <div className="p-6">
                <p className="text-gray-500">No project selected. Please select a project first.</p>
            </div>
        );
    }

    return(
       <div className="p-6">
           <div className="flex items-center justify-between flex-wrap gap-y-4">
            <div className="w-fit rounded-md bg-primary px-4 py-3">
                <div className="flex items-center">
                    <Github className="size-5 text-white"/>
                    <div className="ml-2">
                        <p className="text-sm font-medium text-white">
                          This Project is linked to {' '}
                         <Link 
                            href={project.repositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-white/80 hover:underline"
                         >
                            {project.repositoryUrl}
                            <ExternalLink className="ml-1 size-4"/>
                         </Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="h-4">
               <div className="flex items-center gap-4">
                 TeamMembers
                 Invitations
                 Archive
               </div>
            </div>
           </div>
           <div className="mt-4">
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                  Ask a Question
                  Meeting
             </div>
           </div>
           <div className="mt-8"></div>
           commits logs
       </div>
    ) 
};

export default Dashboard;

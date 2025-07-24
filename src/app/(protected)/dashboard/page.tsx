'use client';
import React, { useState } from "react";
import Link from "next/link";
import useProject from "@/hooks/use-project";
import { ExternalLink, Github, RefreshCw } from "lucide-react";
import CommitLog from "./commit-log";
import { api } from "@/trpc/react";

const Dashboard = () => {
    const {project, projectId} = useProject();
    const [isPolling, setIsPolling] = useState(false);
    const pollCommitsMutation = api.project.pollCommits.useMutation();
    const utils = api.useUtils();
    
    const handlePollCommits = async () => {
        if (!projectId) return;
        
        setIsPolling(true);
        try {
            const result = await pollCommitsMutation.mutateAsync({ projectId });
            console.log(`Successfully polled ${result.count} commits`);
            // Refresh the commits data
            await utils.project.getCommits.invalidate({ projectId });
        } catch (error) {
            console.error('Error polling commits:', error);
        } finally {
            setIsPolling(false);
        }
    };
    
    if (!project) {
        return (
            <div className="p-6">
                <p className="text-gray-500">No project selected. Please select a project first.</p>
            </div>
        );
    }

    return(
        
       <div className="p-6">
        {project?.id}
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
                 <button
                    onClick={handlePollCommits}
                    disabled={isPolling}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <RefreshCw className={`size-4 ${isPolling ? 'animate-spin' : ''}`} />
                    {isPolling ? 'Fetching Commits...' : 'Fetch Commits'}
                 </button>
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
          <CommitLog/>
       </div>
    ) 
};

export default Dashboard;

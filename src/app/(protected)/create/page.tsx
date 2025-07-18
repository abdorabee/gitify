'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


type FormInput ={
    repoUrl : string;
    projectName:string;
    githubToken:string;
}
const CreatePage = () => {
    const{register, handleSubmit,reset} = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    function onSubmit(data:FormInput){
       createProject.mutate({
        name: data.projectName,
        repositoryUrl: data.repoUrl,
        gitToken: data.githubToken
       },{
        onSuccess: () => {
           toast.success('Project created successfully')
           reset()
           refetch()
        },
        onError: () => {
           toast.error('Failed to create project')
        }
       })
       return true;
    }
    return (
      <div className="flex items-center gap-12 h-full justify-center">
        <div>
            <div>
                <h1 className="font-semibold text-2xl"> Link your repository</h1>
                <p className=" text-sm text-muted-foreground">Connect your repository to Gitify to start using it.</p>
            </div>
            <div className="h-4"></div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input 
                  {...register('projectName', {required:true})}
                  placeholder="Project Name"
                  required/>
                  <div className="h-4"></div>
                  <Input 
                  {...register('repoUrl', {required:true})}
                  placeholder="Repository URL"
                  type="url"
                  required/>
                  <div className="h-4"></div>
                  <Input 
                  {...register('githubToken')}
                  placeholder="Github Token (Optional)"
                 />
                 <div className="h-4"></div>
                 <Button type="submit" disabled={createProject.isPending}>Create Project</Button>
                </form>
            </div>
        </div>
      </div>
    )
}

export default CreatePage

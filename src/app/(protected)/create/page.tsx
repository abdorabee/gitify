'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";


type FormInput ={
    repoUrl : string;
    projectName:string;
    githubToken:string;
}
const CreatePage = () => {
    const{register, handleSubmit,reset} = useForm<FormInput>();

    function onSubmit(data:FormInput){
       window.alert(JSON.stringify(data,null,2))
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
                 <Button type="submit">Create Project</Button>
                </form>
            </div>
        </div>
      </div>
    )
}

export default CreatePage

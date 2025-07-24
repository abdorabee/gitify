import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
       z.object({
        name: z.string(),
        repositoryUrl: z.string(),
        gitToken: z.string().optional(),
       })
    ).mutation(async({ctx,input}) => {
        const project = await ctx.db.project.create({
            data:{
                name: input.name,
                repositoryUrl: input.repositoryUrl,
                userToProjects:{
                    create:{
                        userId: ctx.user.userId!,
                    }
                }
            }
        })
        console.log('input',input)
        
        // Automatically poll commits for the newly created project
        try {
            console.log(`Auto-polling commits for new project: ${project.id}`);
            await pollCommits(project.id);
            console.log(`Successfully auto-polled commits for project: ${project.id}`);
        } catch (error) {
            console.error(`Error auto-polling commits for project ${project.id}:`, error);
            // Don't throw error here - project creation should still succeed even if commit polling fails
        }
        
        return project;
    }),
    getProjects: protectedProcedure.query(async({ctx}) => {
        const projects = await ctx.db.project.findMany({
            where:{
                userToProjects:{
                    some:{
                        userId: ctx.user.userId!,
                    }
                },
                
            }
        })
        return projects
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async({ctx,input})=>{return await ctx.db.commit.findMany({
        where:{
            projectId: input.projectId
        }
    })}),
    
    pollCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).mutation(async({ctx, input}) => {
        try {
            console.log(`Starting to poll commits for project: ${input.projectId}`);
            const result = await pollCommits(input.projectId);
            const count = Array.isArray(result) ? result.length : result.count;
            console.log(`Successfully polled ${count} commits for project: ${input.projectId}`);
            return { success: true, count };
        } catch (error) {
            console.error(`Error polling commits for project ${input.projectId}:`, error);
            throw new Error(`Failed to poll commits: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    })
});

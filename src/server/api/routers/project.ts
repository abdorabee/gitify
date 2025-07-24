import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
    })})
});

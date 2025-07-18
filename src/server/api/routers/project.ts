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
    })
});

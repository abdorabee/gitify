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
        console.log(input,'input')
        return true;
    })
});

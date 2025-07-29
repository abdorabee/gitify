import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github";
import {Document} from "@langchain/core/documents";
import { summarizeCode,generateEmbedding } from "./gemini";
import { db } from "@/server/db";

export const LoadGithubRepo = async(githubUrl:string,githubtoken?:string)=>{
    const loader = new GithubRepoLoader(githubUrl,{
        accessToken:githubtoken || '',
        branch:'main',
        ignoreFiles:['package-lock.json','yarn.lock','pnpm-lock.yaml','node_modules','dist','build,bun.lockb'],
        recursive:true,
        unknown:'warn',
        maxConcurrency:5,
        
    })
    const docs = await loader.load()
    return docs
}

export const indexGithubRepo = async(projectId:string,githubUrl:string,githubtoken?:string)=>{
    const docs = await LoadGithubRepo(githubUrl,githubtoken)
    const allEmbeddings = await generateEmbeddings(docs);
    await Promise.allSettled(allEmbeddings.map(async(embedding,index)=>{
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if(!embedding) return

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data:{
                sourceCode:embedding.sourceCode,
                summary:embedding.summary,
                fileName:embedding.fileName,
                projectId
            }
        })
        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        `
    }))
}

const generateEmbeddings = async(docs:Document[])=>{
    return await Promise.all(docs.map(async doc =>{
        const summary = await summarizeCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.stringify(doc.pageContent),
            fileName: doc.metadata.source
        }
    }))
}
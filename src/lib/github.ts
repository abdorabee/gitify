import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export default octokit;


const  githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitMessage: string;
    commitHash: string;
    commitAuthorAvatar: string;
    commitAuthorName: string;
    commitDate: string;
}

export const getCommitHash = async (githubUrl: string): Promise<Response[]>=>{
    //https://github.com/docker/genai-stack
    const [owner,repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo){
        throw new Error('Invalid github url')
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })
   const sortedCommits = data.sort((a:any,b:any)=>new Date(a.commit.committer.date).getTime() - new Date(b.commit.committer.date).getTime()) as any[];
   return sortedCommits.slice(0,15).map((commit:any)=>({
    commitHash: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorAvatar: commit.author.avatar_url ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitDate: commit.commit?.committer?.date ?? ""

   }))
}

console.log(await getCommitHash(githubUrl))


export const pollCommits = async (projectId:string) => {
   const result = await fetchProjectGithubUrl(projectId);
   if (!result) {
       console.error(`Cannot poll commits: Project ${projectId} not found`);
       return [];
   }
   const {project,githubUrl} = result;
   const commitHashes = await getCommitHash(githubUrl)
   const unprocessedCommits = await filterUnprocessedCommits(projectId,commitHashes)
   const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => summarizeCommit(githubUrl, commit.commitHash)))
   const summaries = summaryResponses.map((response)=>{
    if(response.status ==='fulfilled'){
        return response.value as string
    }
    return ""
   })

   const commits = await db.commit.createMany({
    data: summaries.map((summary,index)=>{
        return{
            projectId:projectId,
            commitHash:unprocessedCommits[index]!.commitHash,
            commitMessage:unprocessedCommits[index]!.commitMessage,
            commitAuthorAvatar:unprocessedCommits[index]!.commitAuthorAvatar,
            commitAuthorName:unprocessedCommits[index]!.commitAuthorName,
            commitDate:unprocessedCommits[index]!.commitDate,
            summary
        }
    })
   })
   return commits
   
}

async function summarizeCommit(githubUrl:string, commitHash:string){
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers:{
            Accept: 'application/vnd.github+json'
        }
    })
    return await aiSummarizeCommit(data) || ""
}
async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            repositoryUrl: true
        }
    })
    if (!project) {
        console.warn(`Project with ID ${projectId} not found`);
        return null;
    }
    return {project,githubUrl:project?.repositoryUrl}

}

async function filterUnprocessedCommits(projectId:string , commitHashes:Response[]){
   const processedCommits = await db.commit.findMany({
    where:{projectId}
   })
   const unprocessedCommits = commitHashes.filter(commit => !processedCommits.some(processedCommit => processedCommit.commitHash === commit.commitHash))
   return unprocessedCommits

}

await pollCommits('cm3ah9p7x0000on1c0mkvs2hz').then(console.log)
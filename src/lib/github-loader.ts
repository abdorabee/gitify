import {GithubRepoLoader} from "@langchain/community/document_loaders/web/github";

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

console.log(await LoadGithubRepo('https://github.com/abdorabee/gitify'))
import {GoogleGenerativeAI} from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({model: "gemini-2.0-flash-exp"});

export const summarizeCommit = async (diff:string) => {
 // https://github.com/docker/genai-stack/commit/<commitHash>.diff
 const response = await model.generateContent([
    `You are an expert software engineer , and you are tying to summarize a git diff.
    Reminder about the git diff format: 
    for every file , there is a few metadata lines, like (for example):

    diff --git a/README.md b/README.md
    index 1234567..89abcde 100644
    --- a/README.md
    +++ b/README.md

    this means that the file README.md has been modified in this commit. Note that this is only an example
    then there is a specificer of the lines that have been modified.
    A line starting with \`+\` means that the line has been added.
    A line starting with \`-\` means that the line has been removed.
    A line that start with neither \`+\` nor \`-\` is code given for the context and better understanding.
    [...]
    EXAMPLE SUMMARY COMMITS:
    \`\`\`
    *Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/src/recordings.ts] , [packages/server/src/constants.ts]
    *Fixed a typo in the github action name [github/workflows/commit.yml]
    *Moved the \`octokit\` initialization to a separate file [src/octokit.ts],[src/index.ts]
    *Added on OpenAi API for completions [packages/utils/apis/openai.ts]
    *Lowered numeric tolerance for test files
    \`\`\`
    Most commits will have less comments this examples list.
    the last comments does not include the file names.
    because the were more thatn two relaevant tfiles in the hypothetical commit.
    it is a given only as an example of appropriate comments.
    `, `please summarize the following file: \n ${diff}`
 ])
 return response.response.text();
}
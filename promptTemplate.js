
import { ChatOllama } from '@langchain/ollama';
import { PromptTemplate } from "@langchain/core/prompts"
const model = new ChatOllama({
    model: "llama3.2:3b"
});

const template = "My favarit book is {subject} also more {number}";

const promptTemplate = new PromptTemplate({
    template: template,
    inputVariables: ["subject", "number"]
})
async function createPrompt() {
    const formattedPrompt = await promptTemplate.format({
        subject: "biology",
        number: "3"
    })
    console.log(formattedPrompt);
};
createPrompt();
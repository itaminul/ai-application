import { ChatOllama } from "@langchain/ollama"
import { ChatPromptTemplate } from "@langchain/core/prompts"
const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: 'llama3.2:3b',
  temperature: 0
});

const promptTemplate = ChatPromptTemplate.fromTemplate(
    "Write a shot poem about {topic}"
)

const chain = promptTemplate.pipe(model)
const response = await chain.invoke({ topic: "the ocean"})
console.log(response.content);



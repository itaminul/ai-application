import { ChatOllama } from "@langchain/ollama"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers"
const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: 'llama3.2:3b',
  temperature: 0
});


const promptTemplate = ChatPromptTemplate.fromTemplate(
    "List three fruits that are {color}"
)
const outputParser = new CommaSeparatedListOutputParser();
const chain = promptTemplate.pipe(model).pipe(outputParser)
const response = await chain.invoke({ color: "green"})
console.log(response);



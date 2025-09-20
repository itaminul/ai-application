import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';
import {  StringOutputParser } from "@langchain/core/output_parsers"
const model = new ChatOllama({
  model: "llama3.2:3b"
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that transalted English to French."],
  ["human", "{input}"]
]);

const parser  = new StringOutputParser()
const chain = prompt.pipe(model);
const response = await chain.invoke({
  input: "What is AI?"
})

console.log(response.content)
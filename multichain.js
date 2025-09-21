import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';
import {  StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"

const model = new ChatOllama({
  model: "llama3.2:3b"
});

const selfPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Tell about. {topic}"],
  ["human", "{input}"]
]);

const processPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Tell about your family members"],
  ["human", "{process}"]
])
const chain = RunnableSequence.from([
  selfPrompt,
  model,
  {process: (output) => output.content},
  processPrompt,
  model
])

const response = await chain.invoke({ topic: "you", input: "Tell me about your process" });
console.log(response.content);
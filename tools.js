import { tool } from "@langchain/core/tool";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import "dotenv/config";
import { ChatOllama } from '@langchain/ollama'
import { z } from 'zod'

const model = new ChatOllama ({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'llama3.2:3b',
  // model: 'deepseek/deepseek-r1-0528:free',
  // configuration: {
  //   baseURL: "https://openrouter.ai/api/v1",
  // },
});

const messages = [
  new SystemMessage("Translate this following from English into Bengali"),
  new HumanMessage("hi")
]
const result = await model.invoke("Hello");
await model.invoke([{ role: "user", content: "hello"}])
const stream = await model.stream(messages)
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(`${chunk.content}`)
}
// console.log(result1.content);

/*
const { ChatOpenAI } = require("@langchain/openai");
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import "dotenv/config";
const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-r1-0528:free"
});
const  userInput = process.argv[2] || "what is nodejs"
// const response = await askModel("what is money")
console.log(userInput)



*/



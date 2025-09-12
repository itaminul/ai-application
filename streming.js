import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatAnthropic } from "@langchain/anthropic";
import fs from 'fs'
import "dotenv/config";
import { type } from "os";
const model = new ChatAnthropic({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-r1-0528:free',
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});


const prompt = ChatPromptTemplate.fromTemplate("tell me joke about {topic}")
const parser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(parser);
for await (const event of await chain.streamEvents(
  
{ topic: "parrot"},
{ version: "v2"}
  
)){
  if(event.event === "on_chat_model_stream") {
    console.log(event);
  }
}
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



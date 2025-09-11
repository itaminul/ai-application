import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import fs from 'fs'
import "dotenv/config";
import { type } from "os";
const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-r1-0528:free',
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
const askModel = async (input) => {
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage("You are a helpful assistant."),
    new HumanMessage(input),
  ])
  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  return await chain.invoke({ input })

}

const imageBase64 = fs.readFileSync("cat.png").toString("base64")
const res = await model.invoke([
  {
    role: "user",
    content: [
      { type: "text", text: "Describe this picture in detail"},
      { type: "image_url", image_url: `data:image/png;base64, ${imageBase64}`}
    ]
  }
])
console.log(res.content)
// Example usage:
const main = async () => {
  const response = await askModel("What is the nodejs?");
 // console.log(response); // Expected: "Paris."
};

main();

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



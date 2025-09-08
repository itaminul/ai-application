import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import "dotenv/config";
console.log(process.env.OPENROUTER_API_KEY)
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
// Example usage:
const main = async () => {
  const response = await askModel("What is the nodejs?");
  console.log(response); // Expected: "Paris."
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



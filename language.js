import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import "dotenv/config";
const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-r1-0528:free',
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

// const messages = [
//    new SystemMessage("Translate the following from English to Italian."),
//     new HumanMessage("hi"),
// ]
// const mess = await model.invoke(messages)
// await model.invoke("Hello");
// await model.invoke([{ role: "user", content: "This is" }])
// const mess1 = await model.invoke([ new HumanMessage("hi!")])
//
const systemTemplate = "Translate the following from English to {language}"
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"]
])
const promptValue = await promptTemplate.invoke({
  language: "italian",
  text: "hi!"
})
promptValue.toChatMessages();
const response = await model.invoke(promptValue);
console.log(`${response.content}`)

/*
const askModel = async (input) => {
  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage("Translate the following from English to Italian."),
    new HumanMessage(input),
  ])
  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  // return await chain.invoke({ input })
  await model.invoke("hellow");
  await model.invoke([{ role: "user", content: "Hello"}])
  await model.invoke([new HumanMessage("hi!")])

const stream = await model.stream(prompt)
const chunks = [];
for await (const chunks of stream){
  chunks.push(chunks);
  console.log(`${chunks.content}`)
}
}
// Example usage:
const main = async () => {
  const response = await askModel("What is the nodejs?");
  //console.log(response); // Expected: "Paris."
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



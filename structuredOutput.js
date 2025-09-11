import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from "zod"
import "dotenv/config";
const model = new ChatOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'deepseek/deepseek-r1-0528:free',
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    name: z.string(),
    age:z.number(),
    department:z.string()
  })
)
const prompt = `একজন কর্মীর তথ্য দাও। অবশ্যই JSON আকারে দিতে হবে। 
Schema: ${parser.getFormatInstructions()}`
const response = await model.invoke(prompt)
const result = await parser.parse(response.content);

console.log(result)

//key genI terms

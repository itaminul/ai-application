import { ChatOllama } from "@langchain/ollama";
import { z } from 'zod';
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    name: z.string().describe("Person name"),
    age: z.number().describe("Person age"),
    city: z.string().describe("Person city name"),
  })
);

const formatInstructions = parser.getFormatInstructions();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Your response must be in the following JSON  format:\n{format_instructions}\nOnly return valid JSON."],
  ["human", "Here is user data: Name: {name}, Age: {age}, City:{city}"]
]);

const model = new ChatOllama({
  model: 'llama3.2:3b',
});

const chain = prompt.pipe(model).pipe(parser);
const userInput = {
  name: "Aminul Huq",
  age: 40,
  city: "Dhaka"
}
try {
  const response = await chain.invoke({
    ...userInput,
    format_instructions: formatInstructions
  });
  console.log("Parsed response:", response);
} catch (e) {
  console.error("Parsing failed:", e);
}

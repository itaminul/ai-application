import { ChatOllama } from "@langchain/ollama"
import {z} from 'zod'

const model = new ChatOllama ({
  model: 'llama3.2:3b',
});

const joke = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.number().optional().describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke);

const response = JSON.parse(structuredLlm);
console.log(response);
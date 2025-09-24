import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOllama } from "@langchain/ollama"
import { z } from 'zod'
import "dotenv/config";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: 'llama3.2:3b',
  temperature: 0
});


const response = await model.invoke([
  ["system", "You are a helpful assistant that translates English to French."],
  ["human", "I love programming."]
])



console.log(response)
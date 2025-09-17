import express from 'express';
import bodyParser from 'body-parser';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';
const app = express();
app.use(bodyParser.json());

const model = new ChatOllama({
  model: "llama3.2:3b"
});

const prompt = await model.invoke(
  "What is Nodejs"
)
console.log(prompt);
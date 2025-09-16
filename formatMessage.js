import express from 'express';
import bodyParser from 'body-parser';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const app = express();
app.use(bodyParser.json());

const prompt = ChatPromptTemplate.fromMessages([
   ["system", "You are a helpful assistant answering in {language}."],
    ["human", "{question}"]
])

const messages = await prompt.formatMessages({
    language: "English",
    question: "what is nodejs?"
});


console.log(messages);
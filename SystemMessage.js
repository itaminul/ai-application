import express from 'express';
import bodyParser from 'body-parser';
import { ChatOllama } from '@langchain/ollama'
import { HumanMessage, SystemMessage } from '@langchain/core/messages';


const app = express();
app.use(bodyParser.json());
const model = new ChatOllama({
    model:"llama3.2:3b"
})
const prompt = await model.invoke([
    new SystemMessage("You are helpful assistant who answer in English."),
    new HumanMessage("What is node js")
])

console.log(prompt.content);
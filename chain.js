import express from 'express';
import bodyParser from 'body-parser';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';
const app = express();
app.use(bodyParser.json());

const model = new ChatOllama({
  model: "llama3.2:3b"
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant answering in {language}.\nIf context provided, use it to answer."],
  ["human", "Question: {question}\nContext: {context}"]
]);



async function retrieveContext(question) {
  // সাধারণত এখানে Pinecone, Supabase Vector ইত্যাদিতে সার্চ হয়
  if (question.includes("LangChain.js")) {
    return "LangChain.js হলো JavaScript এ LangChain লাইব্রেরি যা LLM অ্যাপ বানাতে সাহায্য করে।";
  } else {
    return "কোনো কনটেক্সট মেলেনি।";
  }
}
async function answerWithContext(language, question) {
    const context = await retrieveContext(question);

    const messages = await prompt.formatMessages({
    language,
    question,
    context
});
const response = await model.invoke(messages)
return response.content;
}

const ans = await answerWithContext("Bengali", "LangChain.js কী?");
console.log(ans);
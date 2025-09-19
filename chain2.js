import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';

const model = new ChatOllama({
  model: "llama3.2:3b"
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert on the book '{book}'. Use this knowledge to answer the user's questions."],
  ["human", "Pages: {number}"]
]);


async function givenQuestoin(book, number) {
  const messages = await prompt.formatMessages({
    book,
    number
  })
  const res3 = await model.invoke(messages)
  return res3.content

}

const res = await givenQuestoin("Nobel", "54")

console.log(res)
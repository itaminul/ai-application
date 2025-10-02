import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { JsonOutputParser } from "@langchain/core/output_parsers"

const ollamaModel = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: 'llama3.2:3b',
    temperature: 0
});

const prompt = ChatPromptTemplate.fromTemplate(
    `Extract the following from the query: city and weather condition.
  Respond only in JSON format like {{"city": "value", "condition": "value"}}.
  Query: {query}`
);

const chain = prompt.pipe(ollamaModel).pipe(new JsonOutputParser)
const response = await chain.invoke({ query: "What is the weather in Bangladesh today? It's sunny." })
console.log(response);
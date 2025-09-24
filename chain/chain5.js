import { ChatOllama } from "@langchain/ollama"
const ollama = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: 'llama3.2:3b',
  temperature: 0
});

const chain = ollama
const stream = await chain.stream("What is the capital of France?")

for await (const chunk of stream) {
  const text = chunk.text || chunk.data || '';
  process.stdout.write(text);
}

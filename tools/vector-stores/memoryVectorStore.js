import { OllamaEmbeddings } from "@langchain/ollama";

import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { Document } from "@langchain/core/documents"

const embeddings = new OllamaEmbeddings({
  baseUrl: "http://localhost:11434",
  model: "nomic-embed-text",
});


// Sample documents
const docs = [
  new Document({ pageContent: "LangChain is a framework for building LLM applications." }),
  new Document({ pageContent: "Ollama runs LLMs locally on your machine." }),
];

// Create the vector store and add documents
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Retrieve similar documents
const results = await vectorStore.similaritySearch("What is LangChain?", 1);
console.log(results[0].pageContent); 
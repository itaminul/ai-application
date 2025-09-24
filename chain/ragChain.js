import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
// Initialize the Ollama model and embeddings
const ollama = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama3.2:3b",
});
const embeddings = new OllamaEmbeddings({
  baseUrl: "http://localhost:11434",
  model: "nomic-embed-text",
});


// Sample document
const document = `
    The Apollo 11 mission landed the first humans on the moon in 1969.
    Neil Armstrong was the first man to walk on the moon, followed by Buzz Aldrin.
  `;

// Split the document into chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});
const docs = await splitter.createDocuments([document]);

// Create a vector store
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Create a retriever
const retriever = vectorStore.asRetriever();

// Create a prompt template
const prompt = ChatPromptTemplate.fromTemplate(
  "Answer the question based on the context:\n\nContext: {context}\n\nQuestion: {question}"
);

// Create the RAG chain
const ragChain = await createStuffDocumentsChain({
  llm: ollama,
  prompt,
  outputParser: new StringOutputParser(),
});

// Invoke the chain with a question
const question = "Who was the first man on the moon?";
const retrievedDocs = await retriever.invoke(question);
const response = await ragChain.invoke({
  question,
  context: retrievedDocs,
});

console.log(response);

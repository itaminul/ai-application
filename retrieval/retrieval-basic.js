import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
const ollama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b",
    temperature: 0.7,
    maxTokens: 1000,
    maxRetries: 2
});

const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's questoin from the following context.
    Context: {context}
    Question: {input}`
)

const chain = await createStuffDocumentsChain({
    llm: module,
    prompt
})
const loader = new CheerioWebBaseLoader("https://google.github.io/adk-docs/");
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150
})

const splitDocs = await splitter.splitDocuments(docs)
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text"})
const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
)

console.log(splitDocs);
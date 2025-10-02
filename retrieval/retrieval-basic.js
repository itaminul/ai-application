import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
const ollama = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3.2:3b",
    temperature: 0.7,
    maxTokens: 1000,
    maxRetries: 2
});

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        "Yur are a helpful assistant. Use the following cotext to answer the user's question"
    ],
    [
        "human",
        "Context:\n{context}\n\nQuestion: {input}"
    ]
]
)

const chain = await createStuffDocumentsChain({
    llm: ollama,
    prompt
})

const urls = [
    "https://aws.amazon.com/blogs/aws/introducing-amazon-elastic-vmware-service-for-running-vmware-cloud-foundation-on-aws/?nc2=h_dsc_ex_s4",
    "https://mzamin.com/news.php?news=182134"
]

const docsArrays = await Promise.all(
    urls.map(url => {
        const loader = new CheerioWebBaseLoader(url);
        return loader.load();
    })
)
const docs = docsArrays.flat();
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150
})

const splitDocs = await splitter.splitDocuments(docs)
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" })
const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
)

const retriever = vectorStore.asRetriever({ k: 2 })
const queries = [
    "Introducing Amazon Elastic VMware Service",
    "About Thalapathy Vijay rally in India"
]
for (const query of queries) {
    const retrievedDocs = await retriever.invoke(query)
    const response = await chain.invoke({
        input: query,
        context: retrievedDocs
    })
    console.log(response);

}


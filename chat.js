import express from 'express';
import bodyParser from 'body-parser';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";


import path from "path";

const app = express();
app.use(bodyParser.json());

//load local text file
const filePath = './ai_research.pdf'
const rawDocs = await loadFileByType(filePath);

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
const splitDocs = await splitter.splitDocuments(rawDocs);


const embeddings = new OllamaEmbeddings({
  baseUrl: "http://localhost:11434",
  model: "nomic-embed-text"
})
const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
console.log('PDF embedded and stored.');

const model = new ChatOllama({
  model: "llama3.2:3b"
});

app.post('/chat', async (req, res) => {
  const { message, tone = "friendly" } = req.body;

  try {

    const docs = await vectorStore.similaritySearch(message, 3);
    const contextText = docs.map(doc => doc.pageContent).join("\n\n");
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Use the following context to answer the question:\n\n{context}\n\nRespond in a {tone} tone."],
      ["user", "{user_input}"]
    ]);

    const formattedPrompt = await prompt.formatMessages({
      tone,
      user_input: message,
      stream: true,
      context: contextText,
      option: {
        temperature: 0.7
      }
    });
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders?.(); // For compatibility with some proxies

    const stream = await model.stream(formattedPrompt);

    for await (const chunk of stream) {
      const text = chunk?.content || '';
     // console.log(text)
      res.write(text);
      res.flush?.(); // <--- force flush if supported
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Chatbot server running at http://localhost:3000");
});


async function loadFileByType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  let loader;

  switch (ext) {
    case '.pdf':
      loader = new PDFLoader(filePath);
      break;
    case '.docx':
      loader = new DocxLoader(filePath);
      break;
    case '.csv':
      loader = new CSVLoader(filePath);
      break;
    case '.txt':
      loader = new TextLoader(filePath);
      break;
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }

  const docs = await loader.load();
  return docs;
}
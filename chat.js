import express from 'express';
import bodyParser from 'body-parser';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama'
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const app = express();
app.use(bodyParser.json());

//load local text file
const loader = new PDFLoader('./ai_research.pdf')
const docs = await loader.load();

//console.log(docs[0].pageContent); // This will show readable English text
const rawDocs = await loader.load();
//split into chunks
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
const splitDocs = await splitter.splitDocuments(rawDocs);

//console.log(splitDocs);
const embeddings = new OllamaEmbeddings({
  baseUrl: "http://localhost:11434",
  model: "nomic-embed-text"
})
 const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
 console.log('PDF embedded and stored.');
// Create Ollama model (local)
const model = new ChatOllama({
  model: "llama3.2:3b"                 
});

const query = "tell me about Prof. Neha Saini";
const results = await vectorStore.similaritySearch(query, 3);

// console.log("Top Matches:");
results.forEach((doc, idx) => {
  console.log(`\n[${idx + 1}]:\n${doc.pageContent}`);
});

// Create a ChatPromptTemplate
// (variables: tone + user_input)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that replies in a {tone} tone."],
  ["user", "{user_input}"]
]);

// StringOutputParser to get plain text back
const parser = new StringOutputParser();

// Endpoint
app.post('/chat', async (req, res) => {
  const { message, tone = "friendly" } = req.body;

  try {
    // Fill the template with values
    const formattedPrompt = await prompt.formatMessages({
      tone,
      user_input: message,
      stream: true,
      option: {
        temperature: 0.7
      }
    });

    // Send to Ollama model
    const rawResponse = await model.invoke(formattedPrompt);

    // Parse to string
    const reply = await parser.invoke(rawResponse);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Chatbot server running at http://localhost:3000");
});
